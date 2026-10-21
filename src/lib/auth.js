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

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function sanitizeContent(html) {
  return sanitizeRichText(html);
}

