import { connectDB } from "@/lib/db";
import PageContent from "@/models/PageContent";

export async function getPageContent(slug) {
  try {
    const conn = await connectDB();
    if (!conn) return null;

    const page = await PageContent.findOne({
      slug: slug.toLowerCase().trim(),
      status: "published",
    }).lean();

    return page || null;
  } catch (error) {
    console.warn(`Could not load CMS content for page '${slug}':`, error.message);
    return null;
  }
}
