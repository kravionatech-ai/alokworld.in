import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { verifyAdminToken } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const defaultSettings = {
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
  contactPhone: "+91 96085 53167",
  contactAddress: "केंद्रीय राष्ट्रीय सचिवालय, नई दिल्ली, भारत",
  whatsappNumber: "+91 96085 53167",
  seoTitle: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल | alokworld.in",
  seoDescription: "अखिल भारतीय लोधी, लोधा, लोध समाज की आधिकारिक डिजिटल डायरेक्टरी - देश भर के सत्यापित समाज बंधुओं, वरिष्ठ मार्गदर्शकों एवं प्रबुद्ध अधिकारियों से जुड़ें।",
  seoKeywords: "समाज डायरेक्टरी, लोधी समाज, लोधा महासभा, alokworld, समाज पोर्टल, अखिल भारतीय लोधी अधिकारी, लोध समाज डायरेक्टरी",
  siteUrl: "https://alokworld.in",
  ogImage: "/asset/alokadhivationposter2026/poster1.jpeg",
  organizationName: "अखिल भारतीय लोधी, लोधा, लोध समाज महासभा",
  googleVerificationId: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
  twitterHandle: "@alokworldin",

  // Maintenance Mode defaults - Live Production Mode
  maintenanceMode: false,
  maintenanceBarEnabled: false,
  maintenancePopupEnabled: false,
  maintenanceMessage: "पोर्टल लाइव एवं सक्रिय है।",
  maintenancePopupTitle: "अखिल भारतीय समाज डायरेक्टरी",
  maintenancePopupMessage: "alokworld.in पर आपका स्वागत है!",
};

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn) {
      let settings = await SiteSettings.findOne().lean();
      if (!settings) {
        settings = await SiteSettings.create(defaultSettings);
      }
      return NextResponse.json({ settings: { ...defaultSettings, ...settings } });
    }
    return NextResponse.json({ settings: defaultSettings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ settings: defaultSettings });
  }
}

export async function PUT(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ ...defaultSettings, ...body });
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    await recordAudit({
      req,
      admin,
      action: "update_site_settings",
      targetEntity: "SiteSettings",
      targetId: settings._id,
      details: `Updated fields: ${Object.keys(body).join(", ")}`,
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
