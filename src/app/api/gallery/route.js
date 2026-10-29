import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GalleryItem from "@/models/GalleryItem";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";

export async function GET(req) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ items: [] });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const mediaType = searchParams.get("type"); // "image" | "video" | "all"
    const featuredOnly = searchParams.get("featured") === "true";
    const includeAll = searchParams.get("all") === "true";

    const filter = {};

    // Check if requester is admin wanting to see all (including unpublished drafts)
    const admin = verifyAdminToken(req);

    if (!admin || !includeAll) {
      filter.isPublished = true;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (mediaType && mediaType !== "all" && (mediaType === "image" || mediaType === "video")) {
      filter.mediaType = mediaType;
    }

    if (featuredOnly) {
      filter.isFeatured = true;
    }

    const items = await GalleryItem.find(filter)
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required for media items." }, { status: 400 });
    }

    const mediaType = body.mediaType === "video" ? "video" : "image";
    let imageUrl = (body.imageUrl || "").trim();
    let videoUrl = (body.videoUrl || "").trim();
    let videoId = "";

    if (mediaType === "video") {
      if (!videoUrl) {
        return NextResponse.json({ error: "YouTube Video URL is required for video items." }, { status: 400 });
      }
      videoId = extractYouTubeId(videoUrl);
      if (!videoId) {
        return NextResponse.json({ error: "Invalid YouTube URL. Please provide a valid YouTube watch or share link." }, { status: 400 });
      }
      // If no custom thumbnail was provided, automatically generate YouTube high-quality thumbnail
      if (!imageUrl) {
        imageUrl = getYouTubeThumbnail(videoId);
      }
    } else {
      if (!imageUrl) {
        return NextResponse.json({ error: "Image URL is required for photo items." }, { status: 400 });
      }
    }

    const itemData = {
      title: body.title.trim(),
      category: (body.category || "Event").trim(),
      mediaType,
      imageUrl,
      videoUrl,
      videoId,
      publicId: (body.publicId || "").trim(),
      description: sanitizeContent(body.description || ""),
      eventDate: (body.eventDate || "").trim(),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : false,
      order: typeof body.order === "number" ? body.order : 0,
    };

    const created = await GalleryItem.create(itemData);

    await recordAudit({
      req,
      admin,
      action: "create_gallery_item",
      targetEntity: "GalleryItem",
      targetId: created._id,
      details: {
        title: created.title,
        mediaType: created.mediaType,
        category: created.category,
        isPublished: created.isPublished,
      },
    });

    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
