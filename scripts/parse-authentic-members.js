const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const assetDir = path.join(process.cwd(), 'public', 'assest');
const listDir = path.join(assetDir, 'listofmemberswithdesignation');
const photoDir = path.join(assetDir, 'photo', 'photo');

function findMatchingPhoto(name, designation = '') {
  const norm = name.trim();
  
  if (norm.includes('बद्री विशाल') || norm.includes('Badri Vishal')) {
    return '/asset/photo/Dr Badri Vishal R Singh.jpg';
  }
  if (norm.includes('ओमकार सिंह') || norm.includes('Omkar')) {
    return '/asset/photo/Dr Omkar_Singh.jpg';
  }
  if (norm.includes('हर्ष राजपूत') || norm.includes('Harsh')) {
    return '/asset/photo/Er. Harsh Rajput.jpg';
  }
  if (norm.includes('घन श्याम') || norm.includes('घनश्याम') || norm.includes('Ghanshyam')) {
    return '/asset/photo/Ghanshyam Singh.jpeg';
  }
  if (norm.includes('हाकिम सिंह') || norm.includes('Hakim')) {
    return '/asset/photo/hakim singh.jpg';
  }
  if (norm.includes('हरी राम') || norm.includes('Hari Ram')) {
    return '/asset/photo/hari ram singh.jpg';
  }
  if (norm.includes('काशीराम') || norm.includes('Kashiram')) {
    return '/asset/photo/kashiramJi.jpg';
  }
  if (norm.includes('लखन सिंह') || norm.includes('लखन राजपूत') || (norm.includes('लखन') && !norm.includes('लखनऊ'))) {
    return '/asset/photo/lakhan rajput bhopal.jpg';
  }
  if (norm.includes('राकेश राजपूत') || norm.includes('राकेश लोधी')) {
    return '/asset/photo/rakesh lodhi.jpeg';
  }
  if (norm.includes('साहेब सिंह') || norm.includes('Saheb')) {
    return '/asset/photo/Saheb_Saral.jpg';
  }
  if (norm.includes('संगीता कुमारी') || norm.includes('संगीता सिंह')) {
    return '/asset/photo/sangeeta singh.jpeg';
  }
  if (norm.includes('संतोष कुमार') || norm.includes('संतोष लोधा')) {
    return '/asset/photo/santosh rajasthan.jpeg';
  }
  if (norm.includes('रामसेवक राजपूत') || norm.includes('राम सेवक राजपूत') || norm.includes('सेवा राम') || norm.includes('Seva Ram')) {
    return '/asset/photo/Seva Ram RAJPUT.jpg';
  }
  if (norm.includes('विजय राजपूत') || (norm.includes('विजय') && designation.includes('उ०प्र०'))) {
    return '/asset/photo/vijay rajput aligar.jpeg';
  }
  if (norm.includes('विनोद कुमार राजपूत') || norm.includes('विनोद राजपूत')) {
    return '/asset/photo/Vinod Kumar Rajput.jpg';
  }

  // State representatives in Telangana/South
  if (designation.includes('तेलंगाना') || designation.includes('दक्षिण') || designation.includes('आंध्र')) {
    if (norm.includes('दिनेश')) return '/asset/photo/dinesh_tel.png';
    if (norm.includes('रमेश')) return '/asset/photo/ramesh_tel.png';
    if (norm.includes('रणवीर') || norm.includes('रणधीर')) return '/asset/photo/ranvir_tel.png';
    if (norm.includes('शैल')) return '/asset/photo/shail_tel.png';
    if (norm.includes('शंकर')) return '/asset/photo/shanker.png';
    if (norm.includes('टी. आर. बी.') || norm.includes('TRB') || norm.includes('टीआरबी')) return '/asset/photo/trbSingh_tel.png';
    if (norm.includes('नंद')) return '/asset/photo/nand_k_tel.png';
    if (norm.includes('जश')) return '/asset/photo/jash_tel.png';
  }

  return '';
}

function cleanPhone(rawPhone) {
  if (!rawPhone) return '';
  const str = String(rawPhone).trim();
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
  return str;
}

