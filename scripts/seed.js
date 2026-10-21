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
    isApproved: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: true },
    showAddress: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// SiteSettings Schema
const SiteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "अखिल भारतीय समाज डिरेक्टरी - alokworld.in" },
    tagline: { type: String, default: "Community Directory, Leadership & Networking Portal" },
    announcement: { type: String, default: "Welcome to the official Samaj Community Directory portal. Connect and unite." },
    sidebarNoticeTitle: { type: String, default: "समाज संदेश एवं सूचनाएं" },
    sidebarNoticeContent: { type: String, default: "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।" },
    adTitle: { type: String, default: "Community Business Spotlight" },
    adBannerText: { type: String, default: "Promote your business across community network." },
    adLink: { type: String, default: "https://alokworld.in" },
    contactEmail: { type: String, default: "admin@alokworld.in" },
    contactPhone: { type: String, default: "+91 96085 53167" },
    seoTitle: { type: String, default: "Samaj Community Directory | alokworld.in" },
    seoDescription: { type: String, default: "Official Samaj Directory - search and connect with community members, elders, doctors, engineers, and professionals." },
    seoKeywords: { type: String, default: "samaj directory, community directory, alokworld, samaj portal, community members" },
    maintenanceMode: { type: Boolean, default: true },
    maintenanceBarEnabled: { type: Boolean, default: true },
    maintenancePopupEnabled: { type: Boolean, default: true },
    maintenanceMessage: {
      type: String,
      default: "Website Under Maintenance — We are improving your experience. Some features may not work as expected.",
    },
    maintenancePopupTitle: {
      type: String,
      default: "Website Under Active Development",
    },
    maintenancePopupMessage: {
      type: String,
      default: "Welcome to alokworld.in! We are actively updating features, verified directory records, and community services. Feel free to explore.",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

const seedMembers = [
  {
    name: "Rajesh Kumar Lodhi",
    role: "Community Elder",
    occupation: "Civil Engineer & Contractor",
    company: "Lodhi Infra Builders",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address: "Plot 42, Arera Colony",
    pincode: "462016",
    phone: "+91 98260 12345",
    email: "rajesh.lodhi@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    biography: "<p>Serving as an elder and senior structural engineer with over 28 years in infrastructure design. Dedicated to community skill building, scholarships for youth, and cultural preservation.</p>",
    tags: ["Construction", "Social Worker", "Elder"],
    isApproved: true,
    isPublished: true,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  },
  {
    name: "Dr. Sunita Lodha",
    role: "Core Member",
    occupation: "Senior Pediatrician",
    company: "City Child Healthcare",
    city: "Jaipur",
    state: "Rajasthan",
    address: "12, Malviya Nagar",
    pincode: "302017",
    phone: "+91 94140 67890",
    email: "dr.sunita@example.com",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
    biography: "<p>MD in Pediatrics from SMS Medical College. Conducting free quarterly health checkup camps across rural community belts and mentoring aspiring medical students.</p>",
    tags: ["Healthcare", "Mentor", "Child Specialist"],
    isApproved: true,
    isPublished: true,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  },
  {
    name: "Amit Verma Lodhi",
    role: "Youth Wing Lead",
    occupation: "Software Architect",
    company: "TechNova Solutions",
    city: "Bengaluru",
    state: "Karnataka",
    address: "HSR Layout Sector 2",
    pincode: "560102",
    phone: "+91 98450 11223",
    email: "amit.vlodhi@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    biography: "<p>Cloud Architect & Tech lead in Bengaluru. Organizes youth hackathons, digital literacy drives, and career guidance workshops for young graduates.</p>",
    tags: ["IT & Software", "Youth Network", "Tech"],
    isApproved: true,
    isPublished: true,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  },
  {
    name: "Pooja Lodh",
    role: "Member",
    occupation: "High School Principal & Educator",
    company: "Adarsh Vidyalaya",
    city: "Lucknow",
    state: "Uttar Pradesh",
    address: "Sector B, Aliganj",
    pincode: "226024",
    phone: "+91 91250 44556",
    email: "pooja.lodh@example.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    biography: "<p>Passionate educator with 18 years in secondary education leadership. Focuses on girl child education, sports facilities, and merit awards.</p>",
    tags: ["Education", "Women Empowerment"],
    isApproved: true,
    isPublished: true,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  },
  {
    name: "Vikram Lodhi",
    role: "Business Coordinator",
    occupation: "Agri-Business & Organic Farming",
    company: "Kisan Agro Foods",
    city: "Indore",
    state: "Madhya Pradesh",
    address: "AB Road, Industrial Area",
    pincode: "452001",
    phone: "+91 97520 88990",
    email: "vikram.lodhi@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    biography: "<p>Pioneering modern cold storage and fair pricing networks for community farmers across Malwa region. Active member of trade committee.</p>",
    tags: ["Agriculture", "Exports", "Business"],
    isApproved: true,
    isPublished: true,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  },
  {
    name: "Advocate Manish Lodha",
    role: "Legal Advisor",
    occupation: "Advocate (High Court)",
    company: "Lodha & Associates Legal",
    city: "Delhi NCR",
    state: "Delhi",
    address: "Chamber 214, High Court Complex",
    pincode: "110003",
    phone: "+91 98110 33445",
    email: "advocate.manish@example.com",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    biography: "<p>Practicing corporate and constitutional law in Delhi. Providing free legal counsel and arbitration services for community members in need.</p>",
    tags: ["Legal", "Community Aid", "Advocate"],
    isApproved: true,
    isPublished: true,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  },
  {
    name: "Neha Lodh",
    role: "Member",
    occupation: "Chartered Accountant (CA)",
    company: "N. Lodh & Co. Auditing",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Bandra Kurla Complex",
    pincode: "400051",
    phone: "+91 98200 99887",
    email: "neha.ca@example.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    biography: "<p>Senior auditor specializing in taxation, startup financing, and charitable trust advisory. Mentoring female entrepreneurs.</p>",
    tags: ["Finance", "Taxation", "CA"],
    isApproved: true,
    isPublished: true,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  },
  {
    name: "Dinesh Chandra Lodhi",
    role: "Regional Secretary",
    occupation: "Retail & Wholesale Merchant",
    company: "Shree Krishna Traders",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    address: "Ganjipura Market",
    pincode: "482002",
    phone: "+91 96170 55667",
    email: "dinesh.jbp@example.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    biography: "<p>Serving as regional coordinator organizing matrimonial meets, elder recognition programs, and student felicitation ceremonies in Mahakoshal area.</p>",
    tags: ["Trade", "Community Welfare", "Secretary"],
    isApproved: true,
    isPublished: true,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  }
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

  // 2. Seed Members
  await Member.deleteMany({});
  const inserted = await Member.insertMany(seedMembers);
  console.log(`Seeded ${inserted.length} community directory members into MongoDB.`);

  // 3. Seed Default Site Settings
  const settingsCount = await SiteSettings.countDocuments();
  if (settingsCount === 0) {
    await SiteSettings.create({
      siteName: "अखिल भारतीय समाज डिरेक्टरी - alokworld.in",
      tagline: "Community Directory, Leadership & Networking Portal",
      announcement: "Welcome to the official Samaj Community Directory portal. Connect and unite.",
      sidebarNoticeTitle: "समाज संदेश एवं सूचनाएं",
      sidebarNoticeContent: "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।",
      adTitle: "Community Business Spotlight",
      adBannerText: "Promote your business across community network.",
      adLink: "https://alokworld.in",
      contactEmail: "admin@alokworld.in",
      contactPhone: "+91 96085 53167",
      seoTitle: "Samaj Community Directory | alokworld.in",
      seoDescription: "Official Samaj Directory - search and connect with community members, elders, doctors, engineers, and professionals.",
      seoKeywords: "samaj directory, community directory, alokworld, samaj portal, community members",
      maintenanceMode: true,
      maintenanceBarEnabled: true,
      maintenancePopupEnabled: true,
      maintenanceMessage: "Website Under Maintenance — We are improving your experience. Some features may not work as expected.",
      maintenancePopupTitle: "Website Under Active Development",
      maintenancePopupMessage: "Welcome to alokworld.in! We are actively updating features, verified directory records, and community services. Feel free to explore.",
    });
    console.log("Default site settings initialized.");
  }

  await mongoose.disconnect();
  console.log("Seeding completed successfully.");
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
