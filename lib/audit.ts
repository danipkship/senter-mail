import { prisma } from "@/lib/prisma";

export async function logLogin({
  userId,
  email,
  success,
  ip,
  userAgent,
}: {
  userId?: string;
  email: string;
  success: boolean;
  ip: string;
  userAgent?: string;
}) {
  try {
    await prisma.loginLog.create({
      data: { userId, email, success, ip, userAgent },
    });
  } catch {
    // Never let audit logging crash the auth flow
  }
}

// Clean up old login logs (keep 90 days)
export async function pruneLoginLogs() {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  await prisma.loginLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
}

// Clean up expired revoked sessions
export async function pruneRevokedSessions() {
  await prisma.revokedSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}
