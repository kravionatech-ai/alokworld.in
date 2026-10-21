import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { sendEmail } from "@/lib/email";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

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
          error: `Too many submissions. Please wait ${rateLimit.retryAfter} seconds before sending another message.`,
        },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
      );
    }

    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject and message are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters." },
        { status: 400 }
      );
    }

    if (message.trim().length < 5 || message.trim().length > 5000) {
      return NextResponse.json(
        { error: "Message must be between 5 and 5000 characters." },
        { status: 400 }
      );
    }

    const sanitizedMessage = sanitizeContent(message);

    const conn = await connectDB();
    if (conn) {
      await Contact.create({
        name: name.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : "",
        subject: subject.trim(),
        message: sanitizedMessage,
      });
    }

    // Send notification to Admin via Resend (fails gracefully if credentials not present)
    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || "admin@alokworld.in";
    try {
      await sendEmail({
        to: recipient,
        subject: `[Samaj Directory Contact] ${subject.trim()} from ${name.trim()}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #102F6B;">
            <h2>New Contact Form Inquiry</h2>
            <p><strong>Name:</strong> ${name.trim()}</p>
            <p><strong>Email:</strong> ${cleanEmail}</p>
            <p><strong>Phone:</strong> ${phone ? phone.trim() : "Not provided"}</p>
            <p><strong>Subject:</strong> ${subject.trim()}</p>
            <hr style="border: 1px solid #F0E5D5; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <div style="background: #FFFCF5; padding: 15px; border-radius: 8px; border: 1px solid #F0E5D5;">${sanitizedMessage}</div>
          </div>
        `,
      });
    } catch (err) {
      console.warn("Contact email notification dispatch notice:", err.message);
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been received by the community secretariat.",
    });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: "Failed to submit contact message" }, { status: 500 });
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
      const messages = await Contact.find().sort({ createdAt: -1 }).limit(100).lean();
      return NextResponse.json({ messages });
    }

    return NextResponse.json({ messages: [] });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: "Failed to fetch contact inquiries" }, { status: 500 });
  }
}
