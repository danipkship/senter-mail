import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const schema = z.object({
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body   = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const valid = await bcrypt.compare(parsed.data.password, user.password);
  if (!valid) return NextResponse.json({ error: "Incorrect password." }, { status: 403 });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorEnabled: false, twoFactorSecret: null, backupCodes: [] },
  });

  return NextResponse.json({ success: true });
}
