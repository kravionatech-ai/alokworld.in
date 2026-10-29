import jwt from "jsonwebtoken";
import { sanitizeRichText } from "./richText.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_alokworld_secure_secret_2026";

export function signAdminToken(admin) {
  return jwt.sign(
    {
      id: admin._id ? admin._id.toString() : admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Extracts admin authentication token from Next.js request:
 * 1. Next.js Request cookies (admin_token)
 * 2. Raw Cookie header
 * 3. Authorization header: "Bearer <token>"
 * 4. Custom header: "x-admin-token"
 */
export function getAdminTokenFromRequest(req) {
  if (!req) return null;

  // 1. NextRequest cookies
  try {
    const cookieVal = req.cookies?.get?.("admin_token")?.value;
    if (cookieVal) return cookieVal;
  } catch {}

  // 2. Raw Cookie header string
  try {
    const rawCookie = req.headers?.get?.("cookie") || "";
    const match = rawCookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  } catch {}

  // 3. Authorization header (Bearer <token>)
  try {
    const auth = req.headers?.get?.("authorization") || req.headers?.get?.("Authorization");
    if (auth && typeof auth === "string" && auth.startsWith("Bearer ")) {
      const extracted = auth.slice(7).trim();
      if (extracted) return extracted;
    }
  } catch {}

  // 4. Custom header
  try {
    const customHeader = req.headers?.get?.("x-admin-token") || req.headers?.get?.("X-Admin-Token");
    if (customHeader) return customHeader.trim();
  } catch {}

  return null;
}

/**
 * Verifies admin token string OR Next.js Request object.
 * Returns decoded admin payload or null if invalid/expired.
 */
export function verifyAdminToken(tokenOrReq) {
  if (!tokenOrReq) return null;
  let token = tokenOrReq;
  if (typeof tokenOrReq === "object") {
    token = getAdminTokenFromRequest(tokenOrReq);
  }
  if (!token || typeof token !== "string") return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Helper to authenticate and retrieve admin session directly from request
 */
export function getAdminFromRequest(req) {
  return verifyAdminToken(req);
}

export function sanitizeContent(html) {
  return sanitizeRichText(html);
}

