import { connectDB } from "@/lib/db";
import Member from "@/models/Member";
import PageContent from "@/models/PageContent";
import SiteSettings from "@/models/SiteSettings";
import Personality from "@/models/Personality";
import { membersData as fallbackMembers } from "@/data/members";

/**
 * Next.js App Router Native Auto-Generating Sitemap
 * Automatically queries all published pages, verified member profiles, and dynamic content.
 * Generates standards-compliant XML at /sitemap.xml for Google, Bing, and search engines.
 */
export default async function sitemap() {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in";

  // Core static routes with editorial priority
  const staticRoutes = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/directory", changeFrequency: "daily", priority: 0.9 },
    { path: "/about", changeFrequency: "weekly", priority: 0.8 },
    { path: "/history", changeFrequency: "monthly", priority: 0.8 },
    { path: "/organization", changeFrequency: "monthly", priority: 0.8 },
    { path: "/aloksangh", changeFrequency: "monthly", priority: 0.8 },
    { path: "/events", changeFrequency: "weekly", priority: 0.8 },
    { path: "/gallery", changeFrequency: "weekly", priority: 0.8 },
    { path: "/personalities", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  let memberEntries = [];
  let dynamicPageEntries = [];
  let personalityEntries = [];

  try {
    const conn = await connectDB();
    if (conn) {
      // 1. Fetch siteUrl from SiteSettings
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
        "_id slug updatedAt photo avatar"
      ).lean();

      memberEntries = members.map((m) => {
        const image = m.avatar || m.photo;
        return {
          url: `${baseUrl.replace(/\/+$/, "")}/member/${m.slug || m._id}`,
          lastModified: m.updatedAt ? new Date(m.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
          ...(image && image.startsWith("http") ? { images: [image] } : {}),
        };
      });

      // 3. Query custom published CMS pages
      const coreSlugs = ["home", "about", "history", "organization", "mahasabha", "aloksangh", "events"];
      const customPages = await PageContent.find(
        {
          status: "published",
          slug: { $nin: coreSlugs },
        },
        "slug updatedAt"
      ).lean();

      dynamicPageEntries = customPages.map((p) => ({
        url: `${baseUrl.replace(/\/+$/, "")}/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

      // 4. Query personalities
      const personalities = await Personality.find({}, "_id slug updatedAt").lean();
      personalityEntries = personalities.map((pers) => ({
        url: `${baseUrl.replace(/\/+$/, "")}/personalities`,
        lastModified: pers.updatedAt ? new Date(pers.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }));
    } else {
      // Fallback members from data
      memberEntries = fallbackMembers.map((m) => ({
        url: `${baseUrl.replace(/\/+$/, "")}/member/${m.slug || m.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("[Sitemap Auto-Generator] Error fetching dynamic entries:", error.message);
  }

  const cleanBase = baseUrl.replace(/\/+$/, "");
  const now = new Date();

  const staticEntries = staticRoutes.map((r) => ({
    url: `${cleanBase}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Unique entries by URL
  const seenUrls = new Set();
  const allEntries = [...staticEntries, ...dynamicPageEntries, ...personalityEntries, ...memberEntries].filter((item) => {
    if (seenUrls.has(item.url)) return false;
    seenUrls.add(item.url);
    return true;
  });

  return allEntries;
}
