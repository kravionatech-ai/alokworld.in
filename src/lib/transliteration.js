/**
 * Transliteration and Bilingual Search Engine for alokworld.in
 * Supports searching community members in both Devanagari Hindi and Romanized English.
 */

// Common bilingual mappings for community directory
const BILINGUAL_DICTIONARY = [
  // Community & Surnames
  { en: ["rajput", "rajpoot"], hi: ["राजपूत", "राजपुत"] },
  { en: ["singh", "simha", "sinha"], hi: ["सिंह", "सिह"] },
  { en: ["lodhi", "lodha", "lodh"], hi: ["लोधी", "लोधा", "लोध"] },
  { en: ["kumar", "koomar"], hi: ["कुमार"] },
  { en: ["verma", "varma", "barma"], hi: ["वर्मा", "वरमा"] },
  { en: ["thakur"], hi: ["ठाकुर"] },
  { en: ["sharma"], hi: ["शर्मा"] },
  { en: ["shri", "shree"], hi: ["श्री", "सर्वश्री"] },
  { en: ["shrimati", "smt"], hi: ["श्रीमती"] },
  { en: ["alok", "alokworld"], hi: ["आलोक"] },

  // Key Cities & Regions
  { en: ["lucknow", "lakhnau"], hi: ["लखनऊ", "लखनौ"] },
  { en: ["bhopal"], hi: ["भोपाल"] },
  { en: ["jaipur"], hi: ["जयपुर"] },
  { en: ["delhi", "new delhi", "dilli"], hi: ["दिल्ली", "नई दिल्ली", "दिल्लि"] },
  { en: ["gwalior"], hi: ["ग्वालियर"] },
  { en: ["indore"], hi: ["इंदौर", "इन्दौर"] },
  { en: ["agra"], hi: ["आगरा"] },
  { en: ["aligarh"], hi: ["अलीगढ़", "अलीगढ"] },
  { en: ["dholpur"], hi: ["धौलपुर"] },
  { en: ["mumbai", "bombay"], hi: ["मुंबई", "बम्बई"] },
  { en: ["hyderabad"], hi: ["हैदराबाद"] },
  { en: ["jabalpur"], hi: ["जबलपुर"] },
  { en: ["kanpur"], hi: ["कानपुर"] },
  { en: ["jhansi"], hi: ["झांसी"] },
  { en: ["hathras"], hi: ["हाथरस"] },
  { en: ["firozabad"], hi: ["फिरोजाबाद"] },
  { en: ["mainpuri"], hi: ["मैनपुरी"] },
  { en: ["etawah"], hi: ["इटावा"] },
  { en: ["etah"], hi: ["एटा"] },
  { en: ["bareilly"], hi: ["बरेली"] },
  { en: ["mathura"], hi: ["मथुरा"] },
  { en: ["meerut"], hi: ["मेरठ"] },
  { en: ["unnao"], hi: ["उन्नाव"] },
  { en: ["raebareli"], hi: ["रायबरेली"] },
  { en: ["sagar"], hi: ["सागर"] },
  { en: ["damoh"], hi: ["दमोह"] },
  { en: ["narsinghpur"], hi: ["नरसिंहपुर"] },

  // States
  { en: ["uttar pradesh", "up", "u p"], hi: ["उत्तर प्रदेश", "उ०प्र०", "यूपी"] },
  { en: ["madhya pradesh", "mp", "m p"], hi: ["मध्य प्रदेश", "म०प्र०", "एमपी"] },
  { en: ["rajasthan", "raj"], hi: ["राजस्थान"] },
  { en: ["haryana"], hi: ["हरियाणा"] },
  { en: ["punjab"], hi: ["पंजाब"] },
  { en: ["telangana"], hi: ["तेलंगाना"] },
  { en: ["uttarakhand"], hi: ["उत्तराखंड", "उत्तराञ्चल"] },
  { en: ["all india", "national"], hi: ["अखिल भारतीय", "राष्ट्रीय"] },

  // Roles & Titles
  { en: ["president", "adhyaksh"], hi: ["अध्यक्ष"] },
  { en: ["national president", "rashtriya adhyaksh"], hi: ["राष्ट्रीय अध्यक्ष"] },
  { en: ["vice president", "upadhyaksh"], hi: ["उपाध्यक्ष", "वरिष्ठ उपाध्यक्ष"] },
  { en: ["patron", "sanrakshak"], hi: ["संरक्षक", "राष्ट्रीय संरक्षक"] },
  { en: ["adviser", "advisory", "paramarshdata"], hi: ["परामर्शदात्री", "सलाहकार"] },
  { en: ["coordinator", "sanyojak"], hi: ["संयोजक", "राष्ट्रीय संयोजक"] },
  { en: ["general secretary", "mahasachiv"], hi: ["महासचिव", "राष्ट्रीय महासचिव"] },
  { en: ["secretary", "sachiv"], hi: ["सचिव", "राष्ट्रीय सचिव"] },
  { en: ["treasurer", "koshadhyaksh"], hi: ["कोषाध्यक्ष", "राष्ट्रीय कोषाध्यक्ष"] },
  { en: ["spokesperson", "pravakta"], hi: ["प्रवक्ता", "राष्ट्रीय प्रवक्ता"] },
  { en: ["media", "media incharge"], hi: ["मीडिया", "मीडिया प्रभारी"] },
  { en: ["advocate", "lawyer", "vakeel", "legal"], hi: ["अधिवक्ता", "विधिक", "वकील"] },
  { en: ["doctor", "dr"], hi: ["डॉ", "डा०", "चिकित्सक", "डॉक्टर"] },
  { en: ["engineer", "eng", "er"], hi: ["इंजीनियर", "अभियंता", "इं०", "इंजी०"] },
  { en: ["auditor", "cag"], hi: ["लेखा परीक्षक", "लेखा", "ऑडिट"] },
  { en: ["officer", "adhikari"], hi: ["अधिकारी"] },
  { en: ["employee", "karmachari"], hi: ["कर्मचारी"] },
  { en: ["elder", "margdarshak"], hi: ["मार्गदर्शक", "वरिष्ठ"] },

  // Prominent Member First Names
  { en: ["veerwal", "birbal", "beerbal"], hi: ["वीरवल", "बीरबल"] },
  { en: ["rajendra", "rajendar"], hi: ["राजेन्द्र", "राजेंद्र"] },
  { en: ["vishwanath", "bishwanath"], hi: ["विश्वनाथ", "विशवनाथ"] },
  { en: ["atiwal", "ati pal", "atibal"], hi: ["अतिवल", "अतिबल"] },
  { en: ["suresh"], hi: ["सुरेश"] },
  { en: ["shivsingh", "shiv singh"], hi: ["शिवसिंह", "शिव सिंह"] },
  { en: ["vinod", "binod"], hi: ["विनोद", "बिनोद"] },
  { en: ["sobran"], hi: ["सोबरन"] },
  { en: ["santosh"], hi: ["संतोष"] },
  { en: ["ashok"], hi: ["अशोक"] },
  { en: ["rachna", "rachana"], hi: ["रचना"] },
  { en: ["arvind", "arbind"], hi: ["अरविन्द", "अरविंद"] },
  { en: ["omkar", "aumkar"], hi: ["ओमकार", "ओंकार"] },
  { en: ["narwaria", "narwariya"], hi: ["नरवरिया"] },
  { en: ["vijay", "bijay"], hi: ["विजय", "विजयपुर"] },
  { en: ["abhishek"], hi: ["अभिषेक"] },
  { en: ["kishori", "kishori lal"], hi: ["किशोरी", "किशोरी लाल"] },
  { en: ["kashiram", "kashi ram"], hi: ["काशीराम", "काशी राम"] },
  { en: ["ramesh"], hi: ["रमेश"] },
  { en: ["dinesh"], hi: ["दिनेश"] },
  { en: ["lakhan"], hi: ["लखन"] },
  { en: ["harsh"], hi: ["हर्ष"] },
  { en: ["dharmendra", "dharmendar"], hi: ["धर्मेन्द्र", "धर्मेंद्र"] },
  { en: ["ramsevak", "ram sewak"], hi: ["रामसेवक", "राम सेवक"] },
  { en: ["badri", "badri vishal"], hi: ["बद्री", "बद्री विशाल"] },
  { en: ["brahmanand"], hi: ["ब्रह्मानंद", "ब्रम्हानंद"] },
  { en: ["avanti", "avanti bai"], hi: ["अवंती", "अवंतीबाई", "अवंती बाई"] },
  { en: ["gulab", "gulab singh"], hi: ["गुलाब", "गुलाब सिंह"] },
  { en: ["hirdeshah", "hridayshah"], hi: ["हिरदेशाह", "हिरदे शाह", "हृदयशाह"] },
];

