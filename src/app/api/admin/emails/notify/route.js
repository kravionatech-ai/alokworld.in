import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { sendTransactionalEmail } from "@/lib/email";
import { verifyAdminToken } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export async function POST(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { inquiryId } = await req.json();
    if (!inquiryId) {
      return NextResponse.json({ error: "inquiryId is required" }, { status: 400 });
    }

    await connectDB();

    const adminNotificationRecipient = process.env.CONTACT_NOTIFICATION_EMAIL || "admin@alokworld.in";

    // Helper to send notification for a single contact record
    const sendForContact = async (contact) => {
      // 1. Dispatch Admin Notification
      const notifResult = await sendTransactionalEmail({
        to: adminNotificationRecipient,
        subject: `[समाज संपर्क] ${contact.subject} — ${contact.name}`,
        emailType: "contact_notification",
        contactInquiryId: contact._id,
        replyTo: contact.email,
        html: `
          <div style="font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #102F6B; max-width: 600px; margin: 0 auto; border: 1px solid #E9E2D8; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #091D42; padding: 16px 20px; text-align: center; border-bottom: 3px solid #F26A21;">
              <h2 style="color: #FFFFFF; margin: 0; font-size: 18px;">अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ</h2>
              <p style="color: #CBD5E1; margin: 4px 0 0; font-size: 12px;">नया संपर्क संदेश / पूछताछ (सूचना प्रेषित)</p>
            </div>
            <div style="padding: 24px; background-color: #FFFFFF;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; width: 100px; color: #64748B;">प्रेषक:</td>
                  <td style="padding: 6px 0; color: #102F6B; font-weight: bold;">${contact.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748B;">ईमेल:</td>
                  <td style="padding: 6px 0;"><a href="mailto:${contact.email}" style="color: #F26A21; text-decoration: none;">${contact.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748B;">फोन:</td>
                  <td style="padding: 6px 0; color: #263449;">${contact.phone || "प्रदान नहीं किया गया"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748B;">विषय:</td>
                  <td style="padding: 6px 0; color: #102F6B; font-weight: bold;">${contact.subject}</td>
                </tr>
              </table>
              <div style="background-color: #FFFCF5; border: 1px solid #F0E5D5; border-radius: 6px; padding: 16px;">
                <h4 style="margin: 0 0 8px; color: #102F6B; font-size: 13px;">संदेश विवरण:</h4>
                <p style="margin: 0; color: #263449; font-size: 13px; white-space: pre-wrap;">${contact.message}</p>
              </div>
            </div>
          </div>
        `,
      });

      // 2. Dispatch Visitor Confirmation
      const confResult = await sendTransactionalEmail({
        to: contact.email,
        subject: `आपके संदेश के लिए धन्यवाद — अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ`,
        emailType: "visitor_confirmation",
        contactInquiryId: contact._id,
        html: `
          <div style="font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #102F6B; max-width: 600px; margin: 0 auto; border: 1px solid #E9E2D8; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #091D42; padding: 16px 20px; text-align: center; border-bottom: 3px solid #F26A21;">
              <h2 style="color: #FFFFFF; margin: 0; font-size: 18px;">अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ</h2>
              <p style="color: #CBD5E1; margin: 4px 0 0; font-size: 12px;">अखिल भारतीय लोधी समाज निर्देशिका — alokworld.in</p>
            </div>
            <div style="padding: 24px; background-color: #FFFFFF;">
              <p style="font-size: 14px; color: #263449; margin-top: 0;">आदरणीय <strong>${contact.name}</strong> जी, सादर जय भारत।</p>
              <p style="font-size: 13px; color: #55657E; line-height: 1.7;">
                अखिल भारतीय लोधी समाज पोर्टल के माध्यम से आपका संदेश प्राप्त हो गया है। हमारे सचिवालय द्वारा आपके संदेश की समीक्षा की जा रही है और आवश्यकतानुसार शीघ्र ही आपसे संपर्क किया जाएगा।
              </p>
              <div style="background-color: #FFFCF5; border-left: 4px solid #F26A21; padding: 12px 16px; margin: 16px 0;">
                <p style="margin: 0; font-size: 12px; color: #64748B;"><strong>संदर्भित विषय:</strong> ${contact.subject}</p>
              </div>
              <p style="font-size: 12px; color: #64748B; margin-bottom: 0;">
                सस्नेह,<br />
                <strong>केंद्रीय सचिवालय</strong><br />
                अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)<br />
                वेबसाइट: <a href="https://alokworld.in" style="color: #F26A21; text-decoration: none;">alokworld.in</a>
              </p>
            </div>
          </div>
        `,
      });

      contact.notificationStatus = notifResult.success ? "sent" : "failed";
      if (notifResult.messageId) contact.notificationMessageId = notifResult.messageId;
      contact.confirmationStatus = confResult.success ? "sent" : "failed";
      if (confResult.messageId) contact.confirmationMessageId = confResult.messageId;
      if (!notifResult.success) contact.lastError = notifResult.error || "Failed to dispatch";
      await contact.save();

      return {
        id: contact._id,
        notificationSuccess: notifResult.success,
        confirmationSuccess: confResult.success,
      };
    };

    if (inquiryId === "all_pending") {
      const pendingInquiries = await Contact.find({
        $or: [{ notificationStatus: "pending" }, { notificationStatus: "failed" }],
      });

      const results = [];
      for (const item of pendingInquiries) {
        const res = await sendForContact(item);
        results.push(res);
      }

      await recordAudit({
        req,
        admin,
        action: "batch_send_contact_notifications",
        targetEntity: "Contact",
        details: `Processed batch notifications for ${results.length} inquiries`,
      });

      return NextResponse.json({
        success: true,
        processed: results.length,
        results,
      });
    }

    const contact = await Contact.findById(inquiryId);
    if (!contact) {
      return NextResponse.json({ error: "Contact inquiry not found" }, { status: 404 });
    }

    const result = await sendForContact(contact);

    await recordAudit({
      req,
      admin,
      action: "send_contact_notification",
      targetEntity: "Contact",
      targetId: contact._id,
      details: `Triggered notification for inquiry from ${contact.name} (${contact.email})`,
    });

    return NextResponse.json({
      success: true,
      result,
      contact,
    });
  } catch (err) {
    console.error("POST /api/admin/emails/notify error:", err.message);
    return NextResponse.json({ error: "Failed to process notifications" }, { status: 500 });
  }
}
