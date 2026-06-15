"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email }),
    });

    setLoading(false);
    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-xl font-bold text-slate-900">Forgot your password?</h1>
          <p className="text-sm text-slate-500 mt-1 text-center">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-3"
              >
                <div className="flex justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <p className="font-semibold text-slate-800">Check your inbox</p>
                <p className="text-sm text-slate-500">
                  If <span className="font-medium text-slate-700">{email}</span> is registered,
                  you&apos;ll receive a reset link shortly.
                </p>
                <p className="text-xs text-slate-400 pt-2">
                  Didn&apos;t get it? Check your spam folder or{" "}
                  <button onClick={() => setSent(false)} className="text-[#4361EE] hover:underline">
                    try again
                  </button>.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
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
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send reset link"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-slate-400 mt-4">
          <Link href="/login" className="flex items-center justify-center gap-1.5 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
