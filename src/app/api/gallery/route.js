import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GalleryItem from "@/models/GalleryItem";
import { verifyAdminToken } from "@/lib/auth";

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn) {
      const items = await GalleryItem.find({ isPublished: true }).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ items });
    }
    return NextResponse.json({ items: [] });
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

    const created = await GalleryItem.create(body);
    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
