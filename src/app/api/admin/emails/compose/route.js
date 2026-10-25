import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/email";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export async function POST(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { recipientEmail, subject, message, templateName = "general" } = await req.json();

    if (!recipientEmail || !subject || !message) {
      return NextResponse.json(
        { error: "recipientEmail, subject and message are required" },
        { status: 400 }
      );
    }

    const cleanRecipient = recipientEmail.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const sanitizedBody = sanitizeContent(message);

    await connectDB();

    const formattedHtml = `
      <div style="font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #102F6B; max-width: 600px; margin: 0 auto; border: 1px solid #E9E2D8; border-radius: 8px; overflow: hidden; background-color: #FFFFFF;">
        <div style="background-color: #091D42; padding: 18px 24px; text-align: center; border-bottom: 3px solid #F26A21;">
          <h2 style="color: #FFFFFF; margin: 0; font-size: 19px; font-weight: 800;">अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ</h2>
          <p style="color: #CBD5E1; margin: 4px 0 0; font-size: 12px;">अखिल भारतीय लोधी समाज निर्देशिका — alokworld.in</p>
        </div>
        <div style="padding: 24px 28px; background-color: #FFFFFF;">
          <h3 style="color: #102F6B; margin-top: 0; font-size: 16px; border-bottom: 1px solid #F0E5D5; padding-bottom: 8px;">${cleanSubject}</h3>
          <div style="color: #263449; font-size: 13.5px; line-height: 1.75; white-space: pre-wrap; margin: 16px 0;">${sanitizedBody}</div>
          <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #E9E2D8; font-size: 12px; color: #64748B; background-color: #FFFCF5; padding: 12px 16px; border-radius: 6px;">
            <strong style="color: #102F6B;">केंद्रीय सचिवालय (Central Secretariat)</strong><br />
            अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)<br />
            वेबसाइट: <a href="https://alokworld.in" style="color: #F26A21; text-decoration: none; font-weight: bold;">alokworld.in</a> | संपर्क: contact@alokworld.in
          </div>
        </div>
      </div>
    `;

    const dispatchResult = await sendTransactionalEmail({
      to: cleanRecipient,
      subject: cleanSubject,
      emailType: "direct_email",
      replyTo: "contact@alokworld.in",
      html: formattedHtml,
      text: sanitizedBody,
    });

    if (!dispatchResult.success) {
      return NextResponse.json(
        { error: dispatchResult.error || "Failed to dispatch email." },
        { status: 500 }
      );
    }

    await recordAudit({
      req,
      admin,
      action: "send_direct_email",
      targetEntity: "EmailLog",
      targetId: dispatchResult.logId || "",
      details: `Administrator composed direct email to ${cleanRecipient} (Subject: ${cleanSubject})`,
    });

    return NextResponse.json({
      success: true,
      messageId: dispatchResult.messageId,
      logId: dispatchResult.logId,
    });
  } catch (err) {
    console.error("POST /api/admin/emails/compose error:", err.message);
    return NextResponse.json({ error: "Failed to compose and send email" }, { status: 500 });
  }
}