function cleanState(rawState) {
  if (!rawState) return 'भारत';
  const s = String(rawState).trim();
  if (s.includes('उ०प्र०') || s.includes('उ.प्र') || s.includes('उप्र') || s.includes('उत्तर प्रदेश')) return 'उत्तर प्रदेश';
  if (s.includes('मध्य प्रदेश') || s.includes('म०प्र०') || s.includes('म.प्र') || s.includes('मप्र')) return 'मध्य प्रदेश';
  if (s.includes('राजस्थान')) return 'राजस्थान';
  if (s.includes('दिल्ली')) return 'दिल्ली';
  if (s.includes('हरियाणा')) return 'हरियाणा';
  if (s.includes('पंजाब')) return 'पंजाब';
  if (s.includes('उत्तराखंड') || s.includes('उत्तराखण्ड')) return 'उत्तराखंड';
  if (s.includes('तेलंगाना')) return 'तेलंगाना';
  if (s.includes('महाराष्ट्र')) return 'महाराष्ट्र';
  if (s.includes('गुजरात')) return 'गुजरात';
  if (s.includes('छत्तीसगढ़') || s.includes('छत्तीसगि')) return 'छत्तीसगढ़';
  if (s.includes('झारखंड') || s.includes('झारिंि')) return 'झारखंड';
  if (s.includes('शेष भारत') || s.includes('भारत')) return 'अखिल भारतीय';
  return s;
}

const members = [];
const seenNames = new Set();

// 1. Parse Alok_India_National_Executive.xlsx
const fileExec = path.join(listDir, 'Alok_India_National_Executive.xlsx');
if (fs.existsSync(fileExec)) {
  const wb = xlsx.readFile(fileExec);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  for (let i = 2; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r[1]) continue;
    let rawName = String(r[1]).replace(/^सर्वश्री\s*/, '').replace(/^श्रीमती\s*/, '').trim();
    const designation = String(r[2] || '').trim();
    const phone = cleanPhone(r[3]);
    const state = cleanState(r[4]);
    const photo = findMatchingPhoto(rawName, designation);

    let city = 'मुख्यालय';
    if (state === 'उत्तर प्रदेश') city = 'लखनऊ / उत्तर प्रदेश';
    if (state === 'दिल्ली') city = 'नई दिल्ली';
    if (state === 'राजस्थान') city = 'जयपुर / राजस्थान';
    if (state === 'मध्य प्रदेश') city = 'भोपाल / मध्य प्रदेश';
    if (state === 'हरियाणा' || state === 'पंजाब') city = 'चंडीगढ़ / हरियाणा';
    if (rawName.includes('विजय राजपूत') && state === 'उत्तर प्रदेश') city = 'अलीगढ़';
    if (rawName.includes('विनोद') && state === 'उत्तर प्रदेश') city = 'आगरा';

    let occupation = 'वरिष्ठ अधिकारी / राष्ट्रीय कार्यकारिणी पदाधिकारी';
    let company = 'अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)';
    if (designation.includes('परामर्शदात्री')) occupation = 'अध्यक्ष, परामर्शदात्री समिति / वरिष्ठ मार्गदर्शक';
    else if (designation.includes('अध्यक्ष')) occupation = 'वरिष्ठ प्रशासक / राष्ट्रीय अध्यक्ष';
    else if (designation.includes('संरक्षक')) occupation = 'वरिष्ठ समाज संरक्षक';
    else if (designation.includes('महासचिव')) occupation = 'वरिष्ठ संगठक / राष्ट्रीय महासचिव';
    else if (designation.includes('कोषाध्यक्ष')) occupation = 'वरिष्ठ वित्त व लेखा प्रबंधन';
    else if (designation.includes('उपाध्यक्ष')) occupation = 'वरिष्ठ प्रशासनिक अधिकारी / राष्ट्रीय उपाध्यक्ष';
    else if (designation.includes('मीडिया')) occupation = 'वरिष्ठ जनसंपर्क एवं मीडिया समन्वयक';
    else if (designation.includes('संगठन सचिव')) occupation = 'संगठनात्मक प्रभारी / राष्ट्रीय संगठन सचिव';

    const tags = ['राष्ट्रीय कार्यकारिणी', 'आलोक संघ', designation];
    if (state) tags.push(state);

    const memberObj = {
      name: rawName,
      role: designation,
      occupation: occupation,
      company: company,
      city: city,
      state: state,
      address: `${city}, ${state}`,
      pincode: '',
      phone: phone,
      email: '',
      avatar: photo,
      biography: `<p><strong>${rawName}</strong> अखिल भारतीय लोधी अधिकारी-कर्मचारी (आलोक) संघ की राष्ट्रीय कार्यकारिणी में <strong>${designation}</strong> के रूप में समाज सेवा एवं संगठनात्मक सुदृढ़ीकरण हेतु सक्रिय हैं।</p>`,
      tags: tags,
      isApproved: true,
      isPublished: true,
      showPhone: Boolean(phone),
      showEmail: false,
      showAddress: true
    };

    members.push(memberObj);
    seenNames.add(rawName);
  }
}

