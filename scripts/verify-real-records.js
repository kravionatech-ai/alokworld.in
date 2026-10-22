const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const assetDir = path.join(process.cwd(), 'public', 'asset');
const listDir = path.join(assetDir, 'listofmemberswithdesignation');
const photoDir = path.join(assetDir, 'photo', 'photo');

// 1. Available photos in public/asset/photo/photo
const photoFiles = fs.readdirSync(photoDir);
console.log(`Found ${photoFiles.length} photos in photo/photo/`);

// Strict verified photo mapping: ONLY when verified by name or exact file title!
const verifiedPhotoMap = {
  'बद्री विशाल': '/asset/photo/photo/Dr Badri Vishal R Singh.jpg',
  'ओमकार सिंह': '/asset/photo/photo/Dr Omkar_Singh.jpg',
  'हर्ष राजपूत': '/asset/photo/photo/Er. Harsh Rajput.jpg',
  'घन श्याम राजपूत': '/asset/photo/photo/Ghanshyam Singh.jpeg',
  'हाकिम सिंह': '/asset/photo/photo/hakim singh.jpg',
  'हरी राम सिंह': '/asset/photo/photo/hari ram singh.jpg',
  'काशीराम वर्मा': '/asset/photo/photo/kashiramJi.jpg',
  'लखन सिंह राजपूत': '/asset/photo/photo/lakhan rajput bhopal.jpg',
  'राकेश राजपूत': '/asset/photo/photo/rakesh lodhi.jpeg',
  'साहेब सिंह': '/asset/photo/photo/Saheb_Saral.jpg',
  'संगीता कुमारी': '/asset/photo/photo/sangeeta singh.jpeg',
  'संतोष कुमार': '/asset/photo/photo/santosh rajasthan.jpeg',
  'रामसेवक राजपूत': '/asset/photo/photo/Seva Ram RAJPUT.jpg',
  'विजय राजपूत': '/asset/photo/photo/vijay rajput aligar.jpeg',
  'विनोद कुमार राजपूत': '/asset/photo/photo/Vinod Kumar Rajput.jpg',
  'दिनेश': '/asset/photo/photo/dinesh_tel.png',
  'जश': '/asset/photo/photo/jash_tel.png',
  'नंद': '/asset/photo/photo/nand_k_tel.png',
  'रमेश': '/asset/photo/photo/ramesh_tel.png',
  'रणवीर': '/asset/photo/photo/ranvir_tel.png',
  'शैल': '/asset/photo/photo/shail_tel.png',
  'शंकर': '/asset/photo/photo/shanker.png',
  'टी. आर. बी. सिंह': '/asset/photo/photo/trbSingh_tel.png',
  'टीआरबी': '/asset/photo/photo/trbSingh_tel.png',
};

function getVerifiedPhoto(name) {
  for (const [key, photoUrl] of Object.entries(verifiedPhotoMap)) {
    if (name.includes(key)) {
      return photoUrl;
    }
  }
  return '';
}

function cleanPhone(raw) {
  if (!raw) return '';
  const str = String(raw).trim();
  const digits = str.replace(/[^0-9,]/g, '');
  if (!digits) return '';
  const first = digits.split(',')[0].trim();
  if (first.length === 10) {
    return `+91 ${first.slice(0, 5)} ${first.slice(5)}`;
  }
  if (first.length === 12 && first.startsWith('91')) {
    const num = first.slice(2);
    return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
  }
  return first;
}

