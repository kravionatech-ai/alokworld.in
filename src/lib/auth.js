import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";

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
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: [
      "b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br",
      "h2", "h3", "h4", "h5", "h6", "blockquote", "span"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      span: ["class", "style"],
      p: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}
