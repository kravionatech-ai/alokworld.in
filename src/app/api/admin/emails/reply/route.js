import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { sendTransactionalEmail } from "@/lib/email";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export async function POST(req) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { inquiryId, recipientEmail, subject, message } = await req.json();

    if (!recipientEmail || !subject || !message) {
      return NextResponse.json(
        { error: "recipientEmail, subject and message are required" },
        { status: 400 }
      );
    }

    const cleanRecipient = recipientEmail.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const sanitizedReply = sanitizeContent(message);

    await connectDB();

    const dispatchResult = await sendTransactionalEmail({
      to: cleanRecipient,
      subject: cleanSubject,
      emailType: "admin_reply",
      contactInquiryId: inquiryId || null,
      html: `
        <div style="font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #102F6B; max-width: 600px; margin: 0 auto; border: 1px solid #E9E2D8; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #091D42; padding: 16px 20px; text-align: center; border-bottom: 3px solid #F26A21;">
            <h2 style="color: #FFFFFF; margin: 0; font-size: 18px;">अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ</h2>
            <p style="color: #CBD5E1; margin: 4px 0 0; font-size: 12px;">सचिवालय आधिकारिक उत्तर (Official Reply)</p>
          </div>
          <div style="padding: 24px; background-color: #FFFFFF;">
            <div style="color: #263449; font-size: 13px; line-height: 1.7; white-space: pre-wrap;">${sanitizedReply}</div>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E9E2D8; font-size: 12px; color: #64748B;">
              <strong>केंद्रीय सचिवालय</strong><br />
              अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)<br />
              वेबसाइट: <a href="https://alokworld.in" style="color: #F26A21; text-decoration: none;">alokworld.in</a>
            </div>
          </div>
        </div>
      `,
    });

    if (!dispatchResult.success) {
      return NextResponse.json(
        { error: dispatchResult.error || "Failed to dispatch reply email." },
        { status: 500 }
      );
    }

    // Attach reply record to Contact document if linked
    if (inquiryId) {
      try {
        await Contact.findByIdAndUpdate(inquiryId, {
          $push: {
            replies: {
              adminEmail: admin.email,
              subject: cleanSubject,
              message: sanitizedReply,
              sentAt: new Date(),
              messageId: dispatchResult.messageId || "",
              status: "sent",
            },
          },
        });
      } catch (dbErr) {
        console.warn("Could not attach reply to Contact document:", dbErr.message);
      }
    }

    await recordAudit({
      req,
      admin,
      action: "send_admin_reply",
      targetEntity: "EmailLog",
      targetId: dispatchResult.logId || "",
      details: `Administrator sent reply to ${cleanRecipient} (Subject: ${cleanSubject})`,
    });

    return NextResponse.json({
      success: true,
      messageId: dispatchResult.messageId,
      logId: dispatchResult.logId,
    });
  } catch (err) {
    console.error("POST /api/admin/emails/reply error:", err.message);
    return NextResponse.json({ error: "Failed to send email reply" }, { status: 500 });
  }
}
