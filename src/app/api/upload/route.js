import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary";
import { verifyAdminToken } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") || "alokworld_uploads").trim();

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Server-side validation: MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type (${file.type}). Allowed image formats: JPEG, PNG, WebP, GIF.`,
        },
        { status: 400 }
      );
    }

    // Server-side validation: File size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please select a smaller image.`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "") || "alokworld_uploads";
    const result = await uploadImageBuffer(buffer, safeFolder);

    // Audit log
    await recordAudit({
      req,
      admin,
      action: "upload_media",
      targetEntity: "Media",
      targetId: result.public_id,
      details: {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        folder: safeFolder,
        url: result.secure_url,
      },
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image to Cloudinary" },
      { status: 500 }
    );
  }
}
