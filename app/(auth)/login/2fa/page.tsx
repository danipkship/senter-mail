"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function TwoFactorForm() {
  const searchParams   = useSearchParams();
  const router         = useRouter();
  const challengeToken = searchParams.get("challenge") ?? "";

  const [code, setCode]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Pass the challenge token + TOTP code directly to authorize() —
    // password is NOT required again because it was already validated.
    const result = await signIn("credentials", {
      challengeToken,
      totpCode: code,
      redirect: false,
    });

    if (result?.error) {
      const errCode = result.code ?? "";
      if (errCode === "INVALID_2FA_CODE") {
        setError("Invalid code. Please try again.");
      } else {
        setError("Session expired. Please sign in again.");
      }
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src="/2.png" alt="SENTER MAIL" width={48} height={48} className="mb-3" />
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-[#4361EE]" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Two-Factor Authentication</h1>
          <p className="text-sm text-slate-500 mt-1 text-center">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={8}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            required
            autoFocus
            className="w-full text-center text-3xl font-mono tracking-widest border border-slate-200 rounded-xl h-16 focus:outline-none focus:ring-2 focus:ring-[#4361EE] focus:border-transparent"
          />

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full bg-[#4361EE] hover:bg-[#3450d4] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Verify"}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Lost your authenticator?{" "}
            <span className="text-slate-500">Use one of your backup codes instead.</span>
          </p>
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          <Link href="/login" className="hover:text-slate-600 transition-colors">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default function TwoFactorPage() {
  return (
    <Suspense fallback={null}>
      <TwoFactorForm />
    </Suspense>
  );
}
