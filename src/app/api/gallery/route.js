import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GalleryItem from "@/models/GalleryItem";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export async function GET(req) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ items: [] });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const includeAll = searchParams.get("all") === "true";

    const filter = {};

    // Check if requester is admin wanting to see all (including unpublished drafts)
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;

    if (!admin || !includeAll) {
      filter.isPublished = true;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const items = await GalleryItem.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
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

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required for gallery items." }, { status: 400 });
    }
    if (!body.imageUrl || !body.imageUrl.trim()) {
      return NextResponse.json({ error: "Image URL is required for gallery items." }, { status: 400 });
    }

    const itemData = {
      title: body.title.trim(),
      category: (body.category || "Event").trim(),
      imageUrl: body.imageUrl.trim(),
      publicId: (body.publicId || "").trim(),
      description: sanitizeContent(body.description || ""),
      eventDate: (body.eventDate || "").trim(),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
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
        category: created.category,
        isPublished: created.isPublished,
      },
    });

    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
