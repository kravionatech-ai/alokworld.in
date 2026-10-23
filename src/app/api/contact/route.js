import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { sendTransactionalEmail } from "@/lib/email";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { recordAudit } from "@/lib/audit";

export async function POST(req) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate Limiting: Max 5 contact messages per 10 minutes per IP
    const rateLimit = checkRateLimit(`contact_${ip}`, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `अत्यधिक अनुरोध। कृपया पुनः प्रयास करने से पूर्व ${rateLimit.retryAfter} सेकंड प्रतीक्षा करें।`,
        },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
      );
    }

    const body = await req.json();
    const { name, email, phone, subject, message, honeypot } = body;

    // Spam honeypot trap: bots fill hidden fields, humans do not
    if (honeypot && String(honeypot).trim() !== "") {
      return NextResponse.json({
        success: true,
        message: "आपका संदेश प्राप्त हुआ।",
      });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "नाम, ईमेल, विषय एवं संदेश अनिवार्य हैं।" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "कृपया एक मान्य ईमेल पता दर्ज करें।" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: "नाम 2 से 100 अक्षरों के मध्य होना चाहिए।" },
        { status: 400 }
      );
    }

    if (message.trim().length < 5 || message.trim().length > 5000) {
      return NextResponse.json(
        { error: "संदेश 5 से 5000 अक्षरों के मध्य होना चाहिए।" },
        { status: 400 }
      );
    }

    const sanitizedMessage = sanitizeContent(message);

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { error: "डेटाबेस सेवा अस्थायी रूप से अनुपलब्ध है। कृपया कुछ समय पश्चात पुनः प्रयास करें।" },
        { status: 503 }
      );
    }

    // 1. Always save inquiry to MongoDB first (never lose user input even if email fails)
    const contact = await Contact.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : "",
      subject: subject.trim(),
      message: sanitizedMessage,
      notificationStatus: "pending",
      confirmationStatus: "pending",
    });

    const adminNotificationRecipient = process.env.CONTACT_NOTIFICATION_EMAIL || "admin@alokworld.in";

    // 2. Dispatch Admin Notification via Resend
    const notifResult = await sendTransactionalEmail({
      to: adminNotificationRecipient,
      subject: `[समाज संपर्क] ${subject.trim()} — ${name.trim()}`,
      emailType: "contact_notification",
      contactInquiryId: contact._id,
      replyTo: cleanEmail,
      html: `
        <div style="font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #102F6B; max-width: 600px; margin: 0 auto; border: 1px solid #E9E2D8; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #091D42; padding: 16px 20px; text-align: center; border-bottom: 3px solid #F26A21;">
            <h2 style="color: #FFFFFF; margin: 0; font-size: 18px;">अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ</h2>
            <p style="color: #CBD5E1; margin: 4px 0 0; font-size: 12px;">नया संपर्क संदेश / पूछताछ प्राप्त</p>
          </div>
          <div style="padding: 24px; background-color: #FFFFFF;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 100px; color: #64748B;">प्रेषक का नाम:</td>
                <td style="padding: 6px 0; color: #102F6B; font-weight: bold;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748B;">ईमेल:</td>
                <td style="padding: 6px 0;"><a href="mailto:${cleanEmail}" style="color: #F26A21; text-decoration: none;">${cleanEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748B;">दूरभाष / फोन:</td>
                <td style="padding: 6px 0; color: #263449;">${phone ? phone.trim() : "प्रदान नहीं किया गया"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748B;">विषय:</td>
                <td style="padding: 6px 0; color: #102F6B; font-weight: bold;">${subject.trim()}</td>
              </tr>
            </table>
            <div style="background-color: #FFFCF5; border: 1px solid #F0E5D5; border-radius: 6px; padding: 16px; margin-top: 12px;">
              <h4 style="margin: 0 0 8px; color: #102F6B; font-size: 13px;">संदेश विवरण:</h4>
              <p style="margin: 0; color: #263449; font-size: 13px; white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #E9E2D8; text-align: center;">
              <a href="https://alokworld.in/admin" style="background-color: #102F6B; color: #FFFFFF; padding: 8px 18px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block;">एडमिन पोर्टल में देखें →</a>
            </div>
          </div>
        </div>
      `,
    });

    if (notifResult.success) {
      contact.notificationStatus = "sent";
      contact.notificationMessageId = notifResult.messageId || "";
    } else {
      contact.notificationStatus = "failed";
      contact.lastError = notifResult.error || "Failed to dispatch admin notification";
    }

    // 3. Dispatch Visitor Confirmation Email
    const confResult = await sendTransactionalEmail({
      to: cleanEmail,
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
            <p style="font-size: 14px; color: #263449; margin-top: 0;">आदरणीय <strong>${name.trim()}</strong> जी, सादर जय भारत।</p>
            <p style="font-size: 13px; color: #55657E; line-height: 1.7;">
              अखिल भारतीय लोधी समाज पोर्टल के माध्यम से आपका संदेश हमें सफलतापूर्वक प्राप्त हो गया है। हमारे सचिवालय द्वारा आपके संदेश की समीक्षा की जा रही है और आवश्यकतानुसार शीघ्र ही आपसे संपर्क किया जाएगा।
            </p>
            <div style="background-color: #FFFCF5; border-left: 4px solid #F26A21; padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0;">
              <p style="margin: 0; font-size: 12px; color: #64748B;"><strong>संदर्भित विषय:</strong> ${subject.trim()}</p>
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

    if (confResult.success) {
      contact.confirmationStatus = "sent";
      contact.confirmationMessageId = confResult.messageId || "";
    } else {
      contact.confirmationStatus = "failed";
    }

    await contact.save();

    return NextResponse.json({
      success: true,
      message: "आपका संदेश सफलतापूर्वक प्राप्त हुआ। समाज सचिवालय द्वारा शीघ्र संपर्क किया जाएगा।",
      inquiryId: contact._id,
    });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: "संदेश प्रेषित करने में विफल। कृपया पुनः प्रयास करें।" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const conn = await connectDB();
    if (conn) {
      const messages = await Contact.find().sort({ createdAt: -1 }).limit(200).lean();
      return NextResponse.json({ messages });
    }

    return NextResponse.json({ messages: [] });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: "Failed to fetch contact inquiries" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id, isRead } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing message ID" }, { status: 400 });
    }

    const conn = await connectDB();
    if (conn) {
      const updated = await Contact.findByIdAndUpdate(id, { isRead: Boolean(isRead) }, { new: true });
      return NextResponse.json({ success: true, message: updated });
    }

    return NextResponse.json({ error: "Database not connected" }, { status: 503 });
  } catch (error) {
    console.error("PATCH /api/contact error:", error);
    return NextResponse.json({ error: "Failed to update inquiry status" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing message ID" }, { status: 400 });
    }

    const conn = await connectDB();
    if (conn) {
      const deleted = await Contact.findByIdAndDelete(id);
      if (deleted) {
        await recordAudit({
          req,
          admin,
          action: "delete_contact_inquiry",
          targetEntity: "Contact",
          targetId: id,
          details: `Deleted contact inquiry from ${deleted.name} (${deleted.email})`,
        });
        return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
      }
    }

    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  } catch (error) {
    console.error("DELETE /api/contact error:", error);
    return NextResponse.json({ error: "Failed to delete contact inquiry" }, { status: 500 });
  }
}
