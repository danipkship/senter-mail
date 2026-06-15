"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* ── Left: Form panel ─────────────────────────────────────────── */}
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

        {/* Blue glow blob bottom-left */}
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#4361EE] opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#4361EE] opacity-15 rounded-full blur-2xl pointer-events-none" />

        {/* YOU GOT MAIL stamp — floating */}
        <motion.div
          initial={{ opacity: 0, rotate: -8, scale: 0.9, y: 0 }}
          animate={{ opacity: 1, rotate: -8, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 0.8, duration: 0.5 },
            scale: { delay: 0.8, duration: 0.5 },
            y: { delay: 1.4, duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-10 left-8 border-[3px] border-slate-800 px-3 py-1.5 rotate-[-8deg] select-none shadow-md"
        >
          <span className="text-slate-800 font-black text-sm tracking-widest uppercase">
            You Got Mail
          </span>
        </motion.div>

        {/* Smiley — floating */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { delay: 1, duration: 0.4 },
            scale: { delay: 1, duration: 0.4, type: "spring" },
            y: { delay: 1.6, duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-12 right-12 w-10 h-10 rounded-full border-2 border-slate-400 flex items-center justify-center select-none"
        >
          <span className="text-slate-400 text-base leading-none">:)</span>
        </motion.div>

        {/* !! badge — floating */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: 1.1, duration: 0.4 },
            x: { delay: 1.1, duration: 0.4 },
            y: { delay: 1.8, duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-20 right-10 border-[3px] border-slate-800 px-3 py-1.5 rotate-[4deg] select-none shadow-md"
        >
          <span className="text-slate-800 font-black text-sm tracking-widest">!!</span>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Mobile logo — only visible on small screens */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <Image src="/2.png" alt="SENTER MAIL" width={48} height={48} className="mb-3" />
            <h1 className="text-xl font-bold text-slate-900">senter mail</h1>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to your store dashboard</p>
          </div>

          <LoginForm light />
        </motion.div>
      </div>

      {/* ── Right: Branding panel ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden lg:flex w-[480px] xl:w-[560px] flex-shrink-0 self-stretch overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/login-hero.png"
          alt="SENTER MAIL — The CRM for Pack and Ship"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>
    </div>
  );
}