/**
 * Phonetic transliteration from Devanagari to Romanized Latin
 */
export function devanagariToLatin(str) {
  if (!str) return "";
  const consonants = {
    क: "k", ख: "kh", ग: "g", घ: "gh", ङ: "ng",
    च: "ch", छ: "chh", ज: "j", झ: "jh", ञ: "ny",
    ट: "t", ठ: "th", ड: "d", ढ: "dh", ण: "n",
    त: "t", थ: "th", द: "d", ध: "dh", न: "n",
    प: "p", फ: "ph", ब: "b", भ: "bh", म: "m",
    य: "y", र: "r", ल: "l", व: "v",
    श: "sh", ष: "sh", स: "s", ह: "h",
    क्ष: "ksh", त्र: "tr", ज्ञ: "gya", श्र: "shr",
    ड़: "r", ढ़: "rh", ज़: "z", फ़: "f",
  };
  const matras = {
    "ा": "a", "ि": "i", "ी": "i", "ु": "u", "ू": "u",
    "े": "e", "ै": "ai", "ो": "o", "ौ": "au",
    "्": "", "ं": "n", "ँ": "n", "ः": "h", "ृ": "ri",
  };
  const vowels = {
    अ: "a", आ: "a", इ: "i", ई: "i", उ: "u", ऊ: "u",
    ए: "e", ऐ: "ai", ओ: "o", औ: "au", ऋ: "ri",
  };

  let res = "";
  const chars = Array.from(str);
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const next = chars[i + 1];
    if (vowels[c]) {
      res += vowels[c];
    } else if (consonants[c]) {
      res += consonants[c];
      if (!matras[next] && consonants[next]) {
        res += "a";
      } else if (!matras[next] && next && !" \t\n,.-()०१२३४५६७८९".includes(next)) {
        res += "a";
      }
    } else if (matras[c] !== undefined) {
      res += matras[c];
    } else {
      res += c;
    }
  }
  return res.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Given a search string (Hindi or English), generate all relevant search tokens
 * so that queries in either script match the records.
 */
