import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in";
  try {
    const conn = await connectDB();
    if (conn) {
      const settings = await SiteSettings.findOne({}, "siteUrl").lean();
      if (settings?.siteUrl) baseUrl = settings.siteUrl;
    }
  } catch (err) {
    // Graceful fallback to default baseUrl
  }

  baseUrl = baseUrl.replace(/\/+$/, "");

  const content = `# Production robots.txt for alokworld.in
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}
