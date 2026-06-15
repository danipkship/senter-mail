import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
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

    const resetUrl = `${process.env.AUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({
        to:      email,
        from:    { email: process.env.SENDGRID_FROM_EMAIL!, name: process.env.SENDGRID_FROM_NAME! },
        subject: "Reset your SENTER MAIL password",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
            <h2 style="color:#1e293b;">Reset your password</h2>
            <p style="color:#475569;">Click the button below to set a new password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display:inline-block;background:#4361EE;color:#fff;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;margin:16px 0;">
              Reset Password
            </a>
            <p style="color:#94a3b8;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      }).catch(console.error);
    } else {
      console.log("[DEV] Password reset link:", resetUrl);
    }
  }

  return NextResponse.json({ success: true });
}
