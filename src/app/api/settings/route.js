import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { verifyAdminToken } from "@/lib/auth";

const defaultSettings = {
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

  // Maintenance Mode defaults
  maintenanceMode: true,
  maintenanceBarEnabled: true,
  maintenancePopupEnabled: true,
  maintenanceMessage: "Website Under Maintenance — We are improving your experience. Some features may not work as expected.",
  maintenancePopupTitle: "Website Under Active Development",
  maintenancePopupMessage: "Welcome to alokworld.in! We are actively updating features, verified directory records, and community services. Feel free to explore.",
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

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
