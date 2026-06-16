"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const planParam   = (searchParams.get("plan") ?? "starter").toUpperCase();
  const billingParam = (searchParams.get("billing") ?? "monthly") as "monthly" | "annual";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      storeName: form.get("storeName") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      plan: planParam.toLowerCase(),
      billing: billingParam,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  const planLabels: Record<string, { name: string; monthly: string; annual: string; trial?: boolean }> = {
    STARTER:  { name: "Starter",  monthly: "$9.99/mo",  annual: "$7.99/mo (billed annually)"  },
    PRO:      { name: "Pro",      monthly: "$24.99/mo", annual: "$19.99/mo (billed annually)", trial: true },
    BUSINESS: { name: "Business", monthly: "$45.99/mo", annual: "$36.99/mo (billed annually)" },
  };
  const plan = planLabels[planParam] ?? planLabels.STARTER;
  const priceLabel = billingParam === "annual" ? plan.annual : plan.monthly;

  return (
    <div className="flex min-h-screen">
      {/* Left: Form */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 py-12 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(67,97,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(67,97,238,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#4361EE] opacity-10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-sm"
        >
          <div className="flex flex-col items-center mb-6 lg:hidden">
            <Image src="/2.png" alt="SENTER MAIL" width={44} height={44} className="mb-2" />
            <span className="font-bold text-slate-900">senter mail</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Create your store</h2>
            <p className="text-sm text-slate-500 mt-1">
              Selected plan:{" "}
              <span className="font-semibold text-[#4361EE]">{plan.name} — {priceLabel}</span>
            </p>
            {plan.trial && planParam === "PRO" && (
              <p className="text-xs text-emerald-600 font-medium mt-1">30-day free trial included</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="storeName" className="text-slate-700 text-sm font-medium">Store name</Label>
              <Input id="storeName" name="storeName" type="text" placeholder="Go Pack & Ship"
                required className="bg-white border-slate-200 h-11 focus-visible:ring-[#4361EE]" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 text-sm font-medium">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@yourstore.com"
                required autoComplete="email"
                className="bg-white border-slate-200 h-11 focus-visible:ring-[#4361EE]" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-700 text-sm font-medium">Password</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters" required minLength={8}
                  className="bg-white border-slate-200 h-11 focus-visible:ring-[#4361EE] pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" disabled={loading}
              className="w-full bg-[#4361EE] hover:bg-[#3450d4] text-white font-semibold h-11 shadow-md shadow-blue-200">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating your store...
                </span>
              ) : "Continue to payment →"}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#4361EE] font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Hero */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden lg:flex w-[480px] xl:w-[560px] flex-shrink-0 self-stretch overflow-hidden"
      >
        <img src="/login-hero.png" alt="SENTER MAIL"
          className="w-full h-full object-cover object-center" />
      </motion.div>
    </div>
  );
}
