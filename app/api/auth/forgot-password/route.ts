import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/app-url";
import { passwordResetEmailHtml } from "@/lib/email-templates";
import sgMail from "@sendgrid/mail";

const schema = z.object({
  email: z.string().email().max(255),
});

export async function POST(req: NextRequest) {
  const body   = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const { email } = parsed.data;

  // Always return success to prevent email enumeration
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const { token } = await prisma.passwordResetToken.upsert({
      where:  { userId: user.id },
      update: { token: crypto.randomUUID(), expiresAt },
      create: { userId: user.id, expiresAt },
    });

    const resetUrl = `${getAppUrl()}/reset-password?token=${token}`;

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({
        to:      email,
        from:    { email: process.env.SENDGRID_FROM_EMAIL, name: process.env.SENDGRID_FROM_NAME ?? "SENTER MAIL" },
        subject: "Reset your SENTER MAIL password",
        text:    `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
        html:    passwordResetEmailHtml(resetUrl),
      }).catch(console.error);
    } else {
      console.log("[DEV] Password reset link:", resetUrl);
    }
  }

  return NextResponse.json({ success: true });
}