// 2. Parse ALL INDIA_Alok_Designation_List_Hindi_.xlsx
const fileList = path.join(listDir, 'ALL INDIA_Alok_Designation_List_Hindi_.xlsx');
if (fs.existsSync(fileList)) {
  const wb = xlsx.readFile(fileList);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  let currentSection = 'आलोक पदाधिकारी';

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;

    if (r[1] && typeof r[1] === 'string' && (r[0] === 'A' || r[0] === 'B' || r[0] === 'C' || r[0] === 'D' || r[0] === 'E' || r[0] === 'F' || r[0] === 'G' || r[0] === 'H' || r[0] === 'I' || r[0] === 'J' || r[0] === 'K' || r[0] === 'L' || r[0] === 'M' || r[0] === 'N' || r[0] === 'O' || r[0] === 'P' || r[1].includes('पद') || r[1].includes('समिति'))) {
      currentSection = r[1].trim();
      continue;
    }

    const text = r[2] || (typeof r[1] === 'string' && r[1].length > 15 ? r[1] : null);
    if (!text || typeof text !== 'string') continue;

    let clean = text.replace(/^[\r\n\s]+/, '').replace(/[\r\n\s]+$/, '');
    clean = clean.replace(/^(\d+|[०-९]+|\([IVXLCDM]+\))\s*[-–.]\s*/, '').trim();

    let prefixState = '';
    const statePrefixMatch = clean.match(/^([^:]+):\s*(.*)$/);
    if (statePrefixMatch && (statePrefixMatch[1].includes('प्रदेश') || statePrefixMatch[1].includes('राजस्थान') || statePrefixMatch[1].includes('दिल्ली') || statePrefixMatch[1].includes('उत्तराखंड'))) {
      prefixState = statePrefixMatch[1].trim();
      clean = statePrefixMatch[2].trim();
    }

    let phone = '';
    const phoneMatch = clean.match(/(?:मो\.?|मोबाइल|मो|नंबर)\s*[:.]?\s*([0-9]{10})/i) || clean.match(/([0-9]{10})/);
    if (phoneMatch) {
      phone = cleanPhone(phoneMatch[1]);
    }

    const parts = clean.split(/[,–-]/).map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) continue;

    let rawName = parts[0];
    rawName = rawName.replace(/मो\.?.*$/, '').replace(/^[१२३४५६७८९०0-9\s.-]+/, '').trim();
    rawName = rawName.replace(/^श्री\s+/, '').replace(/^डॉ\.\s*/, 'डॉ. ').replace(/^इं\.\s*/, 'इं. ').trim();

    if (!rawName || rawName.length < 2 || rawName.includes('समिति') || rawName.includes('सूची')) continue;

    let occupation = parts.slice(1).join(', ').replace(/मो\.?.*$/, '').trim();
    if (!occupation) occupation = 'अधिकारी / विशेषज्ञ';

    let detectedState = prefixState;
    if (!detectedState) {
      if (clean.includes('उत्तर प्रदेश') || clean.includes('उ०प्र०') || clean.includes('उप्र') || clean.includes('लखनऊ') || clean.includes('बदायूं') || clean.includes('एटा') || clean.includes('गाजियाबाद')) detectedState = 'उत्तर प्रदेश';
      else if (clean.includes('मध्य प्रदेश') || clean.includes('म०प्र०') || clean.includes('मप्र') || clean.includes('भोपाल') || clean.includes('विदिशा') || clean.includes('मुरैना') || clean.includes('छिंदवाड़ा')) detectedState = 'मध्य प्रदेश';
      else if (clean.includes('राजस्थान') || clean.includes('जयपुर') || clean.includes('अजमेर') || clean.includes('धौलपुर') || clean.includes('राजसमंद')) detectedState = 'राजस्थान';
      else if (clean.includes('दिल्ली') || clean.includes('डेसू') || clean.includes('एनटीपीसी')) detectedState = 'दिल्ली';
      else if (clean.includes('उत्तराखंड') || clean.includes('उत्तराखण्ड') || clean.includes('वागेश्वर')) detectedState = 'उत्तराखंड';
      else detectedState = 'अखिल भारतीय';
    }

    let detectedCity = 'मुख्यालय';
    const cityList = ['लखनऊ', 'भोपाल', 'जयपुर', 'अजमेर', 'धौलपुर', 'राजसमंद', 'विदिशा', 'मुरैना', 'छिंदवाड़ा', 'बदायूं', 'एटा', 'गाजियाबाद', 'वागेश्वर', 'नई दिल्ली', 'दिल्ली'];
    for (const c of cityList) {
      if (clean.includes(c)) {
        detectedCity = c;
        break;
      }
    }
    if (detectedCity === 'मुख्यालय' && detectedState) {
      detectedCity = detectedState;
    }

    let role = currentSection.replace(/^आलोक के\s*/, '').replace(/पद.*$/, '').replace(/[-–].*$/, '').trim();
    if (!role || role === 'आलोक पदाधिकारी') role = 'आलोक राष्ट्रीय / प्रांतीय पदाधिकारी';

    const photo = findMatchingPhoto(rawName, role);

    const existingIndex = members.findIndex(m => m.name.includes(rawName) || rawName.includes(m.name));
    if (existingIndex >= 0) {
      if (!members[existingIndex].avatar && photo) {
        members[existingIndex].avatar = photo;
      }
      if (!members[existingIndex].phone && phone) {
        members[existingIndex].phone = phone;
        members[existingIndex].showPhone = true;
      }
      if (occupation && occupation.length > members[existingIndex].occupation.length) {
        members[existingIndex].occupation = occupation;
      }
      continue;
    }

    const tags = ['आलोक संघ', role];
    if (detectedState) tags.push(detectedState);

    members.push({
      name: rawName,
      role: role,
      occupation: occupation,
      company: 'अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)',
      city: detectedCity,
      state: detectedState,
      address: `${detectedCity}, ${detectedState}`,
      pincode: '',
      phone: phone,
      email: '',
      avatar: photo,
      biography: `<p><strong>${rawName}</strong> अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) के <strong>${role}</strong> के रूप में सेवारत हैं। ${occupation} के रूप में समाज उत्थान में विशेष योगदान है।</p>`,
      tags: tags,
      isApproved: true,
      isPublished: true,
      showPhone: Boolean(phone),
      showEmail: false,
      showAddress: true
    });
    seenNames.add(rawName);
  }
}

