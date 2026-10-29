import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Personality from "@/models/Personality";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn) {
      const personalities = await Personality.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean();
      return NextResponse.json(
        { personalities },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" } }
      );
    }
    return NextResponse.json(
      { personalities: [] },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" } }
    );
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

    if (body.biography) {
      body.biography = sanitizeContent(body.biography);
    }

    const created = await Personality.create(body);

    try {
      revalidatePath("/personalities");
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("Revalidation notice:", e.message);
    }

    return NextResponse.json(
      { success: true, personality: created },
      {
        status: 201,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
