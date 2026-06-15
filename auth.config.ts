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
      const isLoginPage = nextUrl.pathname === "/login";

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
