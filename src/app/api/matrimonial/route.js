import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Matrimonial from "@/models/Matrimonial";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const gender = searchParams.get("gender");
    const city = searchParams.get("city");

    const conn = await connectDB();
    if (conn) {
      const filter = { isPublished: true, isApproved: true };
      if (gender && gender !== "All") filter.gender = gender;
      if (city && city !== "All") filter.city = { $regex: new RegExp(`^${city}$`, "i") };

      const profiles = await Matrimonial.find(filter).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ profiles });
    }
    return NextResponse.json({ profiles: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    if (body.bio) {
      body.bio = sanitizeContent(body.bio);
    }

    const created = await Matrimonial.create(body);
    return NextResponse.json({ success: true, profile: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
