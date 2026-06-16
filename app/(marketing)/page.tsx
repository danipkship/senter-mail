import Link from "next/link";
import Image from "next/image";
import { MailOpen, Users, Bell, History } from "lucide-react";
import { ScrollVideoHero } from "@/components/marketing/scroll-video-hero";
import { PricingSection } from "@/components/marketing/pricing-section";

const FEATURES = [
  {
    icon: MailOpen,
    color: "#4361EE",
    bg: "#EEF1FD",
    title: "Mail & Package Alerts",
    desc: "Notify customers the moment their mail or package arrives — via email or SMS, instantly.",
  },
  {
    icon: Users,
    color: "#7c3aed",
    bg: "#F5F0FF",
    title: "Customer Management",
    desc: "Full customer profiles with mailbox numbers, contact info, and subscription dates.",
  },
  {
    icon: Bell,
    color: "#0891b2",
    bg: "#ECFEFF",
    title: "Renewal Reminders",
    desc: "Automatic reminders before subscriptions expire so you never lose a customer.",
  },
  {
    icon: History,
    color: "#047857",
    bg: "#ECFDF5",
    title: "Notification History",
    desc: "Complete log of every notification sent — searchable, filterable, always accurate.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollVideoHero />

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0D1B4B] tracking-tight mb-4">
              Everything your store needs
            </h2>
            <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
              One platform to manage customers, send notifications, and never miss a renewal.
            </p>
          </div>

          {/* Dashboard preview */}
          <div className="flex justify-center mb-16">
            <Image
              src="/para%20landing.png"
              alt="Dashboard overview"
              width={1600}
              height={900}
              className="w-full h-auto"
              style={{
                animation: "float-cw 5s ease-in-out infinite",
                filter: "drop-shadow(0 48px 96px rgba(15,30,90,0.18)) drop-shadow(0 12px 28px rgba(0,0,0,0.10))",
              }}
            />
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group bg-white border border-slate-100 rounded-2xl p-6 hover:border-blue-100 hover:shadow-md transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: f.bg }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0D1B4B]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to modernize your mailbox center?
          </h2>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Join mailbox centers already using SENTER MAIL to manage customers and send instant notifications.
          </p>
          <Link
            href="/register?plan=pro"
            className="inline-block bg-[#4361EE] hover:bg-[#5272f0] text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-blue-900/30 text-sm"
          >
            Start your 30-day free trial →
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/2.png" alt="SENTER MAIL" width={22} height={22} />
            <span className="text-sm text-slate-400">© 2026 SENTER MAIL. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/login" className="hover:text-slate-600 transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-slate-600 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
