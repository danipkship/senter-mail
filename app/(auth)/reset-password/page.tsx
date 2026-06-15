"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { KeyRound, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

function ResetForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    setError("");

    const res  = await fetch("/api/auth/reset-password", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ token, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } else {
      setError(data.error ?? "Something went wrong.");
    }
  }

  if (!token) {
    return (
      <div className="text-center space-y-2">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-slate-700 font-medium">Invalid reset link</p>
        <Link href="/forgot-password" className="text-sm text-[#4361EE] hover:underline">
          Request a new one
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center space-y-3">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
        <p className="font-semibold text-slate-800">Password updated!</p>
        <p className="text-sm text-slate-500">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">New password</label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
            minLength={8}
            autoFocus
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361EE] focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Confirm password</label>
        <input
          type={showPass ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your new password"
          required
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361EE] focus:border-transparent"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#4361EE] hover:bg-[#3450d4] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
          : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen">

      {/* ── Left: form panel ─────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 py-12 bg-white overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(67,97,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(67,97,238,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Blue glow */}
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#4361EE] opacity-10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-sm"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Set a new password</h1>
            <p className="text-sm text-slate-500 mt-1">Choose something strong</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <Suspense fallback={null}>
              <ResetForm />
            </Suspense>
          </div>

          <p className="text-center text-sm text-slate-400 mt-4">
            <Link href="/login" className="hover:text-slate-600 transition-colors">
              ← Back to login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── Right: branding panel ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden lg:flex w-[480px] xl:w-[560px] flex-shrink-0 self-stretch overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/login-hero.png"
          alt="SENTER MAIL"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

    </div>
  );
}
