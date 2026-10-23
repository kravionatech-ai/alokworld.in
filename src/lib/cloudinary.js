import "server-only";
import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary securely on the server.
 * Supports either:
 *  1. CLOUDINARY_URL (e.g. cloudinary://key:secret@cloud_name)
 *  2. Individual credentials: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * Credentials are never exposed to the client or returned in API responses.
 */
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
} else if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Check whether server-side Cloudinary credentials are configured.
 * @returns {boolean}
 */
export function isCloudinaryConfigured() {
  if (process.env.CLOUDINARY_URL) return true;
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Upload a binary image buffer to Cloudinary using secure server-side upload stream.
 *
 * @param {Buffer} buffer - Binary file buffer
 * @param {string} [folder="alokworld_uploads"] - Cloudinary destination folder
 * @param {object} [extraOptions={}] - Optional Cloudinary upload options (tags, transformations)
 * @returns {Promise<{secure_url: string, public_id: string, format: string, bytes: number, width: number, height: number}>}
 */
export async function uploadImageBuffer(buffer, folder = "alokworld_uploads", extraOptions = {}) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary storage is not configured in server environment variables.");
  }

  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("Invalid or empty image buffer provided for upload.");
  }

  const safeFolder = (folder || "alokworld_uploads").replace(/[^a-zA-Z0-9_\-\/]/g, "");

  const uploadOptions = {
    folder: safeFolder,
    resource_type: "image",
    ...extraOptions,
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          // Log safe diagnostic server-side only without leaking credentials
          console.error("Cloudinary upload stream error:", error.http_code || error.message);
          reject(new Error("Failed to upload image to Cloudinary storage."));
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Remove an image asset from Cloudinary storage by its public_id.
 *
 * @param {string} publicId - Cloudinary asset public ID
 * @returns {Promise<object>}
 */
export async function deleteImage(publicId) {
  if (!isCloudinaryConfigured() || !publicId) {
    return { skipped: true };
  }
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Cloudinary asset deletion error:", err.message);
    return { skipped: true, error: "Failed to remove image asset" };
  }
}
