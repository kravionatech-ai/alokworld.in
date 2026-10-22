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
    heroBadge: { type: String, default: "Official Community Portal" },
    heroTitle: { type: String, default: "Akhil Bhartiya Samaj Directory & Central Portal" },
    heroSubtitle: { type: String, default: "A comprehensive digital network connecting community members, elders, doctors, engineers, advocates, merchants, and youth network across India." },
    heroCtaText: { type: String, default: "Explore Member Directory →" },
    heroCtaLink: { type: String, default: "/directory" },
    heroImage: { type: String, default: "/asset/alokadhivationposter2026/poster1.jpeg" },
    sidebarNoticeTitle: { type: String, default: "समाज संदेश एवं सूचनाएं" },
    sidebarNoticeContent: { type: String, default: "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।" },
    sidebarNoticeEnabled: { type: Boolean, default: true },
    adTitle: { type: String, default: "Community Business Spotlight" },
    adBannerText: { type: String, default: "Promote your business across community network." },
    adLink: { type: String, default: "/contact" },
    adEnabled: { type: Boolean, default: true },
    contactEmail: { type: String, default: "admin@alokworld.in" },
    contactPhone: { type: String, default: "+91 96085 53167" },
    contactAddress: { type: String, default: "National Secretariat, New Delhi, India" },
    whatsappNumber: { type: String, default: "+91 96085 53167" },
    seoTitle: { type: String, default: "Akhil Bhartiya Samaj Directory & Central Portal | alokworld.in" },
    seoDescription: { type: String, default: "Official Samaj Community Directory - search and connect with verified community members, elders, doctors, engineers, and professionals across India." },
    seoKeywords: { type: String, default: "samaj directory, community directory, alokworld, samaj portal, community members, lodhi samaj, alok sangh" },
    siteUrl: { type: String, default: "https://alokworld.in" },
    ogImage: { type: String, default: "/asset/alokadhivationposter2026/poster1.jpeg" },
    organizationName: { type: String, default: "Akhil Bhartiya Lodha, Lodhi, Lodh Mahasabha" },
    googleVerificationId: { type: String, default: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg" },
    twitterHandle: { type: String, default: "@alokworldin" },
    maintenanceMode: { type: Boolean, default: true },
    maintenanceBarEnabled: { type: Boolean, default: true },
    maintenancePopupEnabled: { type: Boolean, default: true },
    maintenanceMessage: {
      type: String,
      default: "वेबसाइट निर्माणाधीन एवं अद्यतन स्थिति में है — अखिल भारतीय समाज डायरेक्टरी",
    },
    maintenancePopupTitle: {
      type: String,
      default: "वेबसाइट निर्माणाधीन एवं अद्यतन स्थिति में है",
    },
    maintenancePopupMessage: {
      type: String,
      default: "Welcome to alokworld.in! We are actively updating features, verified directory records, and community services. Feel free to explore our portal.",
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
    description: "राष्ट्रीय अधिवेशन 2026 आधिकारिक पोस्टर — सामाजिक संगठन, शिक्षा एवं युवा सशक्तीकरण अभियान।",
    isPublished: true,
  },
  {
    title: "राष्ट्रीय अधिवेशन 2026 — सामाजिक एकता एवं अधिकार महासम्मेलन",
    category: "National Convention",
    eventDate: "2026",
    imageUrl: "/asset/alokadhivationposter2026/poster2.jpeg",
    description: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ का भव्य राष्ट्रीय समागम।",
    isPublished: true,
  },
  {
    title: "आलोक राष्ट्रीय अधिवेशन 2026 — युवा मार्गदर्शन एवं शैक्षणिक उन्नति",
    category: "Education & Youth",
    eventDate: "2026",
    imageUrl: "/asset/alokadhivationposter2026/poster3.jpeg",
    description: "प्रतियोगी परीक्षाओं की तैयारी, सिविल सर्विसेज मार्गदर्शन एवं छात्रवृत्ति कार्यक्रम।",
    isPublished: true,
  },
  {
    title: "आलोक राष्ट्रीय अधिवेशन 2026 — महिला सशक्तीकरण एवं सामाजिक उत्थान",
    category: "Social Welfare",
    eventDate: "2026",
    imageUrl: "/asset/alokadhivationposter2026/poster4.jpeg",
    description: "समाज में बालिकाओं की उच्च शिक्षा एवं महिला नेतृत्व को बढ़ावा देने हेतु विशेष सत्र।",
    isPublished: true,
  },
  {
    title: "आलोक राष्ट्रीय अधिवेशन 2026 — संगठनात्मक शक्ति एवं भावी कार्ययोजना",
    category: "Organization",
    eventDate: "2026",
    imageUrl: "/asset/alokadhivationposter2026/poster5.jpeg",
    description: "राष्ट्रीय कार्यकारिणी, राज्य इकाइयों एवं जिला इकाइयों की संयुक्त समीक्षा बैठक।",
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
    imageUrl: "/asset/photo/photo/dholpur1.png",
    description: "धौलपुर राजस्थान में आयोजित समाज कल्याण एवं प्रतिभा सम्मान समारोह।",
    isPublished: true,
  },
];

