import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { verifyAdminToken } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const defaultSettings = {
  siteName: "Akhil Bhartiya Samaj Directory - alokworld.in",
  tagline: "Community Directory, Leadership & Networking Portal",
  announcement: "Welcome to the official Samaj Community Directory portal. Connect, unite & empower.",
  announcementEnabled: true,
  heroBadge: "Official Community Portal",
  heroTitle: "Akhil Bhartiya Samaj Directory & Central Portal",
  heroSubtitle: "A comprehensive digital network connecting community members, elders, doctors, engineers, advocates, merchants, and youth network across India.",
  heroCtaText: "Explore Member Directory →",
  heroCtaLink: "/directory",
  heroImage: "",
  sidebarNoticeTitle: "Community Announcements & Notices",
  sidebarNoticeContent: "All community members are requested to keep their family and professional information up to date in the directory.",
  sidebarNoticeEnabled: true,
  adTitle: "Community Business Spotlight",
  adBannerText: "Promote your enterprise across our national community network.",
  adLink: "/contact",
  adEnabled: true,
  contactEmail: "admin@alokworld.in",
  contactPhone: "+91 96085 53167",
  contactAddress: "National Secretariat, New Delhi, India",
  whatsappNumber: "+91 96085 53167",
  seoTitle: "Akhil Bhartiya Samaj Directory & Central Portal | alokworld.in",
  seoDescription: "Official Samaj Community Directory - search and connect with verified community members, elders, doctors, engineers, and professionals across India.",
  seoKeywords: "samaj directory, community directory, alokworld, samaj portal, community members, lodhi samaj, lodha mahasabha",
  siteUrl: "https://alokworld.in",
  ogImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80",
  organizationName: "Akhil Bhartiya Lodha, Lodhi, Lodh Mahasabha",
  googleVerificationId: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
  twitterHandle: "@alokworldin",

  // Maintenance Mode defaults
  maintenanceMode: true,
  maintenanceBarEnabled: true,
  maintenancePopupEnabled: true,
  maintenanceMessage:
    "Maintenance Notice: Our website is currently under development. We are improving your experience, and some features may not work as expected.",
  maintenancePopupTitle: "Website Under Active Development",
  maintenancePopupMessage:
    "Welcome to alokworld.in! We are actively updating features, verified directory records, and community services. Feel free to explore our portal.",
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
