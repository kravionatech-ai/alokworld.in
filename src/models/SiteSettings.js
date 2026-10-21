import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "अखिल भारतीय समाज डिरेक्टरी - alokworld.in" },
    tagline: { type: String, default: "Community Directory, Leadership & Networking Portal" },
    announcement: { type: String, default: "Welcome to the official Samaj Community Directory portal. Connect, unite & empower." },
    sidebarNoticeTitle: { type: String, default: "समाज संदेश एवं सूचनाएं" },
    sidebarNoticeContent: { type: String, default: "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।" },
    adTitle: { type: String, default: "Community Business Spotlight" },
    adBannerText: { type: String, default: "Promote your business across community network." },
    adLink: { type: String, default: "/contact" },
    contactEmail: { type: String, default: "admin@alokworld.in" },
    contactPhone: { type: String, default: "+91 96085 53167" },
    seoTitle: { type: String, default: "Samaj Community Directory | alokworld.in" },
    seoDescription: { type: String, default: "Official Samaj Directory - search and connect with community members, elders, doctors, engineers, and professionals." },
    seoKeywords: { type: String, default: "samaj directory, community directory, alokworld, samaj portal, community members" },
    
    // Maintenance Mode Configurations
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

    // Multi-page content management
    historyContent: {
      type: String,
      default: "<h3>समाज का गौरवशाली इतिहास</h3><p>समाज का इतिहास त्याग, तपस्या, शौर्य और राष्ट्रभक्ति से परिपूर्ण रहा है। वैदिक काल से लेकर स्वतंत्रता संग्राम तक समाज के वीर सपूतों और समाजसेवियों ने राष्ट्र निर्माण में ऐतिहासिक योगदान दिया है।</p>",
    },
    organizationContent: {
      type: String,
      default: "<h3>संगठन संरचना एवं कार्यसमिति</h3><p>राष्ट्रीय कार्यसमिति, युवा मोर्चा, महिला मोर्चा और राज्य इकाइयों के माध्यम से समाज के कल्याणकारी प्रकल्प संचालित किए जा रहे हैं।</p>",
    },
    mahasabhaContent: {
      type: String,
      default: "<h3>अखिल भारतीय महासभा</h3><p>अखिल भारतीय स्तर पर समाज को संगठित करने, सामाजिक कुरीतियों को दूर करने, और शिक्षा के प्रचार-प्रसार के लिए महासभा निरंतर प्रयत्नशील है।</p>",
    },
    aboutContent: {
      type: String,
      default: "<h3>हमारे बारे में (About Portal)</h3><p>alokworld.in एक आधुनिक डिजिटल मंच है, जिसका उद्देश्य समाज के सभी वर्गों, पेशेवरों और परिवारों को परस्पर जोड़ना है।</p>",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
