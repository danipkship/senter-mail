import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/providers/email";
import { getAppUrl } from "@/lib/app-url";
import { verificationEmailHtml } from "@/lib/email-templates";
import crypto from "crypto";

export async function createAndSendVerificationEmail(userId: string, email: string, storeName: string) {
  const token     = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.emailVerificationToken.upsert({
    where:  { userId },
    update: { token, expiresAt },
    create: { userId, token, expiresAt },
  });

  const link = `${getAppUrl()}/api/auth/verify-email?token=${token}`;

  await sendEmail(
    email,
    "Verify your SENTER MAIL account",
    `Hi ${storeName},\n\nVerify your email: ${link}\n\nThis link expires in 24 hours.`,
    verificationEmailHtml(storeName, link)
  );
}

export async function verifyEmailToken(token: string): Promise<{ success: boolean; error?: string }> {
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });

  if (!record) return { success: false, error: "Invalid or expired link." };
  if (record.expiresAt < new Date()) {
    await prisma.emailVerificationToken.delete({ where: { token } });
    return { success: false, error: "This link has expired. Please request a new one." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data:  { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.delete({ where: { token } }),
  ]);

  return { success: true };
}
