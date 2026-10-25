import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Member from "@/models/Member";
import PageContent from "@/models/PageContent";
import SiteSettings from "@/models/SiteSettings";
import { membersData as fallbackMembers } from "@/data/members";

export async function GET() {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in";

  const staticRoutes = [
    { path: "", changefreq: "daily", priority: "1.0" },
    { path: "/directory", changefreq: "daily", priority: "0.9" },
    { path: "/about", changefreq: "weekly", priority: "0.8" },
    { path: "/history", changefreq: "monthly", priority: "0.8" },
    { path: "/organization", changefreq: "monthly", priority: "0.8" },
    { path: "/mahasabha", changefreq: "monthly", priority: "0.8" },
    { path: "/gallery", changefreq: "weekly", priority: "0.8" },
    { path: "/personalities", changefreq: "monthly", priority: "0.8" },
    { path: "/contact", changefreq: "monthly", priority: "0.7" },
    { path: "/privacy", changefreq: "yearly", priority: "0.3" },
    { path: "/terms", changefreq: "yearly", priority: "0.3" },
  ];

  let memberEntries = [];
  let dynamicPageEntries = [];

  try {
    const conn = await connectDB();
    if (conn) {
      // 1. Resolve siteUrl
      const settings = await SiteSettings.findOne({}, "siteUrl").lean();
      if (settings?.siteUrl) baseUrl = settings.siteUrl;

      // 2. Query strictly published, approved, non-archived members
      const members = await Member.find(
        {
          isPublished: true,
          isApproved: true,
          isArchived: { $ne: true },
          membershipStatus: { $ne: "archived" },
        },
        "_id slug updatedAt"
      ).lean();

      memberEntries = members.map((m) => ({
        url: `${baseUrl.replace(/\/+$/, "")}/member/${m.slug || m._id}`,
        lastModified: m.updatedAt ? new Date(m.updatedAt).toISOString() : new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.7",
      }));

      // 3. Query custom published CMS pages
      const coreSlugs = ["home", "about", "history", "organization", "mahasabha"];
      const customPages = await PageContent.find(
        {
          status: "published",
          slug: { $nin: coreSlugs },
        },
        "slug updatedAt"
      ).lean();

      dynamicPageEntries = customPages.map((p) => ({
        url: `${baseUrl.replace(/\/+$/, "")}/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.7",
      }));
    } else {
      // Fallback in-memory members
      memberEntries = fallbackMembers.map((m) => ({
        url: `${baseUrl.replace(/\/+$/, "")}/member/${m.slug || m.id}`,
        lastModified: new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.7",
      }));
    }
  } catch (error) {
    console.error("Sitemap XML generation error:", error.message);
  }

  const cleanBase = baseUrl.replace(/\/+$/, "");
  const nowIso = new Date().toISOString();

  const staticEntries = staticRoutes.map((r) => ({
    url: `${cleanBase}${r.path}`,
    lastModified: nowIso,
    changefreq: r.changefreq,
    priority: r.priority,
  }));

  const allEntries = [...staticEntries, ...dynamicPageEntries, ...memberEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastModified}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=1800",
    },
  });
}
