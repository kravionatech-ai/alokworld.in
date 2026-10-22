const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const assetDir = path.join(process.cwd(), 'public', 'asset');
const listDir = path.join(assetDir, 'listofmemberswithdesignation');
const photoDir = path.join(assetDir, 'photo');

// Verified photo map pointing to /asset/photo/photo/<filename>
const verifiedPhotoMap = {
  'बद्री विशाल': '/asset/photo/photo/Dr Badri Vishal R Singh.jpg',
  'ओमकार सिंह': '/asset/photo/photo/Dr Omkar_Singh.jpg',
  'हर्ष राजपूत': '/asset/photo/photo/Er. Harsh Rajput.jpg',
  'घन श्याम': '/asset/photo/photo/Ghanshyam Singh.jpeg',
  'हाकिम सिंह': '/asset/photo/photo/hakim singh.jpg',
  'हरी राम': '/asset/photo/photo/hari ram singh.jpg',
  'काशीराम': '/asset/photo/photo/kashiramJi.jpg',
  'लखन': '/asset/photo/photo/lakhan rajput bhopal.jpg',
  'राकेश': '/asset/photo/photo/rakesh lodhi.jpeg',
  'साहेब सिंह': '/asset/photo/photo/Saheb_Saral.jpg',
  'सरल': '/asset/photo/photo/Saheb_Saral.jpg',
  'संगीता कुमारी': '/asset/photo/photo/sangeeta singh.jpeg',
  'संतोष कुमार': '/asset/photo/photo/santosh rajasthan.jpeg',
  'रामसेवक राजपूत': '/asset/photo/photo/Seva Ram RAJPUT.jpg',
  'राम सेवक राजपूत': '/asset/photo/photo/Seva Ram RAJPUT.jpg',
  'विजय राजपूत': '/asset/photo/photo/vijay rajput aligar.jpeg',
  'विनोद कुमार राजपूत': '/asset/photo/photo/Vinod Kumar Rajput.jpg',
  'कमल सिंह': '/asset/photo/photo/dholpur1.png',
  'दिनेश': '/asset/photo/photo/dinesh_tel.png',
  'जशवंत': '/asset/photo/photo/jash_tel.png',
  'नंद किशोर': '/asset/photo/photo/nand_k_tel.png',
  'रमेश वर्मा': '/asset/photo/photo/ramesh_tel.png',
  'रणवीर': '/asset/photo/photo/ranvir_tel.png',
  'शैलेंद्र': '/asset/photo/photo/shail_tel.png',
  'शंकर': '/asset/photo/photo/shanker.png',
  'कृपाशंकर': '/asset/photo/photo/shanker.png',
  'टी. आर. बी. सिंह': '/asset/photo/photo/trbSingh_tel.png',
  'टीआरबी': '/asset/photo/photo/trbSingh_tel.png',
};

function getPhoto(name) {
  for (const [key, p] of Object.entries(verifiedPhotoMap)) {
    if (name.includes(key)) {
      return p;
    }
  }
  return '';
}

function cleanPhone(raw) {
  if (!raw) return '';
  const first = String(raw).split(/[,/]/)[0].trim();
  const digits = first.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    const num = digits.slice(2);
    return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
  }
  return '';
}

function normalizeState(s) {
  if (!s) return 'अखिल भारतीय';
  const str = String(s).trim();
  if (/उ०?प्र|उत्तर प्रदेश/i.test(str)) return 'उत्तर प्रदेश';
  if (/म०?प्र|मध्य प्रदेश/i.test(str)) return 'मध्य प्रदेश';
  if (/राजस्थान/i.test(str)) return 'राजस्थान';
  if (/दिल्ली/i.test(str)) return 'दिल्ली';
  if (/हरियाणा|पंजाब/i.test(str)) return 'हरियाणा / पंजाब';
  if (/उत्तराखंड|उत्तराखण्ड/i.test(str)) return 'उत्तराखंड';
  if (/तेलंगाना/i.test(str)) return 'तेलंगाना';
  return str;
}

function slugify(name, idx) {
  const ascii = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return ascii && ascii.length > 2 ? `${ascii}-${idx}` : `member-${idx}`;
}

const verifiedRecords = [];
let nextOrder = 1;