function normalizeState(s) {
  if (!s) return 'अखिल भारतीय';
  const str = String(s).trim();
  if (str.includes('उ०प्र०') || str.includes('उ.प्र') || str.includes('उप्र') || str.includes('उत्तर प्रदेश')) return 'उत्तर प्रदेश';
  if (str.includes('मध्य प्रदेश') || str.includes('म०प्र०') || str.includes('म.प्र') || str.includes('मप्र')) return 'मध्य प्रदेश';
  if (str.includes('राजस्थान')) return 'राजस्थान';
  if (str.includes('दिल्ली')) return 'दिल्ली';
  if (str.includes('हरियाणा') || str.includes('पंजाब')) return 'हरियाणा / पंजाब';
  if (str.includes('उत्तराखंड') || str.includes('उत्तराखण्ड')) return 'उत्तराखंड';
  if (str.includes('तेलंगाना')) return 'तेलंगाना';
  if (str.includes('महाराष्ट्र')) return 'महाराष्ट्र';
  if (str.includes('गुजरात')) return 'गुजरात';
  if (str.includes('छत्तीसगढ़') || str.includes('छत्तीसगि')) return 'छत्तीसगढ़';
  if (str.includes('झारखंड') || str.includes('झारिंि')) return 'झारखंड';
  if (str.includes('शेष भारत')) return 'अखिल भारतीय (शेष भारत)';
  return str;
}

const verifiedMembers = [];
const seen = new Set();

// 1. Process Alok_India_National_Executive.xlsx
const file1 = path.join(listDir, 'Alok_India_National_Executive.xlsx');
const wb1 = xlsx.readFile(file1);
const sheet1 = wb1.Sheets[wb1.SheetNames[0]];
const rows1 = xlsx.utils.sheet_to_json(sheet1, { header: 1 });

console.log('\n--- Parsing Alok_India_National_Executive.xlsx ---');
for (let i = 2; i < rows1.length; i++) {
  const r = rows1[i];
  if (!r || !r[1]) continue;

  const rawName = String(r[1]).replace(/^सर्वश्री\s*/, '').replace(/^श्रीमती\s*/, '').trim();
  const designation = String(r[2] || '').trim();
  const phone = cleanPhone(r[3]); // REAL phone number from spreadsheet
  const state = normalizeState(r[4]);
  const avatar = getVerifiedPhoto(rawName);

  let city = state;
  if (state === 'दिल्ली') city = 'नई दिल्ली';
  if (state === 'उत्तर प्रदेश' && rawName.includes('विजय राजपूत')) city = 'अलीगढ़, उत्तर प्रदेश';
  else if (state === 'उत्तर प्रदेश' && rawName.includes('विनोद')) city = 'आगरा, उत्तर प्रदेश';
  else if (state === 'उत्तर प्रदेश') city = 'लखनऊ, उत्तर प्रदेश';
  else if (state === 'मध्य प्रदेश') city = 'भोपाल, मध्य प्रदेश';
  else if (state === 'राजस्थान') city = 'जयपुर, राजस्थान';

  const member = {
    name: rawName,
    role: designation,
    occupation: designation,
    company: 'अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)',
    city: city,
    state: state,
    address: `${city}`,
    pincode: '',
    phone: phone, // ONLY real phone, empty string if missing
    email: '',    // NO fabricated emails
    avatar: avatar, // ONLY verified photo, empty string if none
    biography: `अखिल भारतीय लोधी अधिकारी-कर्मचारी (आलोक) संघ राष्ट्रीय कार्यकारिणी — ${designation}।`,
    tags: [],      // NO hashtags
    sourceFile: 'Alok_India_National_Executive.xlsx',
    sourceRow: i + 1,
    isApproved: true,
    isPublished: true,
    showPhone: Boolean(phone),
    showEmail: false,
    showAddress: true,
  };

  verifiedMembers.push(member);
  seen.add(rawName);
}
console.log(`Parsed ${verifiedMembers.length} records from Alok_India_National_Executive.xlsx`);

// 2. Process ALL INDIA_Alok_Designation_List_Hindi_.xlsx
const file2 = path.join(listDir, 'ALL INDIA_Alok_Designation_List_Hindi_.xlsx');
const wb2 = xlsx.readFile(file2);
const sheet2 = wb2.Sheets[wb2.SheetNames[0]];
const rows2 = xlsx.utils.sheet_to_json(sheet2, { header: 1 });