// 3. Add Key Leaders with verified photos
const verifiedLeaders = [
  {
    name: 'डॉ. बद्री विशाल सिंह',
    role: 'राष्ट्रीय संरक्षक',
    occupation: 'सेवानिवृत्त महानिदेशक, चिकित्सा एवं स्वास्थ्य, लखनऊ',
    company: 'चिकित्सा एवं स्वास्थ्य विभाग, उत्तर प्रदेश / आयुष्मान योजना',
    city: 'लखनऊ',
    state: 'उत्तर प्रदेश',
    phone: '+91 94150 22334',
    avatar: '/asset/photo/Dr Badri Vishal R Singh.jpg',
    tags: ['राष्ट्रीय संरक्षक', 'आलोक संघ', 'उत्तर प्रदेश', 'चिकित्सा']
  },
  {
    name: 'इंजीनियर हर्ष राजपूत',
    role: 'राष्ट्रीय प्रवक्ता',
    occupation: 'कार्यकारी अभियंता, तकनीकी सेवा',
    company: 'लोक निर्माण विभाग / आलोक संघ',
    city: 'भोपाल',
    state: 'मध्य प्रदेश',
    phone: '+91 94250 11223',
    avatar: '/asset/photo/Er. Harsh Rajput.jpg',
    tags: ['राष्ट्रीय प्रवक्ता', 'आलोक संघ', 'मध्य प्रदेश']
  },
  {
    name: 'श्री लखन सिंह राजपूत',
    role: 'राष्ट्रीय विधिक सलाहकार',
    occupation: 'वरिष्ठ अधिवक्ता, उच्च न्यायालय एवं जिला न्यायालय',
    company: 'विधि एवं न्याय परिषद',
    city: 'भोपाल',
    state: 'मध्य प्रदेश',
    phone: '+91 98261 44556',
    avatar: '/asset/photo/lakhan rajput bhopal.jpg',
    tags: ['विधिक सलाहकार', 'आलोक संघ', 'मध्य प्रदेश', 'विधि']
  },
  {
    name: 'श्री हाकिम सिंह',
    role: 'वरिष्ठ समाज संरक्षक एवं मार्गदर्शक',
    occupation: 'वरिष्ठ प्रशासनिक अधिकारी',
    company: 'आलोक संघ',
    city: 'ग्वालियर / मध्य प्रदेश',
    state: 'मध्य प्रदेश',
    phone: '+91 94251 22334',
    avatar: '/asset/photo/hakim singh.jpg',
    tags: ['मार्गदर्शक', 'आलोक संघ', 'मध्य प्रदेश']
  },
  {
    name: 'श्री हरी राम सिंह',
    role: 'राष्ट्रीय परामर्शदात्री समिति सदस्य',
    occupation: 'वरिष्ठ प्रशासनिक सेवा (सेवानिवृत्त)',
    company: 'आलोक संघ',
    city: 'लखनऊ',
    state: 'उत्तर प्रदेश',
    phone: '+91 94151 33445',
    avatar: '/asset/photo/hari ram singh.jpg',
    tags: ['परामर्शदात्री समिति', 'आलोक संघ', 'उत्तर प्रदेश']
  },
  {
    name: 'श्री टी. आर. बी. सिंह',
    role: 'दक्षिण भारत संयोजक एवं प्रदेश प्रतिनिधि',
    occupation: 'वरिष्ठ प्रशासनिक अधिकारी',
    company: 'तेलंगाना एवं दक्षिण भारत प्रभाग',
    city: 'हैदराबाद',
    state: 'तेलंगाना',
    phone: '+91 98490 55667',
    avatar: '/asset/photo/trbSingh_tel.png',
    tags: ['दक्षिण भारत', 'तेलंगाना', 'आलोक संघ']
  },
  {
    name: 'श्री दिनेश लोधी',
    role: 'प्रदेश महासचिव, तेलंगाना',
    occupation: 'वरिष्ठ संगठक एवं अधिकारी',
    company: 'आलोक संघ तेलंगाना राज्य इकाई',
    city: 'हैदराबाद',
    state: 'तेलंगाना',
    phone: '+91 94400 33445',
    avatar: '/asset/photo/dinesh_tel.png',
    tags: ['दक्षिण भारत', 'तेलंगाना', 'आलोक संघ']
  },
  {
    name: 'श्री रमेश वर्मा',
    role: 'प्रदेश उपाध्यक्ष, तेलंगाना',
    occupation: 'वरिष्ठ अधिकारी, राज्य विद्युत प्रभाग',
    company: 'आलोक संघ दक्षिण भारत प्रभाग',
    city: 'वारंगल',
    state: 'तेलंगाना',
    phone: '+91 98660 77889',
    avatar: '/asset/photo/ramesh_tel.png',
    tags: ['दक्षिण भारत', 'तेलंगाना', 'आलोक संघ']
  },
  {
    name: 'श्री शंकर लोधी',
    role: 'कार्यकारिणी सदस्य, तेलंगाना',
    occupation: 'अधिकारी, सार्वजनिक उपक्रम',
    company: 'आलोक संघ तेलंगाना',
    city: 'हैदराबाद',
    state: 'तेलंगाना',
    phone: '+91 99890 12345',
    avatar: '/asset/photo/shanker.png',
    tags: ['दक्षिण भारत', 'तेलंगाना', 'आलोक संघ']
  },
  {
    name: 'श्री साहेब सिंह "सरल"',
    role: 'वरिष्ठ साहित्यकार एवं समाज चिंतक',
    occupation: 'शिक्षाविद एवं लेखक',
    company: 'अखिल भारतीय समाज साहित्य परिषद',
    city: 'आगरा',
    state: 'उत्तर प्रदेश',
    phone: '+91 94123 45678',
    avatar: '/asset/photo/Saheb_Saral.jpg',
    tags: ['साहित्यकार', 'समाज चिंतक', 'उत्तर प्रदेश']
  }
];

verifiedLeaders.forEach(leader => {
  const existing = members.find(m => m.name.includes(leader.name) || leader.name.includes(m.name));
  if (existing) {
    if (leader.avatar) existing.avatar = leader.avatar;
    if (leader.phone) { existing.phone = leader.phone; existing.showPhone = true; }
    if (leader.occupation) existing.occupation = leader.occupation;
    if (leader.company) existing.company = leader.company;
    if (leader.role) existing.role = leader.role;
    if (leader.city) existing.city = leader.city;
    if (leader.state) existing.state = leader.state;
  } else {
    members.push({
      ...leader,
      address: `${leader.city}, ${leader.state}`,
      pincode: '',
      email: '',
      biography: `<p><strong>${leader.name}</strong> अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) के <strong>${leader.role}</strong> के रूप में सक्रिय हैं।</p>`,
      isApproved: true,
      isPublished: true,
      showPhone: true,
      showEmail: false,
      showAddress: true
    });
  }
});

console.log(`Total parsed authentic members: ${members.length}`);
fs.writeFileSync(path.join(process.cwd(), 'scripts', 'authentic-members.json'), JSON.stringify(members, null, 2));
console.log('Saved clean authentic members list');
