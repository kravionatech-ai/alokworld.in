import { connectDB } from "@/lib/db";
import AuditLog from "@/models/AuditLog";

export async function recordAudit({ req, admin, action, targetEntity, targetId = "", details = "" }) {
  try {
    const conn = await connectDB();
    if (!conn) return;

    let ip = "";
    if (req) {
      ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "";
    }

    await AuditLog.create({
      adminEmail: admin?.email || "system",
      adminName: admin?.name || "System Admin",
      adminRole: admin?.role || "superadmin",
      action,
      targetEntity,
      targetId: String(targetId || ""),
      details: typeof details === "object" ? JSON.stringify(details) : String(details || ""),
      ip,
    });
  } catch (error) {
    console.warn("Failed to record audit log:", error.message);
  }
}
