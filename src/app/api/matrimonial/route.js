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

    if (!body.name || !body.gender || !body.age || !body.profession || !body.city) {
      return NextResponse.json(
        { error: "Name, gender, age, profession, and city are required fields." },
        { status: 400 }
      );
    }

    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const profileData = {
      name: body.name.trim(),
      gender: body.gender,
      age: Number(body.age) || 25,
      height: body.height ? body.height.trim() : "",
      education: body.education ? body.education.trim() : "",
      profession: body.profession.trim(),
      city: body.city.trim(),
      state: body.state ? body.state.trim() : "",
      bio: sanitizeContent(body.bio || ""),
      contactPerson: body.contactPerson ? body.contactPerson.trim() : "",
      contactPhone: body.contactPhone ? body.contactPhone.trim() : "",
      // Public submissions default to pending approval; admins can publish immediately
      isApproved: admin ? Boolean(body.isApproved ?? true) : false,
      isPublished: admin ? Boolean(body.isPublished ?? true) : false,
    };

    const created = await Matrimonial.create(profileData);
    return NextResponse.json(
      {
        success: true,
        message: admin
          ? "Matrimonial profile saved."
          : "Matrimonial registration submitted successfully. It will appear once verified by the community administrator.",
        profile: created,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
