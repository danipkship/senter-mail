export function getAppUrl(): string {
  // AUTH_URL takes priority (explicitly set in env)
  if (process.env.AUTH_URL && !process.env.AUTH_URL.includes("localhost")) {
    return process.env.AUTH_URL;
  }
  // Vercel sets VERCEL_URL automatically on every deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.AUTH_URL ?? "http://localhost:3001";
}
