import { NextResponse } from "next/server";
import { uploadImageBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";
import { verifyAdminToken } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

// Allowed predefined folders for organization assets
const ALLOWED_FOLDERS = [
  "alokworld_members",
  "alokworld_hero",
  "alokworld_personalities",
  "alokworld_gallery",
  "alokworld_articles",
  "alokworld_seo",
  "alokworld_posters",
  "alokworld_uploads",
];

export async function POST(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "अनधिकृत पहुंच (Unauthorized access)" }, { status: 401 });
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: "सर्वर पर क्लाउडिनरी स्टोरेज कॉन्फ़िगर नहीं है (Cloudinary storage not configured)" },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const requestedFolder = (formData.get("folder") || "alokworld_uploads").trim();

    if (!file) {
      return NextResponse.json({ error: "कोई छायाचित्र फ़ाइल प्राप्त नहीं हुई (No file provided)" }, { status: 400 });
    }

    // Server-side validation: MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `अमान्य फ़ाइल प्रकार (${file.type})। केवल JPEG, PNG, WebP, GIF छवियां समर्थित हैं।`,
        },
        { status: 400 }
      );
    }

    // Server-side validation: File size (max 10MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `फ़ाइल का आकार 10MB सीमा से अधिक है (${(file.size / (1024 * 1024)).toFixed(2)} MB)। कृपया छोटी फ़ाइल चुनें।`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize folder
    const safeFolder = ALLOWED_FOLDERS.includes(requestedFolder)
      ? requestedFolder
      : requestedFolder.replace(/[^a-zA-Z0-9_-]/g, "") || "alokworld_uploads";

    const result = await uploadImageBuffer(buffer, safeFolder);

    // Audit log without sensitive credentials
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
      width: result.width,
      height: result.height,
      format: result.format,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    // Log diagnostic error on server without leaking secrets
    console.error("API /api/upload error:", error.message);
    return NextResponse.json(
      { error: "छायाचित्र अपलोड करने में विफल। कृपया मान्य छवि प्रारूप का उपयोग करें।" },
      { status: 500 }
    );
  }
}
