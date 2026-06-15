import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSecret, getOtpAuthUrl, encryptSecret } from "@/lib/totp";
import QRCode from "qrcode";

// Generate a new TOTP secret and QR code for the authenticated user
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret   = generateSecret();
  const otpUrl   = getOtpAuthUrl(secret, session.user.email!);
  const qrBase64 = await QRCode.toDataURL(otpUrl);

  // Store the unconfirmed secret temporarily (not yet encrypted — only save when confirmed)
  // We pass it back to the client to display during setup
  // The client will POST it back with the TOTP code to /api/auth/2fa/enable

  return NextResponse.json({ secret, qrCode: qrBase64 });
}
