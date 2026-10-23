import { NextResponse } from "next/server";
import { retryFailedEmail } from "@/lib/email";
import { verifyAdminToken } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export async function POST(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { logId } = await req.json();
    if (!logId) {
      return NextResponse.json({ error: "logId is required" }, { status: 400 });
    }

    const result = await retryFailedEmail(logId);

    if (result.success) {
      await recordAudit({
        req,
        admin,
        action: "retry_email",
        targetEntity: "EmailLog",
        targetId: logId,
        details: `Administrator retried email send. New provider ID: ${result.messageId}`,
      });
      return NextResponse.json({ success: true, messageId: result.messageId });
    }

    return NextResponse.json({ error: result.error || "Retry failed" }, { status: 400 });
  } catch (err) {
    console.error("POST /api/admin/emails/retry error:", err.message);
    return NextResponse.json({ error: "Failed to retry email dispatch" }, { status: 500 });
  }
}