export function getSearchTokens(query) {
  if (!query) return [];
  const clean = query.trim().toLowerCase();
  const tokens = new Set();
  tokens.add(clean);

  // Split into individual words
  const words = clean.split(/\s+/).filter(Boolean);
  words.forEach((w) => tokens.add(w));

  const isLatin = /^[a-z0-9\s.,-]+$/i.test(clean);

  if (isLatin) {
    // English query: find matching Hindi terms in dictionary
    for (const entry of BILINGUAL_DICTIONARY) {
      const matchesEn = entry.en.some((e) => clean.includes(e) || e.includes(clean));
      if (matchesEn) {
        entry.hi.forEach((h) => tokens.add(h));
        entry.en.forEach((e) => tokens.add(e));
      }
    }
  } else {
    // Hindi query: find matching English terms in dictionary
    for (const entry of BILINGUAL_DICTIONARY) {
      const matchesHi = entry.hi.some((h) => clean.includes(h) || h.includes(clean));
      if (matchesHi) {
        entry.en.forEach((e) => tokens.add(e));
        entry.hi.forEach((h) => tokens.add(h));
      }
    }
    // Also add transliterated Latin version
    const latin = devanagariToLatin(clean);
    if (latin) tokens.add(latin);
  }

  return Array.from(tokens);
}

/**
 * Generate enriched bilingual search tags for a member record.
 */
export function generateMemberSearchTags(member) {
  const tags = new Set(member.tags || []);

  const nameLatin = devanagariToLatin(member.name);
  if (nameLatin) {
    tags.add(nameLatin);
    nameLatin.split(/\s+/).forEach((w) => {
      if (w.length > 2) tags.add(w);
    });
  }

  const cityLatin = devanagariToLatin(member.city);
  if (cityLatin) {
    tags.add(cityLatin);
    cityLatin.split(/\s+/).forEach((w) => {
      if (w.length > 2) tags.add(w);
    });
  }

  const stateLatin = devanagariToLatin(member.state);
  if (stateLatin) {
    tags.add(stateLatin);
  }

  const occLatin = devanagariToLatin(member.occupation);
  if (occLatin) {
    occLatin.split(/\s+/).forEach((w) => {
      if (w.length > 3) tags.add(w);
    });
  }

  // Cross-reference bilingual dictionary
  const fullTextHi = [member.name, member.city, member.state, member.occupation, member.company].join(" ");
  for (const entry of BILINGUAL_DICTIONARY) {
    const hasHi = entry.hi.some((h) => fullTextHi.includes(h));
    if (hasHi) {
      entry.en.forEach((e) => tags.add(e));
    }
  }

  return Array.from(tags);
}