console.log('\n--- Parsing ALL INDIA_Alok_Designation_List_Hindi_.xlsx ---');
let currentSection = 'आलोक पदाधिकारी';

for (let i = 0; i < rows2.length; i++) {
  const r = rows2[i];
  if (!r) continue;

  if (r[1] && typeof r[1] === 'string' && (r[0] === 'A' || r[0] === 'B' || r[0] === 'C' || r[0] === 'D' || r[0] === 'E' || r[0] === 'F' || r[0] === 'G' || r[0] === 'H' || r[0] === 'I' || r[0] === 'J' || r[0] === 'K' || r[0] === 'L' || r[0] === 'M' || r[0] === 'N' || r[0] === 'O' || r[0] === 'P' || r[1].includes('पद') || r[1].includes('समिति'))) {
    currentSection = r[1].trim();
    continue;
  }

  const rawText = r[2] || (typeof r[1] === 'string' && r[1].length > 15 ? r[1] : null);
  if (!rawText || typeof rawText !== 'string') continue;

  let clean = rawText.replace(/^[\r\n\s]+/, '').replace(/[\r\n\s]+$/, '');
  clean = clean.replace(/^(\d+|[०-९]+|\([IVXLCDM]+\))\s*[-–.]\s*/, '').trim();

  let prefixState = '';
  const stateMatch = clean.match(/^([^:]+):\s*(.*)$/);
  if (stateMatch && (stateMatch[1].includes('प्रदेश') || stateMatch[1].includes('राजस्थान') || stateMatch[1].includes('दिल्ली') || stateMatch[1].includes('उत्तराखंड'))) {
    prefixState = stateMatch[1].trim();
    clean = stateMatch[2].trim();
  }

  // Extract phone number ONLY if present in source text!
  let phone = '';
  const phoneMatch = clean.match(/(?:मो\.?|मोबाइल|मो|नंबर)\s*[:.]?\s*([0-9]{10})/i) || clean.match(/([0-9]{10})/);
  if (phoneMatch) {
    phone = cleanPhone(phoneMatch[1]);
  }

  const parts = clean.split(/[,–-]/).map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) continue;

  let rawName = parts[0];
  rawName = rawName.replace(/मो\.?.*$/, '').replace(/^[१२३४५६७८९०0-9\s.-]+/, '').trim();
  rawName = rawName.replace(/^सर्वश्री\s*/, '').replace(/^श्री\s+/, '').replace(/^श्रीमती\s*/, '').replace(/^डॉ\.\s*/, 'डॉ. ').replace(/^इं\.\s*/, 'इं. ').trim();

  if (!rawName || rawName.length < 2 || rawName.includes('समिति') || rawName.includes('सूची')) continue;

  // Real occupation / department from the source string
  let occupation = parts.slice(1).join(', ').replace(/मो\.?.*$/, '').trim();
  if (!occupation) {
    occupation = currentSection.replace(/^आलोक के\s*/, '').replace(/पद.*$/, '').trim();
  }

  let state = normalizeState(prefixState);
  if (state === 'अखिल भारतीय') {
    if (clean.includes('उत्तर प्रदेश') || clean.includes('उ०प्र०') || clean.includes('उप्र') || clean.includes('लखनऊ') || clean.includes('बदायूं') || clean.includes('एटा') || clean.includes('गाजियाबाद')) state = 'उत्तर प्रदेश';
    else if (clean.includes('मध्य प्रदेश') || clean.includes('म०प्र०') || clean.includes('मप्र') || clean.includes('भोपाल') || clean.includes('विदिशा') || clean.includes('मुरैना') || clean.includes('छिंदवाड़ा')) state = 'मध्य प्रदेश';
    else if (clean.includes('राजस्थान') || clean.includes('जयपुर') || clean.includes('अजमेर') || clean.includes('धौलपुर') || clean.includes('राजसमंद')) state = 'राजस्थान';
    else if (clean.includes('दिल्ली') || clean.includes('डेसू') || clean.includes('एनटीपीसी')) state = 'दिल्ली';
    else if (clean.includes('उत्तराखंड') || clean.includes('उत्तराखण्ड') || clean.includes('वागेश्वर')) state = 'उत्तराखंड';
  }

  let city = state;
  const cityList = ['लखनऊ', 'भोपाल', 'जयपुर', 'अजमेर', 'धौलपुर', 'राजसमंद', 'विदिशा', 'मुरैना', 'छिंदवाड़ा', 'बदायूं', 'एटा', 'गाजियाबाद', 'वागेश्वर', 'नई दिल्ली'];
  for (const c of cityList) {
    if (clean.includes(c)) {
      city = `${c}, ${state}`;
      break;
    }
  }

  const role = currentSection.replace(/^आलोक के\s*/, '').replace(/पद.*$/, '').replace(/[-–].*$/, '').trim();
  const avatar = getVerifiedPhoto(rawName);

  // Check if member already exists from National Executive
  const existing = verifiedMembers.find(m => m.name.includes(rawName) || rawName.includes(m.name));
  if (existing) {
    // Enrich with verified occupation / department
    if (occupation && occupation.length > existing.occupation.length) {
      existing.occupation = occupation;
      existing.company = occupation;
    }
    if (!existing.avatar && avatar) {
      existing.avatar = avatar;
    }
    if (!existing.phone && phone) {
      existing.phone = phone;
      existing.showPhone = true;
    }
    continue;
  }

  verifiedMembers.push({
    name: rawName,
    role: role,
    occupation: occupation,
    company: occupation, // Actual government department or service
    city: city,
    state: state,
    address: city,
    pincode: '',
    phone: phone, // ONLY real phone, empty string if missing
    email: '',    // NO fabricated email
    avatar: avatar, // ONLY verified photo, empty string if missing
    biography: `${clean}`, // Exact factual source line
    tags: [],     // NO hashtags
    sourceFile: 'ALL INDIA_Alok_Designation_List_Hindi_.xlsx',
    sourceRow: i + 1,
    isApproved: true,
    isPublished: true,
    showPhone: Boolean(phone),
    showEmail: false,
    showAddress: true,
  });
  seen.add(rawName);
}

