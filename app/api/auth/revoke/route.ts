import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Revoke the current session JWT so it can't be reused even if stolen
export async function POST() {
  const session = await auth();
  const jti     = (session?.user as { jti?: string })?.jti;

  if (jti) {
    // Store the revoked JTI until the JWT would have naturally expired (8 hours)
    await prisma.revokedSession.upsert({
      where:  { jti },
      update: { expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) },
      create: { jti, expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) },
    });
  }

  return NextResponse.json({ success: true });
}
