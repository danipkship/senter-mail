import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking — no iframes allowed
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't send referrer to external sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Block reflected XSS in older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Disable unused browser features
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // Force HTTPS for 2 years (only active in production)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
