import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "अखिल भारतीय समाज डायरेक्टरी - alokworld.in" },
    tagline: { type: String, default: "समाज डायरेक्टरी, राष्ट्रीय नेतृत्व एवं संगठनात्मक समन्वय मंच" },
    
    // Top Announcement Strip
    announcement: { type: String, default: "अखिल भारतीय समाज डायरेक्टरी पोर्टल पर आपका हार्दिक स्वागत है। संगठित समाज, सशक्त राष्ट्र।" },
    announcementEnabled: { type: Boolean, default: true },

    // Hero Banner Customization
    heroBadge: { type: String, default: "आधिकारिक समुदाय पोर्टल" },
    heroTitle: { type: String, default: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल" },
    heroSubtitle: { type: String, default: "देश भर के समाज बंधुओं, वरिष्ठ मार्गदर्शकों, चिकित्सकों, अभियंताओं, प्रशासनिक अधिकारियों, अधिवक्ताओं एवं युवाओं को जोड़ने वाला डिजिटल मंच।" },
    heroCtaText: { type: String, default: "सदस्य डायरेक्टरी देखें →" },
    heroCtaLink: { type: String, default: "/directory" },
    heroImage: { type: String, default: "" },

    // Sidebar Widgets Configuration
    sidebarNoticeTitle: { type: String, default: "समाज संदेश एवं महत्वपूर्ण सूचनाएं" },
    sidebarNoticeContent: { type: String, default: "समस्त समाज बंधुओं से अनुरोध है कि डायरेक्टरी में अपना एवं अपने परिवार का प्रामाणिक विवरण अद्यतन रखें।" },
    sidebarNoticeEnabled: { type: Boolean, default: true },
    keyRegions: {
      type: [String],
      default: ["भोपाल", "जयपुर", "बेंगलुरु", "लखनऊ", "इंदौर", "दिल्ली एनसीआर", "मुंबई", "जबलपुर"],
    },

    // Community Spotlight / Advertisement
    adTitle: { type: String, default: "समाज व्यापार एवं उद्योग संवर्धन" },
    adBannerText: { type: String, default: "राष्ट्रव्यापी समाज डायरेक्टरी नेटवर्क के माध्यम से अपने व्यवसाय एवं प्रतिष्ठान का प्रचार करें।" },
    adLink: { type: String, default: "/contact" },
    adImage: { type: String, default: "" },
    adEnabled: { type: Boolean, default: true },

    // Contact & Secretariat Information
    contactEmail: { type: String, default: "admin@alokworld.in" },
    contactPhone: { type: String, default: "+91 96085 53167" },
    contactAddress: { type: String, default: "केंद्रीय राष्ट्रीय सचिवालय, नई दिल्ली, भारत" },
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
    seoTitle: { type: String, default: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल | alokworld.in" },
    seoDescription: { type: String, default: "अखिल भारतीय लोधी, लोधा, लोध समाज की आधिकारिक डिजिटल डायरेक्टरी - देश भर के सत्यापित समाज बंधुओं, वरिष्ठ मार्गदर्शकों एवं प्रबुद्ध अधिकारियों से जुड़ें।" },
    seoKeywords: { type: String, default: "समाज डायरेक्टरी, लोधी समाज, लोधा महासभा, alokworld, समाज पोर्टल, अखिल भारतीय लोधी अधिकारी, लोध समाज डायरेक्टरी" },
    siteUrl: { type: String, default: "https://alokworld.in" },
    ogImage: { type: String, default: "/asset/topofwebsite/web_sit_front.png" },
    organizationName: { type: String, default: "अखिल भारतीय लोधी, लोधा, लोध समाज महासभा" },
    googleVerificationId: { type: String, default: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg" },
    twitterHandle: { type: String, default: "@alokworldin" },
    
    // Maintenance Mode Configurations
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

    // Multi-page content fallbacks
    historyContent: {
      type: String,
      default: "<h3>गौरवशाली इतिहास एवं सांस्कृतिक विरासत</h3><p>हमारे समाज का इतिहास त्याग, तपस्या, वीरता और देशभक्ति से परिपूर्ण है। ऐतिहासिक युगों से लेकर राष्ट्रीय स्वतंत्रता आंदोलन तक, समाज के मार्गदर्शकों और जननायकों ने राष्ट्र निर्माण में अप्रतिम योगदान दिया है।</p>",
    },
    organizationContent: {
      type: String,
      default: "<h3>संगठनात्मक संरचना एवं कार्यसमिति</h3><p>समाज कल्याण की समस्त गतिविधियां राष्ट्रीय कार्यसमिति, युवा प्रकोष्ठ, महिला सशक्तिकरण विंग और राज्य शाखाओं के माध्यम से सक्रिय रूप से संचालित की जाती हैं।</p>",
    },
    mahasabhaContent: {
      type: String,
      default: "<h3>अखिल भारतीय महासभा</h3><p>महासभा देश भर में समाज को संगठित करने, सामाजिक विसंगतियों को दूर करने तथा उच्च शिक्षा एवं आर्थिक स्वावलंबन को बढ़ावा देने के लिए सतत प्रयासरत है।</p>",
    },
    aboutContent: {
      type: String,
      default: "<h3>alokworld.in के बारे में</h3><p>alokworld.in देश भर के समाज बंधुओं, प्रबुद्ध अधिकारियों, वरिष्ठ मार्गदर्शकों और परिवारों को जोड़ने के लिए समर्पित एक आधुनिक डिजिटल मंच है।</p>",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
