import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { sendEmail } from "@/lib/email";
import { verifyAdminToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject and message are required" },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    if (conn) {
      await Contact.create({
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : "",
        subject: subject.trim(),
        message: message.trim(),
      });
    }

    // Send transactional notification to Admin via Resend
    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || "admin@alokworld.in";
    await sendEmail({
      to: recipient,
      subject: `[Samaj Directory Contact] ${subject} from ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #082F75;">
          <h2>New Contact Form Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 1px solid #F3D8B0; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="background: #FFF9E8; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully to the community administrator.",
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
