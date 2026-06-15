import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { logLogin } from "@/lib/audit";
import { verifyToken, verifyBackupCode } from "@/lib/totp";

// Custom error classes so NextAuth surfaces a machine-readable code to the client
class EmailNotVerifiedError extends CredentialsSignin {
  code = "EMAIL_NOT_VERIFIED";
}
class TwoFactorRequiredError extends CredentialsSignin {
  constructor(challengeToken: string) {
    super();
    this.code = `TWO_FACTOR_REQUIRED:${challengeToken}`;
  }
}
class InvalidTwoFactorError extends CredentialsSignin {
  code = "INVALID_2FA_CODE";
}

const loginSchema = z.object({
  email:          z.string().email().optional(),
  password:       z.string().min(1).optional(),
  totpCode:       z.string().optional(),
  challengeToken: z.string().uuid().optional(), // 2FA completion path
  ip:             z.string().optional(),
  userAgent:      z.string().optional(),
});

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password, totpCode, challengeToken, ip = "unknown", userAgent } = parsed.data;

        try {
          // ── Path A: 2FA challenge completion ────────────────────────────
          // User already validated their password; now presenting TOTP code.
          if (challengeToken) {
            if (!totpCode) throw new InvalidTwoFactorError();

            const challenge = await prisma.twoFactorChallenge.findUnique({
              where:   { token: challengeToken },
              include: { user: { include: { store: true } } },
            });

            if (!challenge || challenge.expiresAt < new Date()) {
              return null; // Challenge expired — force re-login
            }

            const { user } = challenge;
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
              await logLogin({ userId: user.id, email: user.email, success: false, ip, userAgent });
              throw new InvalidTwoFactorError();
            }

            // Consume the challenge
            await prisma.twoFactorChallenge.delete({ where: { token: challengeToken } });
            await logLogin({ userId: user.id, email: user.email, success: true, ip, userAgent });

            return {
              id:        user.id,
              email:     user.email,
              name:      user.name ?? user.email,
              role:      user.role as string,
              storeId:   user.storeId,
              storeName: user.store.name,
              jti:       crypto.randomUUID(),
            };
          }

          // ── Path B: Normal email + password login ────────────────────────
          if (!email || !password) return null;

          const user = await prisma.user.findUnique({
            where:   { email },
            include: { store: true },
          });

          // Always run bcrypt to prevent timing attacks revealing valid emails
          const fakeHash = "$2b$12$invalidhashfortimingprotection000000000000000000000000";
          const valid = user
            ? await bcrypt.compare(password, user.password)
            : await bcrypt.compare(password, fakeHash).then(() => false);

          if (!user || !valid) {
            await logLogin({ userId: user?.id, email, success: false, ip, userAgent });
            return null;
          }

          // Block unverified accounts
          if (!user.emailVerified) {
            await logLogin({ userId: user.id, email, success: false, ip, userAgent });
            throw new EmailNotVerifiedError();
          }

          // 2FA required — store a challenge token and signal the client
          if (user.twoFactorEnabled && user.twoFactorSecret) {
            const newChallengeToken = crypto.randomUUID();
            await prisma.twoFactorChallenge.upsert({
              where:  { userId: user.id },
              update: { token: newChallengeToken, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
              create: { userId: user.id, token: newChallengeToken, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
            });
            throw new TwoFactorRequiredError(newChallengeToken);
          }

          await logLogin({ userId: user.id, email, success: true, ip, userAgent });

          return {
            id:        user.id,
            email:     user.email,
            name:      user.name ?? user.email,
            role:      user.role as string,
            storeId:   user.storeId,
            storeName: user.store.name,
            jti:       crypto.randomUUID(),
          };
        } catch (err) {
          // Re-throw CredentialsSignin subclasses so NextAuth passes .code to the client
          if (err instanceof CredentialsSignin) throw err;
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id: string; role: string; storeId: string; storeName: string; jti: string };
        token.id        = u.id;
        token.role      = u.role;
        token.storeId   = u.storeId;
        token.storeName = u.storeName;
        token.jti       = u.jti;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id        = token.id as string;
        session.user.role      = token.role as string;
        session.user.storeId   = token.storeId as string;
        session.user.storeName = token.storeName as string;
        session.user.jti       = token.jti as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge:   8 * 60 * 60, // 8 hours — sessions auto-expire
  },
});