// Authentic historical personalities (only verified depictions, no modern photos)
const authenticPersonalities = [
  {
    name: "Veerangana Rani Avanti Bai Lodhi",
    title: "Immortal Heroine of the 1857 War of Independence",
    era: "1831 - 1858",
    photo: "/asset/topofwebsite/web_sit_front.png", // Authentic depiction from community artwork
    summary: "Queen of Ramgarh who led troops with extraordinary courage against British colonial forces during the First War of Indian Independence of 1857, making the supreme sacrifice for the motherland.",
    biography: "<p>Veerangana Rani Avanti Bai Lodhi is an eternal symbol of supreme bravery, patriotism, and woman power in India's freedom struggle. As the warrior ruler of Ramgarh, she raised an army of 4,000 valiant fighters, inflicted heavy defeats upon the British forces, and chose self-immolation over surrender when surrounded by enemy battalions, immortalizing her name in history.</p>",
    order: 1,
    isPublished: true,
  },
  {
    name: "Shaheed Gulab Singh Lodhi",
    title: "Immortal Freedom Fighter & Flag Bearer",
    era: "1903 - 1935",
    photo: "", // No contemporary photograph in archive - neutral noble seal
    summary: "Valiant young revolutionary who fearlessly hoisted the Indian tricolor in defiance of British bullets at Aminabad Park, Lucknow, sacrificing his life for national independence.",
    biography: "<p>Born in Fatehpur Chaurasi, Unnao, Uttar Pradesh, Shaheed Gulab Singh Lodhi was an ardent nationalist who joined Mahatma Gandhi's non-cooperation movement and the revolutionary struggle. On 23 August 1935, during a massive freedom demonstration at Jhandewala Park (Aminabad) in Lucknow, he climbed a tall banyan tree, unfurled the banned national tricolor flag, and embraced martyrdom when shot by colonial police.</p>",
    order: 2,
    isPublished: true,
  },
  {
    name: "Swami Brahmanand Ji",
    title: "Education Pioneer, Social Reformer & Parliamentarian",
    era: "1894 - 1984",
    photo: "", // No contemporary photograph in archive - neutral noble seal
    summary: "Visionary saint and Member of Parliament who spearheaded an educational revolution across Bundelkhand, establishing dozens of schools, gurukuls, and colleges to empower underprivileged communities.",
    biography: "<p>Swami Brahmanand Ji was a revered sanyasi, social reformer, and Member of Parliament from Hamirpur. He dedicated his entire life to wiping out illiteracy, rural poverty, and untouchability. He founded Brahmanand Inter College, Brahmanand Mahavidyalaya, and numerous Sanskrit mahavidyalayas in Rath, providing free education and food to thousands of poor students.</p>",
    order: 3,
    isPublished: true,
  },
  {
    name: "Raja Hridayshah Lodhi",
    title: "Legendary Leader of the 1842 Bundela Rebellion",
    era: "1806 - 1852",
    photo: "", // No contemporary photograph in archive - neutral noble seal
    summary: "Brave ruler of Hirapur who organized and led the historic armed uprising against exploitative British agrarian and taxation policies in 1842.",
    biography: "<p>Raja Hridayshah of Hirapur was a key commander of the 1842 Bundela uprising against East India Company rule. His forces liberated several fortresses across Narsinghpur, Damoh, and Sagar, inspiring armed resistance across central India long before 1857.</p>",
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
    heroBadge: "Official Community Portal",
    heroTitle: "Akhil Bhartiya Samaj Directory & Central Portal",
    heroSubtitle: "A comprehensive digital network connecting community members, elders, doctors, engineers, advocates, merchants, and youth network across India.",
    heroCtaText: "Explore Member Directory →",
    heroCtaLink: "/directory",
    heroImage: "/asset/alokadhivationposter2026/poster1.jpeg",
    sidebarNoticeTitle: "समाज संदेश एवं सूचनाएं",
    sidebarNoticeContent: "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।",
    sidebarNoticeEnabled: true,
    keyRegions: ["लखनऊ", "भोपाल", "जयपुर", "नई दिल्ली", "ग्वालियर", "इंदौर", "हैदराबाद", "धौलपुर"],
    adTitle: "Community Business Spotlight",
    adBannerText: "Promote your business across community network.",
    adLink: "/contact",
    adEnabled: true,
    contactEmail: "admin@alokworld.in",
    contactPhone: "+91 96085 53167",
    contactAddress: "National Secretariat, New Delhi, India",
    whatsappNumber: "+91 96085 53167",
    seoTitle: "Akhil Bhartiya Samaj Directory & Central Portal | alokworld.in",
    seoDescription: "Official Samaj Community Directory - search and connect with verified community members, elders, doctors, engineers, and professionals across India.",
    seoKeywords: "samaj directory, community directory, alokworld, samaj portal, community members, lodhi samaj, alok sangh",
    siteUrl: "https://alokworld.in",
    ogImage: "/asset/alokadhivationposter2026/poster1.jpeg",
    organizationName: "Akhil Bhartiya Lodha, Lodhi, Lodh Mahasabha",
    googleVerificationId: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
    twitterHandle: "@alokworldin",
    maintenanceMode: true,
    maintenanceBarEnabled: true,
    maintenancePopupEnabled: true,
    maintenanceMessage: "वेबसाइट निर्माणाधीन एवं अद्यतन स्थिति में है — अखिल भारतीय समाज डायरेक्टरी",
    maintenancePopupTitle: "वेबसाइट निर्माणाधीन एवं अद्यतन स्थिति में है",
    maintenancePopupMessage: "Welcome to alokworld.in! We are actively updating features, verified directory records, and community services. Feel free to explore our portal.",
  });
  console.log("Site settings successfully initialized.");

  await mongoose.disconnect();
  console.log("Seeding fully completed!");
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
