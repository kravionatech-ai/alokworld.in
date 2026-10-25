const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/alokworld";

// Admin Schema
const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, default: "Directory Administrator" },
    role: { type: String, default: "superadmin" },
  },
  { timestamps: true }
);

// Member Schema
const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true, index: true },
    role: { type: String, default: "Member" },
    occupation: { type: String, required: true },
    company: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, default: "" },
    pincode: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    avatar: { type: String, default: "" },
    biography: { type: String, default: "" },
    tags: [{ type: String }],
    membershipStatus: { type: String, enum: ["active", "pending", "archived"], default: "active" },
    isApproved: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: true },
    showAddress: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// GalleryItem Schema
const GalleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "Event", trim: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, default: "" },
    description: { type: String, default: "", trim: true },
    eventDate: { type: String, default: "", trim: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Personality Schema
const PersonalitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    era: { type: String, default: "" },
    photo: { type: String, default: "" },
    summary: { type: String, required: true },
    biography: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// SiteSettings Schema
const SiteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "अखिल भारतीय समाज डिरेक्टरी - alokworld.in" },
    tagline: { type: String, default: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक)" },
    announcement: { type: String, default: "राष्ट्रीय अधिवेशन 2026 की पूर्व तैयारी एवं सदस्यता अभियान में सादर आमंत्रित हैं।" },
    announcementEnabled: { type: Boolean, default: true },
    heroBadge: { type: String, default: "आधिकारिक समुदाय पोर्टल" },
    heroTitle: { type: String, default: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल" },
    heroSubtitle: { type: String, default: "देश भर के समाज बंधुओं, वरिष्ठ मार्गदर्शकों, चिकित्सकों, अभियंताओं, प्रशासनिक अधिकारियों, अधिवक्ताओं एवं युवाओं को जोड़ने वाला डिजिटल मंच।" },
    heroCtaText: { type: String, default: "सदस्य डायरेक्टरी देखें →" },
    heroCtaLink: { type: String, default: "/directory" },
    heroImage: { type: String, default: "/asset/alokadhivationposter2026/poster1.jpeg" },
    sidebarNoticeTitle: { type: String, default: "समाज संदेश एवं सूचनाएं" },
    sidebarNoticeContent: { type: String, default: "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।" },
    sidebarNoticeEnabled: { type: Boolean, default: true },
    adTitle: { type: String, default: "समाज व्यापार एवं उद्योग संवर्धन" },
    adBannerText: { type: String, default: "राष्ट्रव्यापी समाज डायरेक्टरी नेटवर्क के माध्यम से अपने व्यवसाय एवं प्रतिष्ठान का प्रचार करें।" },
    adLink: { type: String, default: "/contact" },
    adEnabled: { type: Boolean, default: true },
    contactEmail: { type: String, default: "admin@alokworld.in" },
    contactPhone: { type: String, default: "+91 98734 83657" },
    contactAddress: { type: String, default: "केंद्रीय राष्ट्रीय सचिवालय, नई दिल्ली, भारत" },
    whatsappNumber: { type: String, default: "+91 98734 83657" },
    seoTitle: { type: String, default: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल | alokworld.in" },
    seoDescription: { type: String, default: "अखिल भारतीय लोधी, लोधा, लोध समाज की आधिकारिक डिजिटल डायरेक्टरी - देश भर के सत्यापित समाज बंधुओं, वरिष्ठ मार्गदर्शकों एवं प्रबुद्ध अधिकारियों से जुड़ें।" },
    seoKeywords: { type: String, default: "समाज डायरेक्टरी, लोधी समाज, लोधा महासभा, alokworld, समाज पोर्टल, अखिल भारतीय लोधी अधिकारी, लोध समाज डायरेक्टरी" },
    siteUrl: { type: String, default: "https://alokworld.in" },
    ogImage: { type: String, default: "/asset/alokadhivationposter2026/poster1.jpeg" },
    organizationName: { type: String, default: "अखिल भारतीय लोधी, लोधा, लोध समाज महासभा" },
    googleVerificationId: { type: String, default: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg" },
    twitterHandle: { type: String, default: "@alokworldin" },
    maintenanceMode: { type: Boolean, default: true },
    maintenanceBarEnabled: { type: Boolean, default: true },
    maintenancePopupEnabled: { type: Boolean, default: true },
    maintenanceMessage: {
      type: String,
      default: "सूचना: पोर्टल पर तकनीकी सुधार एवं डेटा सत्यापन कार्य प्रगति पर है। कुछ सेवाएं अस्थायी रूप से प्रभावित हो सकती हैं।",
    },
    maintenancePopupTitle: {
      type: String,
      default: "वेबसाइट विकास एवं डेटा सत्यापन प्रगति पर",
    },
    maintenancePopupMessage: {
      type: String,
      default: "alokworld.in पर आपका स्वागत है! हम नवीन सुविधाओं एवं सत्यापित डायरेक्टरी अभिलेखों को निरंतर अद्यतन कर रहे हैं।",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);
const GalleryItem = mongoose.models.GalleryItem || mongoose.model("GalleryItem", GalleryItemSchema);
const Personality = mongoose.models.Personality || mongoose.model("Personality", PersonalitySchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

// Authentic gallery items using original assets
const authenticGallery = [
  {
    title: "अखिल भारतीय आलोक संघ राष्ट्रीय अधिवेशन 2026 पोस्टर",
    category: "National Convention",
    eventDate: "2026",
    imageUrl: "/asset/alokadhivationposter2026/poster1.jpeg",
    description: "राष्ट्रीय अधिवेशन 2026 आधिकारिक आमंत्रण एवं राष्ट्रीय पुरस्कार घोषणा पत्र।",
    isPublished: true,
  },
  {
    title: "आलोक रत्न पुरस्कार 2023-2025 — उत्कृष्ट सामाजिक सेवा",
    category: "Awards",
    eventDate: "2026",
    imageUrl: "/asset/alokadhivationposter2026/poster2.jpeg",
    description: "समाज के उत्थान एवं निस्वार्थ सेवा हेतु समर्पित विभूतियों के लिए सर्वोच्च आलोक रत्न सम्मान।",
    isPublished: true,
  },
  {
    title: "अमर शहीद महारानी अवंतीबाई लोधी पुरस्कार — अधिकारी एवं कर्मचारी सेवा",
    category: "Awards",
    eventDate: "2026",
    imageUrl: "/asset/alokadhivationposter2026/poster3.jpeg",
    description: "शासकीय एवं अर्धशासकीय सेवाओं में उत्कृष्ट योगदान देने वाले अधिकारियों एवं कर्मचारियों हेतु सम्मान।",
    isPublished: true,
  },
  {
    title: "स्वामी ब्रह्मानंद पुरस्कार — उच्च शिक्षा एवं मेधावी छात्र सम्मान",
    category: "Awards",
    eventDate: "2026",
    imageUrl: "/asset/alokadhivationposter2026/poster4.jpeg",
    description: "आईआईटी, आईआईएम, एम्स, नीट व यूपीएससी में चयनित मेधावी छात्र-छात्राओं का राष्ट्रीय सम्मान।",
    isPublished: true,
  },
  {
    title: "राजा हिरदे शाह पुरस्कार — संगठन विस्तार एवं सक्रिय सदस्यता सम्मान",
    category: "Awards",
    eventDate: "2026",
    imageUrl: "/asset/alokadhivationposter2026/poster5.jpeg",
    description: "आलोक संघ को संगठनात्मक स्तर पर सशक्त बनाने वाले समर्पित पदाधिकारियों एवं कार्यकर्ताओं हेतु।",
    isPublished: true,
  },
  {
    title: "आलोक उत्तर प्रदेश प्रांतीय अधिवेशन एवं कार्यकारिणी बैठक",
    category: "State Convention",
    eventDate: "2025",
    imageUrl: "/asset/listofmemberswithdesignation/alok up.jpeg",
    description: "उत्तर प्रदेश राज्य इकाई का प्रांतीय सम्मेलन एवं संगठनात्मक विचार-विमर्श।",
    isPublished: true,
  },
  {
    title: "अखिल भारतीय समाज डायरेक्टरी मुख्य फ्रंट बैनर",
    category: "Heritage",
    eventDate: "2025",
    imageUrl: "/asset/topofwebsite/web_sit_front.png",
    description: "अखिल भारतीय लोधी, लोधा, लोध समाज डायरेक्टरी आधिकारिक कलात्मक बैनर।",
    isPublished: true,
  },
  {
    title: "अखिल भारतीय आलोक संघ राष्ट्रीय अधिवेशन स्मृति",
    category: "Event",
    eventDate: "2025",
    imageUrl: "/asset/1002458487.jpg",
    description: "अखिल भारतीय लोधी समाज प्रमुख प्रतिनिधियों की राष्ट्रीय संगोष्ठी।",
    isPublished: true,
  },
  {
    title: "आलोक धौलपुर राजस्थान प्रांतीय सम्मेलन",
    category: "State Convention",
    eventDate: "2025",
    imageUrl: "/asset/photo/dholpur1.png",
    description: "धौलपुर राजस्थान में आयोजित समाज कल्याण एवं प्रतिभा सम्मान समारोह।",
    isPublished: true,
  },
];

// Authentic historical personalities (only verified depictions, no modern photos)
const authenticPersonalities = [
  {
    name: "वीरांगना रानी अवंतीबाई लोधी",
    title: "1857 के प्रथम स्वतंत्रता संग्राम की अमर महानायिका",
    era: "1831 - 1858",
    photo: "/asset/personalities/rani_avanti_bai.png",
    summary: "रामगढ़ रियासत की साहसी वीरांगना जिन्होंने 1857 के प्रथम स्वाधीनता संग्राम में ब्रिटिश हुकूमत के विरुद्ध 4,000 वीर सैनिकों का नेतृत्व कर अदम्य पराक्रम दिखाया और मातृभूमि की रक्षा हेतु अपने प्राण न्योछावर किए।",
    biography: "<p>वीरांगना रानी अवंतीबाई लोधी भारत के प्रथम स्वतंत्रता संग्राम (1857) की अप्रतिम नायिका थीं। उन्होंने रामगढ़ की सेना का नेतृत्व करते हुए ब्रिटिश छावनियों को ध्वस्त किया और आत्मसमर्पण के स्थान पर मातृभूमि की बलिवेदी पर सर्वोच्च बलिदान दिया।</p>",
    order: 1,
    isPublished: true,
  },
  {
    name: "शहीद गुलाब सिंह लोधी",
    title: "अमीनाबाद लखनऊ झंडा सत्याग्रह के अमर बलिदानी",
    era: "1903 - 1935",
    photo: "/asset/personalities/shaheed_gulab_singh.png",
    summary: "उन्नाव के सपूत जिन्होंने 23 अगस्त 1935 को लखनऊ के झंडेवाला पार्क में ब्रिटिश गोलियों की परवाह न करते हुए तिरंगा फहराया और देश की आज़ादी के लिए अपने प्राणों का बलिदान दिया।",
    biography: "<p>फतेहपुर चौरासी (उन्नाव) में जन्मे अमर शहीद गुलाब सिंह लोधी ने महात्मा गांधी के राष्ट्रीय आंदोलनों में भाग लिया। लखनऊ में भारी पुलिस घेराबंदी को तोड़ते हुए विशाल बरगद के पेड़ पर चढ़कर तिरंगा फहराया और ब्रिटिश गोलियों का सीने पर सामना करते हुए वीरगति प्राप्त की।</p>",
    order: 2,
    isPublished: true,
  },
  {
    name: "स्वामी ब्रह्मानंद जी महाराज",
    title: "शिक्षा क्रांति के अग्रदूत, समाज सुधारक एवं सांसद",
    era: "1894 - 1984",
    photo: "/asset/personalities/swami_brahmanand.png",
    summary: "बुंदेलखंड में शिक्षा की अलख जगाने वाले महान संत एवं हमीरपुर से लोकसभा सांसद जिन्होंने निर्धन एवं वंचित वर्ग के लिए दर्जनों शिक्षण संस्थानों, गुरुकुलों व छात्रावासों की स्थापना की।",
    biography: "<p>स्वामी ब्रह्मानंद जी महाराज ने संपूर्ण बुंदेलखंड में अज्ञानता और अशिक्षा के अंधकार को मिटाने हेतु अपना जीवन समर्पित किया। राठ (हमीरपुर) में ब्रह्मानंद महाविद्यालय, इंटर कॉलेज एवं संस्कृत विद्यालयों की स्थापना कर लाखों युवाओं को निःशुल्क शिक्षा और जीवन की नई दिशा दी।</p>",
    order: 3,
    isPublished: true,
  },
  {
    name: "राजा हिरदे शाह लोधी",
    title: "1842 के ऐतिहासिक बुंदेला विद्रोह के प्रमुख जननायक",
    era: "1806 - 1852",
    photo: "/asset/personalities/raja_hridayshah.png",
    summary: "हीरापुर रियासत के वीर शासक जिन्होंने ईस्ट इंडिया कंपनी की अन्यायपूर्ण नीतियों के विरुद्ध 1842 में सशक्त सशस्त्र क्रांति का बिगुल फूंका और नरसिंहपुर, दमोह व सागर क्षेत्र को स्वाधीन कराया।",
    biography: "<p>हीरापुर के जननायक राजा हिरदे शाह लोधी ने 1857 से 15 वर्ष पूर्व ही 1842 के बुंदेला विद्रोह में अंग्रेजी हुकूमत की चूलें हिला दी थीं। उनके अदम्य साहस ने मध्य भारत में स्वाधीनता संग्राम की अमर ज्वाला प्रज्वलित की।</p>",
    order: 4,
    isPublished: true,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for seeding...");

  // 1. Seed or Update Admin Account
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || "admin@alokworld.in").toLowerCase();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "AdminSecure@2026";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await Admin.deleteMany({ email: adminEmail });
  await Admin.create({
    email: adminEmail,
    password: hashedPassword,
    name: "Super Administrator",
    role: "superadmin",
  });
  console.log(`Admin account created: ${adminEmail}`);

  // 2. Load and Seed Verified Members from JSON
  const membersPath = path.join(__dirname, "verified-source-members.json");
  const fallbackMembersPath = path.join(__dirname, "authentic-members.json");
  let authenticMembers = [];
  if (fs.existsSync(membersPath)) {
    authenticMembers = JSON.parse(fs.readFileSync(membersPath, "utf-8"));
  } else if (fs.existsSync(fallbackMembersPath)) {
    authenticMembers = JSON.parse(fs.readFileSync(fallbackMembersPath, "utf-8"));
  }

  if (authenticMembers.length > 0) {
    await Member.deleteMany({});
    const inserted = await Member.insertMany(authenticMembers);
    console.log(`Successfully seeded ${inserted.length} authentic members from official Excel & PDF lists!`);
  } else {
    console.log("Warning: authentic-members.json not found, skipping member seed.");
  }

  // 3. Seed Authentic Gallery Items
  await GalleryItem.deleteMany({});
  const insertedGallery = await GalleryItem.insertMany(authenticGallery);
  console.log(`Successfully seeded ${insertedGallery.length} authentic gallery convention items.`);

  // 4. Seed Authentic Personalities
  await Personality.deleteMany({});
  const insertedPersonalities = await Personality.insertMany(authenticPersonalities);
  console.log(`Successfully seeded ${insertedPersonalities.length} authentic historical personalities.`);

  // 5. Update or Seed Site Settings
  await SiteSettings.deleteMany({});
  await SiteSettings.create({
    siteName: "अखिल भारतीय समाज डिरेक्टरी - alokworld.in",
    tagline: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक)",
    announcement: "राष्ट्रीय अधिवेशन 2026 की पूर्व तैयारी एवं सदस्यता अभियान में सादर आमंत्रित हैं।",
    announcementEnabled: true,
    heroBadge: "आधिकारिक समुदाय पोर्टल",
    heroTitle: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल",
    heroSubtitle: "देश भर के समाज बंधुओं, वरिष्ठ मार्गदर्शकों, चिकित्सकों, अभियंताओं, प्रशासनिक अधिकारियों, अधिवक्ताओं एवं युवाओं को जोड़ने वाला डिजिटल मंच।",
    heroCtaText: "सदस्य डायरेक्टरी देखें →",
    heroCtaLink: "/directory",
    heroImage: "/asset/alokadhivationposter2026/poster1.jpeg",
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
    ogImage: "/asset/alokadhivationposter2026/poster1.jpeg",
    organizationName: "अखिल भारतीय लोधी, लोधा, लोध समाज महासभा",
    googleVerificationId: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
    twitterHandle: "@alokworldin",
    maintenanceMode: true,
    maintenanceBarEnabled: true,
    maintenancePopupEnabled: true,
    maintenanceMessage: "सूचना: पोर्टल पर तकनीकी सुधार एवं डेटा सत्यापन कार्य प्रगति पर है। कुछ सेवाएं अस्थायी रूप से प्रभावित हो सकती हैं।",
    maintenancePopupTitle: "वेबसाइट विकास एवं डेटा सत्यापन प्रगति पर",
    maintenancePopupMessage: "alokworld.in पर आपका स्वागत है! हम नवीन सुविधाओं एवं सत्यापित डायरेक्टरी अभिलेखों को निरंतर अद्यतन कर रहे हैं।",
  });
  console.log("Site settings successfully initialized.");

  await mongoose.disconnect();
  console.log("Seeding fully completed!");
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
