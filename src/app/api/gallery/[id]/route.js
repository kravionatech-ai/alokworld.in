import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GalleryItem from "@/models/GalleryItem";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { deleteImage } from "@/lib/cloudinary";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const item = await GalleryItem.findById(id).lean();
    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const item = await GalleryItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    if (body.title !== undefined) item.title = body.title.trim();
    if (body.category !== undefined) item.category = body.category.trim();
    if (body.mediaType !== undefined) item.mediaType = body.mediaType === "video" ? "video" : "image";
    if (body.videoUrl !== undefined) {
      item.videoUrl = body.videoUrl.trim();
      item.videoId = extractYouTubeId(item.videoUrl);
      if (!body.imageUrl && item.videoId) {
        item.imageUrl = getYouTubeThumbnail(item.videoId);
      }
    }
    if (body.imageUrl !== undefined && body.imageUrl.trim()) item.imageUrl = body.imageUrl.trim();
    if (body.publicId !== undefined) item.publicId = body.publicId.trim();
    if (body.eventDate !== undefined) item.eventDate = body.eventDate.trim();
    if (body.description !== undefined) item.description = sanitizeContent(body.description);
    if (body.isPublished !== undefined) item.isPublished = Boolean(body.isPublished);
    if (body.isFeatured !== undefined) item.isFeatured = Boolean(body.isFeatured);
    if (body.order !== undefined) item.order = Number(body.order) || 0;

    await item.save();

    await recordAudit({
      req,
      admin,
      action: "update_gallery_item",
      targetEntity: "GalleryItem",
      targetId: item._id,
      details: {
        title: item.title,
        category: item.category,
        isPublished: item.isPublished,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const item = await GalleryItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    // Try deleting from Cloudinary if publicId exists
    if (item.publicId) {
      try {
        await deleteImage(item.publicId);
      } catch (err) {
        console.warn("Could not delete image from Cloudinary:", err.message);
      }
    }

    await GalleryItem.findByIdAndDelete(id);

    await recordAudit({
      req,
      admin,
      action: "delete_gallery_item",
      targetEntity: "GalleryItem",
      targetId: id,
      details: {
        title: item.title,
        category: item.category,
      },
    });

    return NextResponse.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
