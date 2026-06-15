import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyToken, verifyBackupCode } from "@/lib/totp";
import { signIn } from "@/auth";

const schema = z.object({
  challengeToken: z.string().uuid(),
  totpCode:       z.string().min(6).max(8),
});

export async function POST(req: NextRequest) {
  const body   = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const { challengeToken, totpCode } = parsed.data;

  const challenge = await prisma.twoFactorChallenge.findUnique({
    where:   { token: challengeToken },
    include: { user: true },
  });

  if (!challenge || challenge.expiresAt < new Date()) {
    return NextResponse.json({ error: "Challenge expired. Please sign in again." }, { status: 401 });
  }

  const { user } = challenge;

  // Verify TOTP or backup code
  let valid = user.twoFactorSecret ? verifyToken(totpCode, user.twoFactorSecret) : false;

  if (!valid) {
    const backupIndex = verifyBackupCode(totpCode, user.backupCodes);
    if (backupIndex >= 0) {
      valid = true;
      const remaining = user.backupCodes.filter((_, i) => i !== backupIndex);
      await prisma.user.update({ where: { id: user.id }, data: { backupCodes: remaining } });
    }
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid code." }, { status: 403 });
  }

  // Clean up challenge
  await prisma.twoFactorChallenge.delete({ where: { token: challengeToken } });

  return NextResponse.json({ success: true, userId: user.id });
}
