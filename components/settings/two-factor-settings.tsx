"use client";

import { useState } from "react";
import { ShieldCheck, ShieldOff, Copy, Check, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface Props {
  enabled: boolean;
}

export function TwoFactorSettings({ enabled: initialEnabled }: Props) {
  const [enabled, setEnabled]       = useState(initialEnabled);
  const [step, setStep]             = useState<"idle" | "setup" | "backup">("idle");
  const [qrCode, setQrCode]         = useState("");
  const [secret, setSecret]         = useState("");
  const [code, setCode]             = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [copied, setCopied]         = useState(false);

  async function startSetup() {
    setLoading(true);
    setError("");
    const res  = await fetch("/api/auth/2fa/setup", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setQrCode(data.qrCode);
    setSecret(data.secret);
    setStep("setup");
  }

  async function confirmSetup() {
    setLoading(true);
    setError("");
    const res  = await fetch("/api/auth/2fa/enable", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ secret, totpCode: code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setBackupCodes(data.backupCodes);
    setEnabled(true);
    setStep("backup");
  }

  async function disableTwoFactor() {
    if (!password) return;
    setLoading(true);
    setError("");
    const res  = await fetch("/api/auth/2fa/disable", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setEnabled(false);
    setPassword("");
    setStep("idle");
  }

  function copyBackupCodes() {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (step === "setup") {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">Scan this QR code</h3>
          <p className="text-sm text-slate-500">Open Google Authenticator, Authy, or any TOTP app and scan the code below.</p>
        </div>
        {qrCode && (
          <div className="flex justify-center">
            <img src={qrCode} alt="2FA QR Code" className="w-44 h-44 rounded-xl border border-slate-100" />
          </div>
        )}
        <div>
          <p className="text-xs text-slate-400 mb-1">Or enter the key manually:</p>
          <code className="block bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono break-all text-slate-700">
            {secret}
          </code>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Enter 6-digit code to confirm</label>
          <input
            type="text" inputMode="numeric" maxLength={6} value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#4361EE]"
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={() => setStep("idle")} className="flex-1 border border-slate-200 text-slate-600 font-medium py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={confirmSetup} disabled={loading || code.length < 6}
            className="flex-1 bg-[#4361EE] text-white font-semibold py-2 rounded-lg text-sm hover:bg-[#3450d4] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Confirm
          </button>
        </div>
      </div>
    );
  }

  if (step === "backup") {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Save your backup codes</p>
            <p className="text-xs text-amber-700 mt-0.5">Each code can only be used once. Store them somewhere safe.</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-2">
          {backupCodes.map((code) => (
            <code key={code} className="text-xs font-mono text-slate-700 text-center py-1">{code}</code>
          ))}
        </div>
        <button onClick={copyBackupCodes}
          className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-600 font-medium py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">
          {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy all codes</>}
        </button>
        <button onClick={() => setStep("idle")}
          className="w-full bg-[#4361EE] text-white font-semibold py-2 rounded-lg text-sm hover:bg-[#3450d4] transition-colors">
          Done — I saved my codes
        </button>
      </div>
    );
  }

  if (enabled) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-semibold text-green-800">2FA is enabled</p>
            <p className="text-xs text-green-700">Your account is protected with two-factor authentication.</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirm your password to disable</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}
        <button onClick={disableTwoFactor} disabled={loading || !password}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold py-2 rounded-lg text-sm disabled:opacity-50 transition-colors">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldOff className="w-4 h-4" />}
          Disable 2FA
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Add a second layer of security. After entering your password, you&apos;ll need a 6-digit code from your authenticator app.
      </p>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
      <button onClick={startSetup} disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#4361EE] hover:bg-[#3450d4] text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-50 transition-colors">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
        Enable Two-Factor Authentication
      </button>
    </div>
  );
}
