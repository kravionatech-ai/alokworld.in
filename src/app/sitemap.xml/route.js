import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Member from "@/models/Member";
import { membersData as fallbackMembers } from "@/data/members";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in";

  let memberUrls = [];
  try {
    const conn = await connectDB();
    if (conn) {
      const members = await Member.find({ isPublished: true, isApproved: true }, "_id updatedAt").lean();
      memberUrls = members.map((m) => ({
        url: `${baseUrl}/member/${m._id}`,
        lastModified: m.updatedAt ? new Date(m.updatedAt).toISOString() : new Date().toISOString(),
      }));
    } else {
      memberUrls = fallbackMembers.map((m) => ({
        url: `${baseUrl}/member/${m.id}`,
        lastModified: new Date().toISOString(),
      }));
    }
  } catch (e) {
    console.error("Sitemap generation error:", e);
  }

  const staticUrls = [
    { url: `${baseUrl}`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/directory`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/history`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/personalities`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/organization`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/mahasabha`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/matrimonial`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/gallery`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/about`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/contact`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/privacy`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/terms`, lastModified: new Date().toISOString() },
  ];

  const allUrls = [...staticUrls, ...memberUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (item) => `
    <url>
      <loc>${item.url}</loc>
      <lastmod>${item.lastModified}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
