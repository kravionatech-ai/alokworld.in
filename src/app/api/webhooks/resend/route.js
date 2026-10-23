import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import EmailLog from "@/models/EmailLog";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    let event = null;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const eventType = event?.type; // e.g. email.delivered, email.bounced, email.sent
    const emailId = event?.data?.email_id || event?.data?.id;

    if (!eventType || !emailId) {
      return NextResponse.json({ error: "Missing event type or email_id" }, { status: 400 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database offline" }, { status: 503 });
    }

    const log = await EmailLog.findOne({ providerMessageId: emailId });
    if (!log) {
      // Event may be for an email sent outside the database or before log creation
      return NextResponse.json({ received: true, matched: false });
    }

    const eventTime = event.created_at ? new Date(event.created_at) : new Date();

    switch (eventType) {
      case "email.delivered":
        log.status = "delivered";
        log.deliveredAt = eventTime;
        break;
      case "email.bounced":
        log.status = "bounced";
        log.bouncedAt = eventTime;
        log.errorMessage = event.data?.bounce_type || "Recipient mailbox bounced";
        break;
      case "email.complained":
        log.status = "complained";
        log.errorMessage = "Recipient registered a spam complaint";
        break;
      case "email.sent":
        if (log.status !== "delivered") {
          log.status = "sent";
        }
        break;
      default:
        break;
    }

    // Record raw event metadata for auditability
    log.metadata = {
      ...log.metadata,
      lastWebhookEvent: eventType,
      lastWebhookAt: eventTime,
    };

    await log.save();

    return NextResponse.json({ success: true, updatedStatus: log.status });
  } catch (err) {
    console.error("Resend webhook processing error:", err.message);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
