import { Resend } from "resend";

let resendClient = null;

if (process.env.RESEND_API_KEY) {
  resendClient = new Resend(process.env.RESEND_API_KEY);
}

export async function sendEmail({ to, subject, html, text }) {
  if (!resendClient || !process.env.RESEND_API_KEY) {
    console.info(`[Email simulation] To: ${to} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const data = await resendClient.emails.send({
      from: "alokworld.in <notifications@alokworld.in>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || subject,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend error:", error);
    return { success: false, error: error.message };
  }
}
