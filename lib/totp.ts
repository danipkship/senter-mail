import { generateSecret as otpGenerateSecret, generateSync, verifySync, generateURI } from "otplib";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY ?? process.env.AUTH_SECRET!;

// Encrypt TOTP secret before storing in DB
export function encryptSecret(secret: string): string {
  const key    = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
  const iv     = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptSecret(encrypted: string): string {
  const [ivHex, dataHex] = encrypted.split(":");
  const key       = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
  const iv        = Buffer.from(ivHex, "hex");
  const decipher  = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);
  return decrypted.toString("utf8");
}

// Generate a new TOTP secret
export function generateSecret(): string {
  return otpGenerateSecret({ length: 20 });
}

// Get OTP Auth URL for QR code
export function getOtpAuthUrl(secret: string, email: string): string {
  return generateURI({ label: email, issuer: "SENTER MAIL", secret });
}

// Verify a 6-digit TOTP code against an encrypted secret
export function verifyToken(token: string, encryptedSecret: string): boolean {
  try {
    const secret = decryptSecret(encryptedSecret);
    const result = verifySync({ token, secret });
    return result.valid;
  } catch {
    return false;
  }
}

// Generate 10 one-time backup codes
export function generateBackupCodes(): { plain: string[]; hashed: string[] } {
  const plain = Array.from({ length: 10 }, () =>
    crypto.randomBytes(5).toString("hex").toUpperCase()
  );
  const hashed = plain.map((code) =>
    crypto.createHash("sha256").update(code).digest("hex")
  );
  return { plain, hashed };
}

// Verify a backup code (returns index if valid, -1 if not)
export function verifyBackupCode(code: string, hashedCodes: string[]): number {
  const hash = crypto.createHash("sha256").update(code.toUpperCase()).digest("hex");
  return hashedCodes.indexOf(hash);
}
