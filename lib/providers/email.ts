import sgMail from "@sendgrid/mail";
import type { ProviderResult } from "./sms";

function bodyToHtml(text: string): string {
  return `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
    ${text
      .split("\n")
      .map((line) => (line.trim() ? `<p style="margin: 0 0 8px;">${line}</p>` : "<br>"))
      .join("")}
  </div>`;
}

export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  html?: string
): Promise<ProviderResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const fromName = process.env.SENDGRID_FROM_NAME || "SENTER MAIL";

  // Simulation mode — no credentials configured
  if (!apiKey || !fromEmail) {
    console.log(
      `[EMAIL SIMULATION]\nTo: ${to}\nSubject: ${subject}\n---\n${body}\n---`
    );
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, simulated: true };
  }

  try {
    sgMail.setApiKey(apiKey);
    await sgMail.send({
      to,
      from: { email: fromEmail, name: fromName },
      subject,
      text: body,
      html: html ?? bodyToHtml(body),
    });
    return { success: true };
  } catch (err: unknown) {
    let message = "Unknown SendGrid error";
    if (err instanceof Error) {
      message = err.message;
      const response = (err as unknown as { response?: { body?: { errors?: { message: string }[] } } }).response;
      if (response?.body?.errors?.length) {
        message = response.body.errors.map((e) => e.message).join(", ");
      }
    }
    console.error("[SendGrid email error]", message);
    return { success: false, error: message };
  }
}
