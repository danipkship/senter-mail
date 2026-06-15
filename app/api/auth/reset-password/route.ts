import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token:    z.string().min(1),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  const body   = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const { token, password } = parsed.data;

  const record = await prisma.passwordResetToken.findUnique({
    where:   { token },
    include: { user: true },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "This link has expired. Please request a new one." }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);

  await Promise.all([
    prisma.user.update({
      where: { id: record.userId },
      data:  { password: hash, emailVerified: record.user.emailVerified ?? new Date() },
    }),
    prisma.passwordResetToken.delete({ where: { token } }),
  ]);

  return NextResponse.json({ success: true });
}
