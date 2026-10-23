import { NextResponse } from "next/server";
import { recordInboundEmail } from "@/lib/email";
import { sanitizeContent } from "@/lib/auth";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let from = "";
    let to = [];
    let subject = "";
    let textBody = "";
    let htmlBody = "";
    let attachments = [];

    if (contentType.includes("application/json")) {
      const data = await req.json();
      from = data.from || data.sender || "";
      to = Array.isArray(data.to) ? data.to : [data.to || data.recipient || ""];
      subject = data.subject || "";
      textBody = data.text || data.textBody || "";
      htmlBody = data.html || data.htmlBody || "";
      if (Array.isArray(data.attachments)) {
        attachments = data.attachments.map((a) => ({
          filename: a.filename || a.name || "attachment",
          contentType: a.contentType || a.type || "application/octet-stream",
          size: a.size || 0,
          url: a.url || "",
        }));
      }
    } else if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      from = formData.get("from") || formData.get("sender") || "";
      const toField = formData.get("to") || formData.get("recipient") || "";
      to = [String(toField)];
      subject = formData.get("subject") || "";
      textBody = formData.get("text") || formData.get("body-plain") || "";
      htmlBody = formData.get("html") || formData.get("body-html") || "";
    } else {
      const rawText = await req.text();
      subject = "Raw Inbound Message";
      textBody = rawText;
    }

    if (!from && !subject && !textBody && !htmlBody) {
      return NextResponse.json({ error: "Empty email payload received" }, { status: 400 });
    }

    // Sanitize any HTML body
    const cleanHtml = htmlBody ? sanitizeContent(htmlBody) : "";

    const log = await recordInboundEmail({
      from,
      to,
      subject,
      textBody,
      htmlBody: cleanHtml,
      attachments,
      metadata: {
        receivedAt: new Date(),
        headers: Object.fromEntries(req.headers.entries()),
      },
    });

    return NextResponse.json({
      success: true,
      messageId: log._id,
      status: "received",
    });
  } catch (err) {
    console.error("Inbound email webhook error:", err.message);
    return NextResponse.json({ error: "Failed to process incoming email" }, { status: 500 });
  }
}