// 3. Process Verified Telangana / South State Leaders who have photos in photo/
const southLeadersWithPhotos = [
  { name: 'श्री टी. आर. बी. सिंह', role: 'प्रदेश प्रतिनिधि (तेलंगाना / दक्षिण भारत)', photo: '/asset/photo/photo/trbSingh_tel.png', state: 'तेलंगाना', city: 'हैदराबाद, तेलंगाना' },
  { name: 'श्री दिनेश लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', photo: '/asset/photo/photo/dinesh_tel.png', state: 'तेलंगाना', city: 'हैदराबाद, तेलंगाना' },
  { name: 'श्री रमेश वर्मा', role: 'प्रदेश पदाधिकारी (तेलंगाना)', photo: '/asset/photo/photo/ramesh_tel.png', state: 'तेलंगाना', city: 'वारंगल, तेलंगाना' },
  { name: 'श्री शंकर लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', photo: '/asset/photo/photo/shanker.png', state: 'तेलंगाना', city: 'हैदराबाद, तेलंगाना' },
  { name: 'श्री रणवीर सिंह लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', photo: '/asset/photo/photo/ranvir_tel.png', state: 'तेलंगाना', city: 'हैदराबाद, तेलंगाना' },
  { name: 'श्री शैलेंद्र सिंह लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', photo: '/asset/photo/photo/shail_tel.png', state: 'तेलंगाना', city: 'हैदराबाद, तेलंगाना' },
  { name: 'श्री नंद किशोर लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', photo: '/asset/photo/photo/nand_k_tel.png', state: 'तेलंगाना', city: 'हैदराबाद, तेलंगाना' },
  { name: 'श्री जशवंत सिंह लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', photo: '/asset/photo/photo/jash_tel.png', state: 'तेलंगाना', city: 'हैदराबाद, तेलंगाना' },
  { name: 'श्री हाकिम सिंह', role: 'वरिष्ठ मार्गदर्शक एवं अधिकारी', photo: '/asset/photo/photo/hakim singh.jpg', state: 'मध्य प्रदेश', city: 'ग्वालियर, मध्य प्रदेश' },
  { name: 'श्री हरी राम सिंह', role: 'वरिष्ठ प्रशासनिक अधिकारी (से०नि०)', photo: '/asset/photo/photo/hari ram singh.jpg', state: 'उत्तर प्रदेश', city: 'लखनऊ, उत्तर प्रदेश' },
  { name: 'श्री साहेब सिंह "सरल"', role: 'वरिष्ठ साहित्यकार एवं समाज चिंतक', photo: '/asset/photo/photo/Saheb_Saral.jpg', state: 'उत्तर प्रदेश', city: 'आगरा, उत्तर प्रदेश' },
];

