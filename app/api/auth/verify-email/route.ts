import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/email-verification";

export async function GET(req: NextRequest) {
  const appUrl = process.env.AUTH_URL ?? "http://localhost:3001";
  const token  = new URL(req.url).searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid_token`);
  }

  const result = await verifyEmailToken(token);

  if (!result.success) {
    return NextResponse.redirect(`${appUrl}/login?error=expired_token`);
  }

  return NextResponse.redirect(`${appUrl}/login?verified=1`);
}
