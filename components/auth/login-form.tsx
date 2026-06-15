"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ light = false }: { light?: boolean }) {
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfoMsg("");

    const form     = new FormData(e.currentTarget);
    const email    = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.error) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // NextAuth v5 passes custom CredentialsSignin.code via result.code
      const code = result.code ?? "";

      if (code === "EMAIL_NOT_VERIFIED") {
        setInfoMsg("Please verify your email before signing in. Check your inbox for a verification link.");
        setLoading(false);
        return;
      }

      if (code.startsWith("TWO_FACTOR_REQUIRED:")) {
        const challengeToken = code.replace("TWO_FACTOR_REQUIRED:", "");
        router.push(`/login/2fa?challenge=${encodeURIComponent(challengeToken)}&email=${encodeURIComponent(email)}`);
        return;
      }

      if (code === "INVALID_2FA_CODE") {
        setError("Invalid two-factor code. Please try again.");
        setLoading(false);
        return;
      }

      setError("Invalid email or password. Please try again.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const labelClass = light ? "text-slate-700 text-sm font-medium" : "text-slate-300 text-sm font-medium";
  const inputClass = light
    ? "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#4361EE] focus-visible:border-[#4361EE] h-11"
    : "bg-slate-800/80 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500 h-11";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className={labelClass}>Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className={labelClass}>Password</Label>
          <Link href="/forgot-password" className="text-xs text-[#4361EE] hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className={`${inputClass} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {infoMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5"
          >
            <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {infoMsg}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#4361EE] hover:bg-[#3450d4] text-white font-semibold h-11 text-sm shadow-md shadow-blue-200"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </Button>

      {light && (
        <p className="text-center text-xs text-slate-400 pt-1">
          Powered by <span className="font-semibold text-[#4361EE]">SENTER MAIL</span>
        </p>
      )}
    </form>
  );
}
