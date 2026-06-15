import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { verifySync } from "otplib";
import { encryptSecret, generateBackupCodes } from "@/lib/totp";

const schema = z.object({
  secret:  z.string().min(16).max(64),
  totpCode: z.string().length(6),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body   = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const { secret, totpCode } = parsed.data;

  // Verify the code before enabling
  const verifyResult = verifySync({ token: totpCode, secret });
  if (!verifyResult.valid) {
    return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });
  }

  const { plain, hashed } = generateBackupCodes();

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: true,
      twoFactorSecret:  encryptSecret(secret),
      backupCodes:      hashed,
    },
  });

  return NextResponse.json({ success: true, backupCodes: plain });
}
