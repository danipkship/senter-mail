"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";

type Billing = "monthly" | "annual";

export function PricingSection() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const isAnnual = billing === "annual";

  return (
    <section className="py-16 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Top: image left + header right ─────────────────────────────── */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-center mb-10">

          {/* Left: floating analytics screenshot */}
          <div className="flex items-center justify-center">
            <Image
              src="/para%20landing%202%20.png"
              alt="Customer analytics"
              width={1400}
              height={788}
              className="w-full h-auto"
              style={{
                animation: "float-ccw 6s ease-in-out infinite",
                filter: "drop-shadow(0 48px 96px rgba(15,30,90,0.15)) drop-shadow(0 12px 28px rgba(0,0,0,0.09))",
              }}
            />
          </div>

          {/* Right: title, subtitle, toggle */}
          <div className="flex flex-col justify-center">
            <span className="inline-block text-xs font-bold tracking-widest text-[#4361EE] uppercase bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-5 w-fit">
              Pricing
            </span>
            <h2 className="text-4xl font-bold text-[#0D1B4B] mb-4 leading-tight">
              Simple,<br />transparent pricing
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-sm">
              Pick the plan that fits your store. No hidden fees — upgrade or cancel anytime.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  !isAnnual
                    ? "bg-white text-[#0D1B4B] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  isAnnual
                    ? "bg-white text-[#0D1B4B] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Annual
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>

            {isAnnual && (
              <p className="text-sm text-slate-400 mt-4">
                Save up to{" "}
                <span className="text-emerald-600 font-semibold">$108/year</span>{" "}
                on the Business plan.
              </p>
            )}
          </div>
        </div>

        {/* ── Pricing cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
            const isPro     = key === "PRO";
            const price     = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const hasTrial  = isPro && plan.trial > 0;

            return (
              <div
                key={key}
                className={`relative rounded-2xl border p-8 flex flex-col transition-all ${
                  isPro
                    ? "border-[#4361EE] bg-[#4361EE] text-white shadow-xl shadow-blue-200"
                    : "border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 duration-200"
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0D1B4B] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}
                {hasTrial && (
                  <div className={`absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-full ${
                    isPro ? "bg-white/20 text-white" : "bg-blue-50 text-[#4361EE]"
                  }`}>
                    30-day free trial
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-lg font-bold mb-1 ${isPro ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${isPro ? "text-blue-100" : "text-slate-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-1">
                  <span className={`text-4xl font-bold ${isPro ? "text-white" : "text-[#0D1B4B]"}`}>
                    ${price.toFixed(2)}
                  </span>
                  <span className={`text-sm ml-1 ${isPro ? "text-blue-100" : "text-slate-400"}`}>/month</span>
                </div>
                <p className={`text-xs mb-6 ${isPro ? "text-blue-100" : "text-slate-400"}`}>
                  {isAnnual ? `Billed annually — $${plan.annualTotal.toFixed(2)}/year` : "Billed monthly"}
                </p>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isPro ? "text-blue-200" : "text-[#4361EE]"}`} />
                      <span className={isPro ? "text-blue-50" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/register?plan=${key.toLowerCase()}&billing=${billing}`}
                  className={`w-full text-center font-semibold py-3 rounded-lg text-sm transition-colors ${
                    isPro
                      ? "bg-white text-[#4361EE] hover:bg-blue-50"
                      : "bg-[#4361EE] text-white hover:bg-[#3450d4] shadow-sm"
                  }`}
                >
                  {hasTrial ? "Start free trial" : "Get started"}
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
