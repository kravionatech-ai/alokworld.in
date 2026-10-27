import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export default async function robots() {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in";

  try {
    const conn = await connectDB();
    if (conn) {
      const settings = await SiteSettings.findOne({}, "siteUrl").lean();
      if (settings?.siteUrl) baseUrl = settings.siteUrl;
    }
  } catch (err) {
    // Ignore fallback
  }

  baseUrl = baseUrl.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
