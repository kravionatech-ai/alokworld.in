import { Resend } from "resend";
import { connectDB } from "@/lib/db";
import EmailLog from "@/models/EmailLog";

let resendClient = null;

function getResendClient() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Configured verified sender address or fallback
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "alokworld.in <contact@alokworld.in>";
const FALLBACK_FROM = "alokworld.in <onboarding@resend.dev>";

/**
 * Send an outbound transactional email via Resend and record in MongoDB EmailLog.
 *
 * @param {object} params
 * @param {string|string[]} params.to - Recipient email(s)
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML body
 * @param {string} [params.text] - Plain text body
 * @param {string} [params.emailType="system"] - Type: contact_notification, visitor_confirmation, admin_reply, system
 * @param {string} [params.contactInquiryId] - Associated Contact ID if applicable
 * @param {string} [params.replyTo] - Reply-To address
 * @returns {Promise<{success: boolean, messageId?: string, logId?: string, error?: string}>}
 */
export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
  emailType = "system",
  contactInquiryId = null,
  replyTo = "",
}) {
  const recipients = Array.isArray(to) ? to : [to];
  const cleanRecipients = recipients.map((r) => String(r).trim().toLowerCase()).filter(Boolean);

  if (cleanRecipients.length === 0) {
    return { success: false, error: "No valid recipient email address provided." };
  }

  // Ensure DB connection for logging
  await connectDB();

  // Create pending EmailLog entry in MongoDB
  let logRecord = null;
  try {
    logRecord = await EmailLog.create({
      direction: "outbound",
      emailType,
      from: DEFAULT_FROM,
      to: cleanRecipients,
      replyTo: replyTo || "",
      subject,
      htmlBody: html || "",
      textBody: text || "",
      status: "processing",
      contactInquiryId,
    });
  } catch (dbErr) {
    console.warn("Could not pre-create EmailLog entry:", dbErr.message);
  }

  const client = getResendClient();
  if (!client) {
    console.warn("[Email Simulation] RESEND_API_KEY not set. Simulated send to:", cleanRecipients);
    if (logRecord) {
      logRecord.status = "sent";
      logRecord.errorMessage = "Simulated: RESEND_API_KEY not configured.";
      await logRecord.save();
    }
    return { success: true, simulated: true, logId: logRecord?._id };
  }

  // Attempt sending via primary sender address
  try {
    let response = await client.emails.send({
      from: DEFAULT_FROM,
      to: cleanRecipients,
      reply_to: replyTo || undefined,
      subject,
      html,
      text: text || subject,
    });

    // If primary from domain fails due to verification, fallback to onboarding@resend.dev
    if (response.error && response.error.name === "validation_error" && response.error.message?.includes("domain")) {
      console.warn("Primary domain unverified, falling back to onboarding@resend.dev");
      response = await client.emails.send({
        from: FALLBACK_FROM,
        to: cleanRecipients,
        reply_to: replyTo || undefined,
        subject,
        html,
        text: text || subject,
      });
    }

    if (response.error) {
      throw new Error(response.error.message || "Resend dispatch failed");
    }

    const providerMessageId = response.data?.id || "";

    if (logRecord) {
      logRecord.providerMessageId = providerMessageId;
      logRecord.status = "sent"; // Note: Only marked "sent" upon API acceptance; "delivered" requires webhook event
      logRecord.errorMessage = "";
      await logRecord.save();
    }

    return {
      success: true,
      messageId: providerMessageId,
      logId: logRecord?._id,
    };
  } catch (error) {
    console.error("Resend email dispatch error:", error.message);

    if (logRecord) {
      logRecord.status = "failed";
      logRecord.errorMessage = error.message;
      await logRecord.save();
    }

    return {
      success: false,
      error: error.message,
      logId: logRecord?._id,
    };
  }
}

/**
 * Retry sending an eligible failed email from the database.
 *
 * @param {string} logId - EmailLog document ID
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function retryFailedEmail(logId) {
  await connectDB();
  const log = await EmailLog.findById(logId);
  if (!log) {
    return { success: false, error: "Email log not found." };
  }

  if (log.status === "delivered" || log.status === "sent") {
    return { success: false, error: `Email is already in '${log.status}' status.` };
  }

  log.retryCount = (log.retryCount || 0) + 1;
  log.status = "processing";
  await log.save();

  const client = getResendClient();
  if (!client) {
    log.status = "failed";
    log.errorMessage = "RESEND_API_KEY not configured.";
    await log.save();
    return { success: false, error: log.errorMessage };
  }

  try {
    const response = await client.emails.send({
      from: log.from || DEFAULT_FROM,
      to: log.to,
      reply_to: log.replyTo || undefined,
      subject: log.subject,
      html: log.htmlBody,
      text: log.textBody || log.subject,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    log.providerMessageId = response.data?.id || log.providerMessageId;
    log.status = "sent";
    log.errorMessage = "";
    await log.save();

    return { success: true, messageId: response.data?.id };
  } catch (err) {
    log.status = "failed";
    log.errorMessage = err.message;
    await log.save();
    return { success: false, error: err.message };
  }
}

/**
 * Record an incoming email received through inbound webhook.
 *
 * @param {object} params
 * @returns {Promise<object>}
 */
export async function recordInboundEmail({
  from,
  to,
  subject,
  textBody = "",
  htmlBody = "",
  attachments = [],
  metadata = {},
}) {
  await connectDB();
  const recipients = Array.isArray(to) ? to : [to];

  const log = await EmailLog.create({
    direction: "inbound",
    emailType: "inbound_email",
    from: String(from || "").trim(),
    to: recipients.map((r) => String(r).trim()),
    subject: String(subject || "(No Subject)").trim(),
    textBody,
    htmlBody,
    status: "received",
    isRead: false,
    attachments,
    metadata,
  });

  return log;
}
