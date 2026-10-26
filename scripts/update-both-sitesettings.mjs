import mongoose from "mongoose";

const LOCAL_URI = "mongodb://127.0.0.1:27017/alokworld";
const ATLAS_URI = "mongodb+srv://alokworld2018_db_user:BdbDHFnNAyg6yNYX@cluster0.rtasufn.mongodb.net/alokworld";

const defaultHeroSlides = [
  {
    id: "hero-main",
    badge: "आधिकारिक समुदाय पोर्टल",
    title: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक)",
    subtitle:
      "अखिल भारतीय समाज डायरेक्टरी — देशभर के सेवारत व सेवानिवृत्त अधिकारियों, कर्मचारियों, प्रबुद्धजनों एवं युवाओं का सशक्त व पारदर्शी डिजिटल मंच।",
    ctaText: "सदस्य डायरेक्टरी देखें →",
    ctaLink: "/directory",
    secondaryCtaText: "कार्यकारिणी संरचना",
    secondaryCtaLink: "/organization",
    image: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924154/alokworld/banners/web_sit_front1.png",
    enabled: true,
  },
  {
    id: "hero-adhiveshan-2026",
    badge: "राष्ट्रीय अधिवेशन 2026",
    title: "आलोक राष्ट्रीय प्रतिभा सम्मान समारोह-2026",
    subtitle:
      "15 नवम्बर 2026 (रविवार), समय: प्रातः 10:00 से सायं 4:00 बजे | स्थान: कांस्टीट्यूशन क्लब, रफी मार्ग, नई दिल्ली। समाज के समग्र विकास, शिक्षा एवं संगठनात्मक सशक्तीकरण हेतु चारों राष्ट्रीय पुरस्कारों के आवेदन आमंत्रित।",
    ctaText: "अधिवेशन विवरण देखें →",
    ctaLink: "/mahasabha",
    secondaryCtaText: "आधिकारिक पोस्टर देखें",
    secondaryCtaLink: "/gallery",
    image: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924149/alokworld/posters/poster1.jpg",
    enabled: true,
  },
  {
    id: "hero-education-merit",
    badge: "शिक्षा एवं छात्र प्रतिभा",
    title: "स्वामी ब्रह्मानंद सम्मान पुरस्कार — प्रतिभावान छात्र-छात्रा सम्मान",
    subtitle:
      "आईआईटी (IIT), एमबीबीएस (MBBS), आईआईएम (IIM), आईआईएफटी (IIFT) एवं संघ लोक सेवा आयोग (UPSC) सहित उच्च संस्थानों में चयनित समाज के होनहार विद्यार्थियों का राष्ट्रीय स्तर पर सम्मान।",
    ctaText: "युवा प्रकोष्ठ विवरण →",
    ctaLink: "/organization",
    secondaryCtaText: "छात्र मार्गदर्शन संपर्क",
    secondaryCtaLink: "/contact",
    image: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924151/alokworld/posters/poster4.jpg",
    enabled: true,
  },
  {
    id: "hero-public-service",
    badge: "लोक सेवा एवं गौरवशाली विरासत",
    title: "अमर शहीद महारानी अवंतीबाई लोधी पुरस्कार — अधिकारी-कर्मचारी सेवा",
    subtitle:
      "केंद्रीय व राज्य सरकार के उपक्रमों, अर्ध-सरकारी संस्थानों एवं लोक सेवाओं में नव-नियुक्त तथा निष्ठापूर्वक सेवानिवृत्त समाज के सम्मानित अधिकारियों एवं कर्मचारियों का राष्ट्रीय अभिनंदन।",
    ctaText: "समाज इतिहास पढ़ें →",
    ctaLink: "/history",
    secondaryCtaText: "विभूतियां देखें",
    secondaryCtaLink: "/personalities",
    image: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924150/alokworld/posters/poster3.jpg",
    enabled: true,
  },
  {
    id: "hero-organization-expand",
    badge: "संगठन एवं सदस्यता अभियान",
    title: "राजा हिरदे शाह सम्मान — संगठन सशक्तीकरण एवं सदस्यता अभियान",
    subtitle:
      "आलोक संघ को राज्यों और जिलों में सशक्त बनाने, सदस्यता का व्यापक विस्तार करने और समाज को एकजुट करने वाले समर्पित प्रतिनिधियों एवं कर्मठ कार्यकर्ताओं का विशेष सम्मान।",
    ctaText: "संगठन से जुड़ें →",
    ctaLink: "/contact",
    secondaryCtaText: "डायरेक्टरी खोजें",
    secondaryCtaLink: "/directory",
    image: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924152/alokworld/posters/poster5.jpg",
    enabled: true,
  },
  {
    id: "hero-ratna-award",
    badge: "विशिष्ट समाज सेवा सम्मान",
    title: "आलोक रत्न पुरस्कार — समग्र समाज विकास एवं जनकल्याण",
    subtitle:
      "शैक्षणिक, आर्थिक, सामाजिक-सांस्कृतिक, राजनैतिक व रोज़गार के क्षेत्र में समाज के समग्र उत्थान और आलोक अभियान को आगे बढ़ाने में उल्लेखनीय योगदान देने वाले समाजसेवियों का सर्वोच्च सम्मान।",
    ctaText: "छायाचित्र दीर्घा देखें →",
    ctaLink: "/gallery",
    secondaryCtaText: "महासभा संकल्प",
    secondaryCtaLink: "/mahasabha",
    image: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924150/alokworld/posters/poster2.jpg",
    enabled: true,
  },
];

