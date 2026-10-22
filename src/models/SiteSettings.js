import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Akhil Bhartiya Samaj Directory - alokworld.in" },
    tagline: { type: String, default: "Community Directory, Leadership & Networking Portal" },
    
    // Top Announcement Strip
    announcement: { type: String, default: "Welcome to the official Samaj Community Directory portal. Connect, unite & empower." },
    announcementEnabled: { type: Boolean, default: true },

    // Hero Banner Customization
    heroBadge: { type: String, default: "Official Community Portal" },
    heroTitle: { type: String, default: "Akhil Bhartiya Samaj Directory & Central Portal" },
    heroSubtitle: { type: String, default: "A comprehensive digital network connecting community members, elders, doctors, engineers, advocates, merchants, and youth network across India." },
    heroCtaText: { type: String, default: "Explore Member Directory →" },
    heroCtaLink: { type: String, default: "/directory" },
    heroImage: { type: String, default: "" },

    // Sidebar Widgets Configuration
    sidebarNoticeTitle: { type: String, default: "Community Announcements & Notices" },
    sidebarNoticeContent: { type: String, default: "All community members are requested to keep their family and professional information up to date in the directory." },
    sidebarNoticeEnabled: { type: Boolean, default: true },
    keyRegions: {
      type: [String],
      default: ["Bhopal", "Jaipur", "Bengaluru", "Lucknow", "Indore", "Delhi NCR", "Mumbai", "Jabalpur"],
    },

    // Community Spotlight / Advertisement
    adTitle: { type: String, default: "Community Business Spotlight" },
    adBannerText: { type: String, default: "Promote your enterprise across our national community network." },
    adLink: { type: String, default: "/contact" },
    adImage: { type: String, default: "" },
    adEnabled: { type: Boolean, default: true },

    // Contact & Secretariat Information
    contactEmail: { type: String, default: "admin@alokworld.in" },
    contactPhone: { type: String, default: "+91 96085 53167" },
    contactAddress: { type: String, default: "National Secretariat, New Delhi, India" },
    whatsappNumber: { type: String, default: "+91 96085 53167" },

    // Navigation Menu Management
    navigationLinks: [
      {
        label: { type: String, required: true },
        href: { type: String, required: true },
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],

    // Global SEO Directives
    seoTitle: { type: String, default: "Akhil Bhartiya Samaj Directory & Central Portal | alokworld.in" },
    seoDescription: { type: String, default: "Official Samaj Community Directory - search and connect with verified community members, elders, doctors, engineers, and professionals across India." },
    seoKeywords: { type: String, default: "samaj directory, community directory, alokworld, samaj portal, community members, lodhi samaj, lodha mahasabha" },
    siteUrl: { type: String, default: "https://alokworld.in" },
    ogImage: { type: String, default: "/asset/topofwebsite/web_sit_front.png" },
    organizationName: { type: String, default: "Akhil Bhartiya Lodha, Lodhi, Lodh Mahasabha" },
    googleVerificationId: { type: String, default: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg" },
    twitterHandle: { type: String, default: "@alokworldin" },
    
    // Maintenance Mode Configurations
    maintenanceMode: { type: Boolean, default: true },
    maintenanceBarEnabled: { type: Boolean, default: true },
    maintenancePopupEnabled: { type: Boolean, default: true },
    maintenanceMessage: {
      type: String,
      default: "Maintenance Notice: Our website is currently under development. We are improving your experience, and some features may not work as expected.",
    },
    maintenancePopupTitle: {
      type: String,
      default: "Website Under Active Development",
    },
    maintenancePopupMessage: {
      type: String,
      default: "Welcome to alokworld.in! We are actively updating features, verified directory records, and community services. Feel free to explore our portal.",
    },

    // Multi-page content fallbacks
    historyContent: {
      type: String,
      default: "<h3>Glorious Heritage & History</h3><p>The history of our community is rich with sacrifice, dedication, valor, and patriotism. From historical eras to the national independence movement, community visionaries and social leaders have contributed immensely to nation-building.</p>",
    },
    organizationContent: {
      type: String,
      default: "<h3>Organizational Structure & Executive Committee</h3><p>Community welfare initiatives are actively carried out through the National Working Committee, Youth Network, Women Empowerment Wing, and State Chapters.</p>",
    },
    mahasabhaContent: {
      type: String,
      default: "<h3>Akhil Bhartiya Mahasabha</h3><p>The Mahasabha continuously strives to unite the community across the nation, eliminate social challenges, and promote higher education and economic self-reliance.</p>",
    },
    aboutContent: {
      type: String,
      default: "<h3>About alokworld.in</h3><p>alokworld.in is a modern digital platform dedicated to connecting community members, professionals, elders, and families across India.</p>",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