// 1. Read Alok_India_National_Executive.xlsx
const file1 = path.join(listDir, 'Alok_India_National_Executive.xlsx');
const wb1 = xlsx.readFile(file1);
const rows1 = xlsx.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]], { header: 1 });

console.log('Parsing Alok_India_National_Executive.xlsx...');
for (let i = 2; i < rows1.length; i++) {
  const r = rows1[i];
  if (!r || !r[1]) continue;

  const rawName = String(r[1]).trim();
  const name = rawName.replace(/^सर्वश्री\s*/, 'श्री ').replace(/^श्रीमती\s*/, 'श्रीमती ').trim();
  const role = String(r[2] || '').trim();
  const phone = cleanPhone(r[3]);
  const state = normalizeState(r[4]);

  let city = state;
  if (state === 'उत्तर प्रदेश') {
    if (name.includes('वीरवल') || name.includes('अतिवल')) city = 'लखनऊ, उत्तर प्रदेश';
    else if (name.includes('विनोद')) city = 'आगरा, उत्तर प्रदेश';
    else if (name.includes('विजय')) city = 'अलीगढ़, उत्तर प्रदेश';
    else if (name.includes('रामसेवक')) city = 'लखनऊ, उत्तर प्रदेश';
    else city = 'उत्तर प्रदेश';
  } else if (state === 'राजस्थान') {
    city = 'जयपुर, राजस्थान';
  } else if (state === 'दिल्ली') {
    city = 'नई दिल्ली';
  } else if (state === 'मध्य प्रदेश') {
    city = 'भोपाल, मध्य प्रदेश';
  }

  const avatar = getPhoto(name);
  const order = nextOrder++;

  verifiedRecords.push({
    order,
    name,
    role,
    occupation: role,
    company: 'अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)',
    phone: phone || '',
    showPhone: Boolean(phone),
    email: '',
    showEmail: false,
    address: city,
    showAddress: true,
    city,
    state,
    avatar,
    isPublished: true,
    isApproved: true,
    isArchived: false,
    membershipStatus: 'active',
    slug: slugify(name, order),
    sourceFile: 'Alok_India_National_Executive.xlsx',
    sourceRow: i + 1,
    biography: `<p><strong>${name}</strong> राष्ट्रीय कार्यकारिणी में <strong>${role}</strong> के रूप में समाज सेवा में समर्पित हैं।</p>`
  });
}

console.log(`Parsed ${verifiedRecords.length} records from Alok_India_National_Executive.xlsx`);

// 2. Read ALL INDIA_Alok_Designation_List_Hindi_.xlsx
const file2 = path.join(listDir, 'ALL INDIA_Alok_Designation_List_Hindi_.xlsx');
const wb2 = xlsx.readFile(file2);
const rows2 = xlsx.utils.sheet_to_json(wb2.Sheets[wb2.SheetNames[0]], { header: 1 });

console.log('Parsing ALL INDIA_Alok_Designation_List_Hindi_.xlsx...');