const defaultAnnouncementsList = [
  {
    id: "ann-1",
    tag: "सूचना",
    text: "राष्ट्रीय अधिवेशन 2026 की पूर्व तैयारी एवं सदस्यता अभियान में सादर आमंत्रित हैं।",
    link: "/directory",
    linkText: "डायरेक्टरी देखें →",
    enabled: true,
  },
  {
    id: "ann-2",
    tag: "अधिवेशन",
    text: "आगामी 2 नवंबर 2026 राष्ट्रीय महासम्मेलन एवं प्रतिभा सम्मान समारोह में सादर आमंत्रित हैं।",
    link: "/mahasabha",
    linkText: "अधिवेशन विवरण →",
    enabled: true,
  },
  {
    id: "ann-3",
    tag: "विरासत",
    text: "वीरांगना रानी अवंतीबाई एवं अमर शहीद गुलाब सिंह के शौर्य और बलिदान को सादर नमन।",
    link: "/history",
    linkText: "इतिहास पढ़ें →",
    enabled: true,
  },
];

const defaultQuickPillars = [
  { id: "qp-1", title: "समाज डायरेक्टरी", desc: "सत्यापित सदस्य विवरण, वरिष्ठजन, डॉक्टर, इंजीनियर व अधिवक्ता।", href: "/directory", icon: "👥", enabled: true },
  { id: "qp-2", title: "समाज इतिहास", desc: "गौरवशाली विरासत, स्वतंत्रता संग्राम व ऐतिहासिक जड़ें।", href: "/history", icon: "📜", enabled: true },
  { id: "qp-3", title: "विभूतियां", desc: "वीर स्वतंत्रता सेनानी, समाज सुधारक एवं महापुरुष।", href: "/personalities", icon: "🎖️", enabled: true },
  { id: "qp-4", title: "महासभा संकल्प", desc: "आलोक राष्ट्रीय महाधिवेशन एवं समाज विकास के प्रस्ताव।", href: "/mahasabha", icon: "⚖️", enabled: true },
  { id: "qp-5", title: "संगठन एवं इकाइयां", desc: "राष्ट्रीय कार्यकारिणी, युवा प्रकोष्ठ व प्रांतीय शाखाएं।", href: "/organization", icon: "🏛️", enabled: true },
  { id: "qp-6", title: "छायाचित्र दीर्घा", desc: "राष्ट्रीय अधिवेशन व प्रतिभा सम्मान समारोह के क्षण।", href: "/gallery", icon: "📸", enabled: true },
];

