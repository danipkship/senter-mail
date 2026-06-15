import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/auth.config";
import { checkAuthRateLimit, checkApiRateLimit } from "@/lib/rate-limit";

const { auth } = NextAuth(authConfig);

// ── Middleware ────────────────────────────────────────────────────────────────
export default auth(async (req: NextRequest & { auth: unknown }) => {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
           ?? req.headers.get("x-real-ip")
           ?? "unknown";
  const path = req.nextUrl.pathname;

  // Auth & register — 5 req / 15 min (brute force), shared across all instances
  if (path === "/api/register" || path.startsWith("/api/auth/callback")) {
    const { success } = await checkAuthRateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }
  }

  // General API — 60 req / min
  if (path.startsWith("/api/") && !path.startsWith("/api/auth/")) {
    const { success } = await checkApiRateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/api/auth/:path*",
    "/api/register",
    "/api/:path*",
  ],
};