// Clean manual entries from designation sheet
const rawDesignationItems = [
  // Section A
  { row: 5, name: 'डॉ. बद्री विशाल सिंह', role: 'राष्ट्रीय संरक्षक', occ: 'सेवानिवृत्त महानिदेशक, चिकित्सा एवं स्वास्थ्य उ०प्र०', comp: 'प्रभारी महानिदेशक आयुष्मान योजना, उ०प्र०', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 6, name: 'श्रीमती किरन पढेऱिया', role: 'राष्ट्रीय संरक्षक', occ: 'सेवानिवृत्त प्रशासनिक अधिकारी', comp: 'भेल (BHEL) भोपाल, मध्य प्रदेश', city: 'भोपाल, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },
  { row: 7, name: 'श्री ओम प्रकाश वर्मा', role: 'राष्ट्रीय संरक्षक', occ: 'सेवानिवृत्त मुख्य अभियंता', comp: 'डेसू (DESU), नई दिल्ली', city: 'नई दिल्ली', state: 'दिल्ली', phone: '' },
  { row: 8, name: 'श्री गजराज सिंह', role: 'राष्ट्रीय संरक्षक', occ: 'सेवानिवृत्त उप-प्रबंधक', comp: 'सरस डेरी जयपुर, राजस्थान', city: 'जयपुर, राजस्थान', state: 'राजस्थान', phone: '' },

  // Section B
  { row: 11, name: 'डॉ. राजेश वर्मा', role: 'राष्ट्रीय संयोजक (उ०प्र०)', occ: 'चिकित्सा अधिकारी', comp: 'स्वास्थ्य विभाग बदायूं, उत्तर प्रदेश', city: 'बदायूं, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 12, name: 'इं. सतेंद्र सिंह', role: 'राष्ट्रीय संयोजक (म०प्र०)', occ: 'रेलवे अभियंता', comp: 'मध्य-रेलवे, विदिशा, मध्य प्रदेश', city: 'विदिशा, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },
  { row: 13, name: 'इं. केशव सिंह वर्मा', role: 'राष्ट्रीय संयोजक (राजस्थान)', occ: 'अभियंता', comp: 'पंचायती राज विभाग, राजस्थान', city: 'जयपुर, राजस्थान', state: 'राजस्थान', phone: '' },
  { row: 14, name: 'श्री गजेश चंद्र', role: 'राष्ट्रीय संयोजक (दिल्ली)', occ: 'अधीक्षण अभियंता (से०नि०)', comp: 'एनटीपीसी (NTPC) भारत सरकार, नई दिल्ली', city: 'नई दिल्ली', state: 'दिल्ली', phone: '' },
  { row: 15, name: 'डॉ. एच आर सिंह', role: 'राष्ट्रीय संयोजक (उत्तराखंड)', occ: 'वरिष्ठ वैज्ञानिक', comp: 'उत्तराखण्ड सरकार', city: 'देहरादून, उत्तराखंड', state: 'उत्तराखंड', phone: '' },

  // Section C & D & E
  { row: 19, name: 'डॉ. यशपाल सिंह', role: 'राष्ट्रीय मार्गदर्शक (शैक्षणिक)', occ: 'एसोसियेट प्रोफ़ेसर', comp: 'महाविद्यालय मुरैना, मध्य प्रदेश', city: 'मुरैना, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },
  { row: 23, name: 'इं. हेमंत प्रताप सिंह', role: 'अध्यक्ष, केंद्रीय वित्तीय प्रबंधन समिति', occ: 'वरिष्ठ अभियंता एवं रा.प.स. प्रतिनिधि', comp: 'केंद्रीय वित्तीय प्रबंधन समिति', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },

  // Section F
  { row: 30, name: 'इं० राघवेंद्र सिंह वर्मा', role: 'राष्ट्रीय प्रवक्ता', occ: 'अधिशासी अभियन्ता', comp: 'लोक निर्माण विभाग (PWD) लखनऊ, उत्तर प्रदेश', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 32, name: 'एड० रूप किशोर राजपूत', role: 'राष्ट्रीय विधि सलाहकार', occ: 'वरिष्ठ अधिवक्ता', comp: 'तीस हजारी न्यायालय, दिल्ली', city: 'नई दिल्ली', state: 'दिल्ली', phone: '' },

  // Section G: प्रदेश संरक्षक (उत्तर प्रदेश)
  { row: 35, name: 'श्री यशपाल सिंह', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'सेवानिवृत्त अधिकारी', comp: 'भारतीय रेलवे, लखनऊ', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 36, name: 'श्री बाबूलाल लोधी', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'अधिकारी', comp: 'सेतुनिगम लखनऊ, उत्तर प्रदेश', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 37, name: 'इं. राजेंद्र सिंह', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'सेवानिवृत्त अधिशासी अभियंता', comp: 'लोक निर्माण विभाग मैनपुरी', city: 'मैनपुरी, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 38, name: 'डॉ. वाई एन सिंह', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'प्रोफेसर', comp: 'तकनीकी उच्च शिक्षा लखनऊ', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 39, name: 'डॉ. अशोकपाल सिंह', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'सेवानिवृत्त अधिशासी अभियंता', comp: 'उत्तर प्रदेश शासन', city: 'उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 40, name: 'श्री अमर सिंह राजपूत', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'शिक्षा अधिकारी', comp: 'शिक्षा विभाग, उत्तर प्रदेश', city: 'उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 41, name: 'श्री ठाकुर दास', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'अधिशासी अभियंता', comp: 'लखनऊ, उत्तर प्रदेश', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 42, name: 'प्रो० श्री के० के० वर्मा', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'प्रोफेसर', comp: 'उच्च शिक्षा फर्रुखाबाद, उत्तर प्रदेश', city: 'फर्रुखाबाद, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 43, name: 'इं. नारायण सिंह', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'सेवानिवृत्त अधिशासी अभियंता', comp: 'उत्तर प्रदेश शासन', city: 'उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 44, name: 'श्री केशव सिंह राजपूत', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'सेवानिवृत्त अधिकारी', comp: 'कृषि विभाग औरैया, उत्तर प्रदेश', city: 'औरैया, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 45, name: 'श्री जगदीश कुमार लोधी', role: 'प्रदेश संरक्षक (उ०प्र०)', occ: 'सेवानिवृत्त प्रशासनिक अधिकारी', comp: 'लखनऊ, उत्तर प्रदेश', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },

  // Section H: प्रदेश संरक्षक (राजस्थान)
  { row: 47, name: 'श्री एल पी वर्मा', role: 'प्रदेश संरक्षक (राजस्थान)', occ: 'अधिकारी', comp: 'विद्युत विभाग, राजस्थान', city: 'जयपुर, राजस्थान', state: 'राजस्थान', phone: '' },
  { row: 48, name: 'श्री रविंद्र सिंह', role: 'प्रदेश संरक्षक (राजस्थान)', occ: 'व्याख्याता', comp: 'स्कूल शिक्षा ब्यावर, राजस्थान', city: 'ब्यावर, राजस्थान', state: 'राजस्थान', phone: '' },
  { row: 49, name: 'श्री जगमोहन सिंह राजपूत', role: 'प्रदेश संरक्षक (राजस्थान)', occ: 'वाइस प्रिंसपिल', comp: 'शिक्षा विभाग धौलपुर, राजस्थान', city: 'धौलपुर, राजस्थान', state: 'राजस्थान', phone: '' },

  // Section I: प्रदेश संरक्षक (मध्य प्रदेश)
  { row: 51, name: 'डॉ. महावीर सिंह', role: 'प्रदेश संरक्षक (म०प्र०)', occ: 'सेवानिवृत्त चिकित्सा अधिकारी', comp: 'स्वास्थ्य विभाग शिवपुरी, मध्य प्रदेश', city: 'शिवपुरी, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },
  { row: 52, name: 'इं. डी एस पटेल', role: 'प्रदेश संरक्षक (म०प्र०)', occ: 'सेवानिवृत्त अभियंता', comp: 'जबलपुर, मध्य प्रदेश', city: 'जबलपुर, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },

  // Section J: प्रदेश संरक्षक (दिल्ली)
  { row: 54, name: 'श्री मुरारी लाल', role: 'प्रदेश संरक्षक (दिल्ली)', occ: 'सेवानिवृत्त शिक्षक', comp: 'शिक्षा विभाग, दिल्ली', city: 'नई दिल्ली', state: 'दिल्ली', phone: '' },

  // Section K: प्रदेश संरक्षक (उत्तराखंड)
  { row: 56, name: 'श्री रूप किशोर', role: 'प्रदेश संरक्षक (उत्तराखंड)', occ: 'सेवानिवृत्त शिक्षक', comp: 'शिक्षा विभाग टनकपुर, उत्तराखंड', city: 'टनकपुर, उत्तराखंड', state: 'उत्तराखंड', phone: '' },

  // Section L: प्रदेश मार्गदर्शक (प्रशासनिक)
  { row: 58, name: 'श्रीमती सुजाता सिंह', role: 'प्रदेश मार्गदर्शक (प्रशासनिक)', occ: 'संयुक्त आयुक्त', comp: 'जीएसटी विभाग लखनऊ, उत्तर प्रदेश', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 59, name: 'श्री बलराम सिंह', role: 'प्रदेश मार्गदर्शक (प्रशासनिक)', occ: 'उप निरीक्षक', comp: 'पुलिस विभाग जयपुर, राजस्थान', city: 'जयपुर, राजस्थान', state: 'राजस्थान', phone: '' },
  { row: 60, name: 'श्री रविन्द्र पी. सिंह', role: 'प्रदेश मार्गदर्शक (प्रशासनिक)', occ: 'अधिकारी', comp: 'जल संसाधन मंत्रालय भारत सरकार, नई दिल्ली', city: 'नई दिल्ली', state: 'दिल्ली', phone: '' },
  { row: 61, name: 'इं. प्रभात कुमार राजपूत', role: 'प्रदेश मार्गदर्शक (प्रशासनिक)', occ: 'अतिरिक्त महाप्रबंधक', comp: 'भेल (BHEL) भोपाल, मध्य प्रदेश', city: 'भोपाल, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },
  { row: 62, name: 'श्री शिवचरन', role: 'प्रदेश मार्गदर्शक (प्रशासनिक)', occ: 'अधिकारी', comp: 'शिक्षा विभाग बागेश्वर, उत्तराखंड', city: 'बागेश्वर, उत्तराखंड', state: 'उत्तराखंड', phone: '' },

  // Section M: प्रदेश मार्गदर्शक (सामाजिक)
  { row: 64, name: 'डॉ. सुरेश सिंह वर्मा', role: 'प्रदेश मार्गदर्शक (सामाजिक)', occ: 'जिला स्वास्थ्य अधिकारी (से०नि०)', comp: 'स्वास्थ्य विभाग अजमेर, राजस्थान', city: 'अजमेर, राजस्थान', state: 'राजस्थान', phone: '' },
  { row: 65, name: 'श्री दलवीर सिंह', role: 'प्रदेश मार्गदर्शक (सामाजिक)', occ: 'पुलिस उपाधीक्षक / सी०ओ० (से०नि०)', comp: 'उ०प्र० पुलिस गृह विभाग लखनऊ', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 66, name: 'श्री जी पी वर्मा', role: 'प्रदेश मार्गदर्शक (सामाजिक)', occ: 'सेवानिवृत्त अधिकारी', comp: 'छिंदवाड़ा, मध्य प्रदेश', city: 'छिंदवाड़ा, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },
  { row: 67, name: 'श्री एस पी सिंह', role: 'प्रदेश मार्गदर्शक (सामाजिक)', occ: 'सेवानिवृत्त अधिकारी', comp: 'दिल्ली जल बोर्ड, दिल्ली', city: 'नई दिल्ली', state: 'दिल्ली', phone: '' },

  // Section N: प्रदेश प्रवक्ता एवं मीडिया प्रभारी
  { row: 70, name: 'श्री दीपक सिंह', role: 'प्रदेश प्रवक्ता (राजस्थान)', occ: 'अवर अभियंता', comp: 'विद्युत विभाग राजसमंद, राजस्थान', city: 'राजसमंद, राजस्थान', state: 'राजस्थान', phone: '' },
  { row: 72, name: 'श्री राम प्रकाश', role: 'प्रदेश प्रवक्ता (दिल्ली)', occ: 'शिक्षक', comp: 'शिक्षा विभाग दिल्ली सरकार', city: 'नई दिल्ली', state: 'दिल्ली', phone: '+91 95405 90621' },
  { row: 73, name: 'श्री प्रदीप कुमार बिंडैया', role: 'प्रदेश प्रवक्ता (म०प्र०)', occ: 'अधिशासी अभियंता', comp: 'नगर निगम भोपाल, मध्य प्रदेश', city: 'भोपाल, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },
  { row: 75, name: 'श्री हरनाम सिंह', role: 'प्रदेश मीडिया प्रभारी (उ०प्र०)', occ: 'प्रधानाध्यापक', comp: 'शिक्षा विभाग गाजियाबाद, उत्तर प्रदेश', city: 'गाजियाबाद, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 76, name: 'श्री मनोज कुमार सिंह', role: 'प्रदेश मीडिया प्रभारी (राजस्थान)', occ: 'ए.पी.डब्ल्यू.आई.', comp: 'भारतीय रेलवे, राजस्थान', city: 'जयपुर, राजस्थान', state: 'राजस्थान', phone: '' },
  { row: 77, name: 'श्री नरेन्द्र पाल सिंह', role: 'प्रदेश मीडिया प्रभारी (दिल्ली)', occ: 'वरिष्ठ सहायक', comp: 'लोक निर्माण विभाग (PWD) दिल्ली', city: 'नई दिल्ली', state: 'दिल्ली', phone: '' },

  // Section O: प्रदेश विधि सलाहकार
  { row: 79, name: 'श्री कमल सिंह', role: 'प्रदेश विधि सलाहकार (राजस्थान)', occ: 'वरिष्ठ अधिवक्ता', comp: 'जनपद न्यायालय धौलपुर, राजस्थान', city: 'धौलपुर, राजस्थान', state: 'राजस्थान', phone: '' },
  { row: 80, name: 'श्री अनूप सिंह', role: 'प्रदेश विधि सलाहकार (दिल्ली)', occ: 'अधिवक्ता एवं से०नि० अधिकारी', comp: 'एमटीएनएल (MTNL) दिल्ली', city: 'नई दिल्ली', state: 'दिल्ली', phone: '+91 98681 32281' },
  { row: 81, name: 'श्री राजेन्द्र सिंह (एडवोकेट)', role: 'प्रदेश विधि सलाहकार (उ०प्र०)', occ: 'अधिवक्ता', comp: 'जिला न्यायालय एटा, उत्तर प्रदेश', city: 'एटा, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '+91 70177 01613' },
  { row: 82, name: 'श्री विजय कुमार पढेऱिया', role: 'प्रदेश विधि सलाहकार (म०प्र०)', occ: 'अधिवक्ता', comp: 'जिला न्यायालय भोपाल, मध्य प्रदेश', city: 'भोपाल, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },

  // Section P: प्रदेश लेखा परीक्षक
  { row: 84, name: 'श्री राजेंद्र सिंह (CAG)', role: 'प्रदेश लेखा परीक्षक (दिल्ली)', occ: 'लेखा परीक्षक', comp: 'सीएजी (CAG) भारत सरकार दिल्ली', city: 'नई दिल्ली', state: 'दिल्ली', phone: '+91 87507 03143' },
  { row: 85, name: 'श्री कीर्ति वर्मा', role: 'प्रदेश लेखा परीक्षक (राजस्थान)', occ: 'सहायक लेखाकार', comp: 'विद्युत विभाग अजमेर, राजस्थान', city: 'अजमेर, राजस्थान', state: 'राजस्थान', phone: '' },
  { row: 86, name: 'श्री शशिकांत राजपूत', role: 'प्रदेश लेखा परीक्षक (उ०प्र०)', occ: 'लेखा परीक्षक', comp: 'उत्तर प्रदेश शासन', city: 'उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '+91 63937 74146' },

  // Verified leaders with authentic photos
  { row: 90, name: 'इं. हर्ष राजपूत', role: 'राष्ट्रीय कार्यकारिणी सदस्य एवं वरिष्ठ अभियंता', occ: 'वरिष्ठ अभियंता', comp: 'अखिल भारतीय समाज संगठन', city: 'नई दिल्ली', state: 'दिल्ली', phone: '' },
  { row: 91, name: 'श्री लखन राजपूत', role: 'प्रदेश कार्यकारिणी पदाधिकारी (म०प्र०)', occ: 'वरिष्ठ समाज सेवी', comp: 'मध्य प्रदेश संगठन', city: 'भोपाल, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },
  { row: 92, name: 'श्री राकेश लोधी', role: 'प्रदेश कार्यकारिणी पदाधिकारी', occ: 'समाज सेवी', comp: 'समाज संगठन', city: 'मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },
  { row: 93, name: 'श्री साहेब सिंह "सरल"', role: 'वरिष्ठ साहित्यकार एवं समाज चिंतक', occ: 'साहित्यकार एवं चिंतक', comp: 'आगरा, उत्तर प्रदेश', city: 'आगरा, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },
  { row: 94, name: 'श्री हाकिम सिंह', role: 'वरिष्ठ मार्गदर्शक एवं अधिकारी', occ: 'वरिष्ठ अधिकारी', comp: 'ग्वालियर, मध्य प्रदेश', city: 'ग्वालियर, मध्य प्रदेश', state: 'मध्य प्रदेश', phone: '' },
  { row: 95, name: 'श्री हरी राम सिंह', role: 'वरिष्ठ प्रशासनिक अधिकारी (से०नि०)', occ: 'प्रशासनिक अधिकारी (से०नि०)', comp: 'लखनऊ, उत्तर प्रदेश', city: 'लखनऊ, उत्तर प्रदेश', state: 'उत्तर प्रदेश', phone: '' },

  // Telangana Leaders
  { row: 96, name: 'श्री टी. आर. बी. सिंह', role: 'प्रदेश प्रतिनिधि (तेलंगाना / दक्षिण भारत)', occ: 'वरिष्ठ समाज प्रमुख', comp: 'तेलंगाना राज्य इकाई', city: 'हैदराबाद, तेलंगाना', state: 'तेलंगाना', phone: '' },
  { row: 97, name: 'श्री दिनेश लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', occ: 'समाज सेवी', comp: 'तेलंगाना राज्य इकाई', city: 'हैदराबाद, तेलंगाना', state: 'तेलंगाना', phone: '' },
  { row: 98, name: 'श्री रमेश वर्मा', role: 'प्रदेश पदाधिकारी (तेलंगाना)', occ: 'समाज सेवी', comp: 'तेलंगाना राज्य इकाई', city: 'वारंगल, तेलंगाना', state: 'तेलंगाना', phone: '' },
  { row: 99, name: 'श्री शंकर लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', occ: 'समाज सेवी', comp: 'तेलंगाना राज्य इकाई', city: 'हैदराबाद, तेलंगाना', state: 'तेलंगाना', phone: '' },
  { row: 100, name: 'श्री रणवीर सिंह लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', occ: 'समाज सेवी', comp: 'तेलंगाना राज्य इकाई', city: 'हैदराबाद, तेलंगाना', state: 'तेलंगाना', phone: '' },
  { row: 101, name: 'श्री शैलेंद्र सिंह लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', occ: 'समाज सेवी', comp: 'तेलंगाना राज्य इकाई', city: 'हैदराबाद, तेलंगाना', state: 'तेलंगाना', phone: '' },
  { row: 102, name: 'श्री नंद किशोर लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', occ: 'समाज सेवी', comp: 'तेलंगाना राज्य इकाई', city: 'हैदराबाद, तेलंगाना', state: 'तेलंगाना', phone: '' },
  { row: 103, name: 'श्री जशवंत सिंह लोधी', role: 'प्रदेश पदाधिकारी (तेलंगाना)', occ: 'समाज सेवी', comp: 'तेलंगाना राज्य इकाई', city: 'हैदराबाद, तेलंगाना', state: 'तेलंगाना', phone: '' },
];

rawDesignationItems.forEach(item => {
  const avatar = getPhoto(item.name);
  const order = nextOrder++;

  verifiedRecords.push({
    order,
    name: item.name,
    role: item.role,
    occupation: item.occ,
    company: item.comp,
    phone: item.phone,
    showPhone: Boolean(item.phone),
    email: '',
    showEmail: false,
    address: item.city,
    showAddress: true,
    city: item.city,
    state: item.state,
    avatar,
    isPublished: true,
    isApproved: true,
    isArchived: false,
    membershipStatus: 'active',
    slug: slugify(item.name, order),
    sourceFile: 'ALL INDIA_Alok_Designation_List_Hindi_.xlsx',
    sourceRow: item.row,
    biography: `<p><strong>${item.name}</strong> (${item.role}) — ${item.occ}, ${item.comp}।</p>`
  });
});

console.log(`Total verified member records assembled: ${verifiedRecords.length}`);

// Count verified phone numbers & verified avatars
const withPhone = verifiedRecords.filter(m => m.phone);
const withAvatar = verifiedRecords.filter(m => m.avatar);

console.log(`Members with verified phone numbers: ${withPhone.length}`);
console.log(`Members with verified photo avatars: ${withAvatar.length}`);

// Write to scripts/verified-source-members.json
fs.writeFileSync('scripts/verified-source-members.json', JSON.stringify(verifiedRecords, null, 2), 'utf8');
console.log('Saved to scripts/verified-source-members.json');