const defaultOfficeBearers = [
  {
    id: "ob-1",
    name: "सर्वश्री अतिवल सिंह",
    role: "राष्ट्रीय अध्यक्ष",
    location: "उत्तर प्रदेश",
    phone: "+91 99999 00079",
    avatar: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924119/alokworld/leadership/Atibal_Singh_rajput.jpg",
    enabled: true,
  },
  {
    id: "ob-2",
    name: "सर्वश्री वीरवल सिंह",
    role: "अध्यक्ष परामर्शदात्री समिति",
    location: "उत्तर प्रदेश",
    phone: "+91 94544 12070",
    avatar: "",
    enabled: true,
  },
  {
    id: "ob-3",
    name: "सर्वश्री डा० ओमकार सिंह नरवरिया",
    role: "राष्ट्रीय कोषाध्यक्ष",
    location: "नई दिल्ली",
    phone: "+91 98734 83657",
    avatar: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924096/alokworld/leadership/Dr_Omkar_Singh.jpg",
    enabled: true,
  },
  {
    id: "ob-4",
    name: "डॉ. बद्री विशाल सिंह",
    role: "राष्ट्रीय संरक्षक (से०नि० महानिदेशक)",
    location: "लखनऊ, उत्तर प्रदेश",
    phone: "",
    avatar: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924123/alokworld/leadership/Dr_Badri_Vishal_R_Singh.jpg",
    enabled: true,
  },
  {
    id: "ob-5",
    name: "इंजीनियर हर्ष राजपूत",
    role: "राष्ट्रीय प्रवक्ता",
    location: "भोपाल, मध्य प्रदेश",
    phone: "",
    avatar: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924125/alokworld/leadership/Er._Harsh_Rajput.jpg",
    enabled: true,
  },
];

