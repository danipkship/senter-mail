import type { NextAuthConfig } from "next-auth";

// Base config — no Prisma, safe to run on the Edge (middleware)
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      // Never block NextAuth's own API routes
      if (path.startsWith("/api/auth/")) return true;

      if (path === "/login" || path === "/register" || path === "/forgot-password" || path.startsWith("/reset-password")) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
