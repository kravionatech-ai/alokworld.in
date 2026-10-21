import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary";
import { verifyAdminToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImageBuffer(buffer, "alokworld_members");

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image to Cloudinary" },
      { status: 500 }
    );
  }
}