const fullSettingsUpdate = {
  siteName: "अखिल भारतीय समाज डिरेक्टरी - alokworld.in",
  tagline: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक)",

  headerBannerImage: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924152/alokworld/banners/heritage_banner_strip.jpg",
  headerTitle: "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ",
  headerSubtitle: "अखिल भारतीय लोधी समाज निर्देशिका — alokworld.in",

  announcement: "राष्ट्रीय अधिवेशन 2026 की पूर्व तैयारी एवं सदस्यता अभियान में सादर आमंत्रित हैं।",
  announcementEnabled: true,
  announcementsList: defaultAnnouncementsList,

  heroBadge: "आधिकारिक समुदाय पोर्टल",
  heroTitle: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल",
  heroSubtitle: "देश भर के समाज बंधुओं, वरिष्ठ मार्गदर्शकों, चिकित्सकों, अभियंताओं, प्रशासनिक अधिकारियों, अधिवक्ताओं एवं युवाओं को जोड़ने वाला डिजिटल मंच।",
  heroCtaText: "सदस्य डायरेक्टरी देखें →",
  heroCtaLink: "/directory",
  heroImage: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924149/alokworld/posters/poster1.jpg",
  heroSlides: defaultHeroSlides,

  quickPillars: defaultQuickPillars,

  leftNoticeTitle: "राष्ट्रीय अधिवेशन 2026",
  leftNoticeOrg: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक)",
  leftNoticeText: "राष्ट्रीय महाधिवेशन 2026 में समाज के समस्त अधिकारी, कर्मचारी एवं प्रबुद्धजन सादर आमंत्रित हैं।",
  leftNoticeLink: "/gallery",
  leftNoticeLinkText: "आधिकारिक पोस्टर देखें →",
  leftNoticeEnabled: true,

  featuredOfficeBearers: defaultOfficeBearers,

  // Empty and disabled events by default
  eventEnabled: false,
  eventTopBarEnabled: false,
  eventPopupEnabled: false,
  eventTitle: "",
  eventSubtitle: "",
  eventBadge: "",
  eventDate: "",
  eventLocation: "",
  eventCountdownLabel: "",
  eventDescription: "",
  eventImage: "",
  eventCtaText: "",
  eventCtaLink: "",
  eventsList: [],

  sidebarNoticeTitle: "समाज संदेश एवं सूचनाएं",
  sidebarNoticeContent: "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।",
  sidebarNoticeEnabled: true,
  keyRegions: ["लखनऊ", "भोपाल", "जयपुर", "नई दिल्ली", "ग्वालियर", "इंदौर", "हैदराबाद", "धौलपुर"],

  adTitle: "समाज व्यापार एवं उद्योग संवर्धन",
  adBannerText: "राष्ट्रव्यापी समाज डायरेक्टरी नेटवर्क के माध्यम से अपने व्यवसाय एवं प्रतिष्ठान का प्रचार करें।",
  adLink: "/contact",
  adEnabled: true,

  contactEmail: "admin@alokworld.in",
  contactPhone: "+91 98734 83657",
  contactAddress: "केंद्रीय राष्ट्रीय सचिवालय, नई दिल्ली, भारत",
  whatsappNumber: "+91 98734 83657",

  seoTitle: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल | alokworld.in",
  seoDescription: "अखिल भारतीय लोधी, लोधा, लोध समाज की आधिकारिक डिजिटल डायरेक्टरी - देश भर के सत्यापित समाज बंधुओं, वरिष्ठ मार्गदर्शकों एवं प्रबुद्ध अधिकारियों से जुड़ें।",
  seoKeywords: "समाज डायरेक्टरी, लोधी समाज, लोधा महासभा, alokworld, समाज पोर्टल, अखिल भारतीय लोधी अधिकारी, लोध समाज डायरेक्टरी",
  siteUrl: "https://alokworld.in",
  ogImage: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924149/alokworld/posters/poster1.jpg",
  organizationName: "अखिल भारतीय लोधी, लोधा, लोध समाज महासभा",
  googleVerificationId: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
  twitterHandle: "@alokworldin",

  maintenanceMode: false,
  maintenanceBarEnabled: false,
  maintenancePopupEnabled: false,
  maintenanceMessage: "पोर्टल लाइव एवं सक्रिय है।",
  maintenancePopupTitle: "अखिल भारतीय समाज डायरेक्टरी",
  maintenancePopupMessage: "alokworld.in पर आपका स्वागत है!",
};

async function updateBoth() {
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();

  console.log("Updating Local MongoDB 'sitesettings'...");
  await localConn.db.collection("sitesettings").deleteMany({});
  await localConn.db.collection("sitesettings").insertOne(fullSettingsUpdate);
  console.log("✓ Local 'sitesettings' updated.");

  console.log("Updating Atlas MongoDB 'sitesettings'...");
  await atlasConn.db.collection("sitesettings").deleteMany({});
  await atlasConn.db.collection("sitesettings").insertOne(fullSettingsUpdate);
  console.log("✓ Atlas 'sitesettings' updated.");

  // Verify
  const doc = await atlasConn.db.collection("sitesettings").findOne({});
  console.log("\nAtlas Verification:");
  console.log(" - siteName:", doc.siteName);
  console.log(" - headerTitle:", doc.headerTitle);
  console.log(" - eventEnabled:", doc.eventEnabled);
  console.log(" - eventsList length:", doc.eventsList.length);
  console.log(" - heroSlides length:", doc.heroSlides.length);
  console.log(" - announcementsList length:", doc.announcementsList.length);
  console.log(" - quickPillars length:", doc.quickPillars.length);
  console.log(" - featuredOfficeBearers length:", doc.featuredOfficeBearers.length);

  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

updateBoth().catch((err) => {
  console.error(err);
  process.exit(1);
});
