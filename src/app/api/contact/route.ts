import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RECIPIENT_EMAIL = "info@dineshd.dev";

/**
 * Contact form submission handler.
 *
 * Validates input and sends email via Resend API.
 * Rate limiting should be added if abuse becomes an issue.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  try {
    const body: unknown = await request.json();

    // Validate request body
    if (!isValidContactForm(body)) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const { name, email, subject, message } = body;

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: "Yield Contact <noreply@yield.dineshd.dev>",
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: subject || "Yield Contact Form",
      text: formatPlainTextEmail(name, email, message),
      html: formatHtmlEmail(name, email, message),
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

function isValidContactForm(data: unknown): data is ContactFormData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const form = data as Record<string, unknown>;

  return (
    typeof form.name === "string" &&
    form.name.length > 0 &&
    form.name.length <= 100 &&
    typeof form.email === "string" &&
    isValidEmail(form.email) &&
    (form.subject === undefined ||
      (typeof form.subject === "string" && form.subject.length <= 200)) &&
    typeof form.message === "string" &&
    form.message.length > 0 &&
    form.message.length <= 5000
  );
}

function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email) && email.length <= 254;
}

function formatPlainTextEmail(name: string, email: string, message: string): string {
  return `New contact form submission from Yield:

Name: ${name}
Email: ${email}

Message:
${message}

---
Sent via Yield Contact Form`;
}

function formatHtmlEmail(name: string, email: string, message: string): string {
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
  </div>

  <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #6b7280; width: 80px;"><strong>Name:</strong></td>
        <td style="padding: 8px 0;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td>
        <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #667eea;">${escapeHtml(email)}</a></td>
      </tr>
    </table>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">

    <div style="background: white; padding: 16px; border-radius: 4px; border: 1px solid #e5e7eb;">
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>

    <p style="color: #9ca3af; font-size: 12px; margin-top: 16px; margin-bottom: 0;">
      Sent via Yield Contact Form
    </p>
  </div>
</body>
</html>
  `.trim();
}