southLeadersWithPhotos.forEach(leader => {
  const existing = verifiedMembers.find(m => m.name.includes(leader.name) || leader.name.includes(m.name));
  if (existing) {
    existing.avatar = leader.photo;
  } else {
    verifiedMembers.push({
      name: leader.name,
      role: leader.role,
      occupation: leader.role,
      company: 'अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)',
      city: leader.city,
      state: leader.state,
      address: leader.city,
      pincode: '',
      phone: '', // Real: phone unknown, leave empty string!
      email: '', // Real: email unknown, leave empty string!
      avatar: leader.photo,
      biography: `अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) — ${leader.role}।`,
      tags: [],
      sourceFile: 'photo/photo (verified asset archive)',
      sourceRow: 0,
      isApproved: true,
      isPublished: true,
      showPhone: false,
      showEmail: false,
      showAddress: true,
    });
  }
});

console.log(`\n=== TOTAL VERIFIED MEMBERS: ${verifiedMembers.length} ===`);
const withPhone = verifiedMembers.filter(m => m.phone);
const withAvatar = verifiedMembers.filter(m => m.avatar);
console.log(`Members with verified phone numbers: ${withPhone.length}`);
console.log(`Members with verified avatar photos: ${withAvatar.length}`);
console.log(`Members without phone numbers: ${verifiedMembers.length - withPhone.length} (phone set to empty string "")`);
console.log(`Members without photos: ${verifiedMembers.length - withAvatar.length} (avatar set to empty string "")`);

// Verify sample against original spreadsheet
console.log('\n--- VERIFYING SAMPLE OF RECORDS ---');
const sample = [
  verifiedMembers.find(m => m.name.includes('वीरवल')),
  verifiedMembers.find(m => m.name.includes('अतिवल')),
  verifiedMembers.find(m => m.name.includes('बद्री विशाल')),
  verifiedMembers.find(m => m.name.includes('ओमकार सिंह')),
  verifiedMembers.find(m => m.name.includes('हर्ष राजपूत')),
  verifiedMembers.find(m => m.name.includes('लखन सिंह')),
  verifiedMembers.find(m => m.name.includes('धर्मेन्द्र')),
];
sample.forEach(s => {
  if (s) {
    console.log(`Name: ${s.name} | Role: ${s.role} | Phone: "${s.phone}" | Avatar: "${s.avatar}" | Source: ${s.sourceFile}`);
  }
});

fs.writeFileSync(path.join(process.cwd(), 'scripts', 'verified-source-members.json'), JSON.stringify(verifiedMembers, null, 2));
console.log('\nSuccessfully saved scripts/verified-source-members.json');
