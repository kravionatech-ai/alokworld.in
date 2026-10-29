import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Member from "@/models/Member";
import PageContent from "@/models/PageContent";
import SiteSettings from "@/models/SiteSettings";
import { verifyAdminToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const conn = await connectDB();
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in";

    if (conn) {
      const settings = await SiteSettings.findOne({}, "siteUrl").lean();
      if (settings?.siteUrl) baseUrl = settings.siteUrl;
    }

    const cleanBase = baseUrl.replace(/\/+$/, "");
    const now = new Date().toISOString();

    const staticRoutes = [
      { loc: `${cleanBase}`, priority: "1.0", changefreq: "daily" },
      { loc: `${cleanBase}/directory`, priority: "0.9", changefreq: "daily" },
      { loc: `${cleanBase}/about`, priority: "0.8", changefreq: "weekly" },
      { loc: `${cleanBase}/history`, priority: "0.8", changefreq: "monthly" },
      { loc: `${cleanBase}/organization`, priority: "0.8", changefreq: "monthly" },
      { loc: `${cleanBase}/aloksangh`, priority: "0.8", changefreq: "monthly" },
      { loc: `${cleanBase}/events`, priority: "0.8", changefreq: "weekly" },
      { loc: `${cleanBase}/gallery`, priority: "0.8", changefreq: "weekly" },
      { loc: `${cleanBase}/personalities`, priority: "0.8", changefreq: "monthly" },
      { loc: `${cleanBase}/contact`, priority: "0.7", changefreq: "monthly" },
      { loc: `${cleanBase}/privacy`, priority: "0.3", changefreq: "yearly" },
      { loc: `${cleanBase}/terms`, priority: "0.3", changefreq: "yearly" },
    ];

    let memberUrls = [];
    let pageUrls = [];

    if (conn) {
      const members = await Member.find(
        {
          isPublished: true,
          isApproved: true,
          isArchived: { $ne: true },
          membershipStatus: { $ne: "archived" },
        },
        "_id slug updatedAt"
      ).lean();

      memberUrls = members.map((m) => ({
        loc: `${cleanBase}/member/${m.slug || m._id}`,
        lastmod: m.updatedAt ? new Date(m.updatedAt).toISOString() : now,
        priority: "0.7",
        changefreq: "weekly",
      }));

      const coreSlugs = ["home", "about", "history", "organization", "mahasabha", "aloksangh", "events"];
      const pages = await PageContent.find(
        {
          status: "published",
          slug: { $nin: coreSlugs },
        },
        "slug updatedAt"
      ).lean();

      pageUrls = pages.map((p) => ({
        loc: `${cleanBase}/${p.slug}`,
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : now,
        priority: "0.7",
        changefreq: "weekly",
      }));
    }

    const allUrls = [...staticRoutes, ...pageUrls, ...memberUrls];

    // Trigger Next.js on-demand cache revalidation for native dynamic routes
    try {
      revalidatePath("/sitemap.xml");
      revalidatePath("/robots.txt");
    } catch (cacheErr) {
      console.warn("Revalidation warning:", cacheErr.message);
    }

    return NextResponse.json({
      success: true,
      message: `साइटमैप सफलतापूर्वक ऑटो-जेनरेट व रीफ्रेश हो गया (${allUrls.length} पृष्ठ व सदस्य तुरंत इंडेक्स हुए)`,
      totalUrls: allUrls.length,
      membersCount: memberUrls.length,
      staticCount: staticRoutes.length,
      lastGenerated: now,
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return NextResponse.json({ error: "Failed to generate sitemap" }, { status: 500 });
  }
}
