"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MailOpen, Users, Bell, History } from "lucide-react";

const TOTAL_FRAMES = 120;

const FEATURES = [
  {
    range: [0.18, 0.42] as [number, number],
    icon: MailOpen,
    color: "#4361EE",
    bg: "#EEF1FD",
    title: "Mail & Package Alerts",
    desc: "Notify customers the moment their mail or package arrives — via email or SMS, instantly.",
  },
  {
    range: [0.40, 0.62] as [number, number],
    icon: Users,
    color: "#7c3aed",
    bg: "#F5F0FF",
    title: "Customer Management",
    desc: "Full customer profiles with mailbox numbers, contact info, and subscription dates.",
  },
  {
    range: [0.60, 0.82] as [number, number],
    icon: Bell,
    color: "#0891b2",
    bg: "#ECFEFF",
    title: "Renewal Reminders",
    desc: "Automatic reminders before subscriptions expire so you never lose a customer.",
  },
  {
    range: [0.80, 1.00] as [number, number],
    icon: History,
    color: "#047857",
    bg: "#ECFDF5",
    title: "Notification History",
    desc: "Complete log of every notification sent — searchable, filterable, always accurate.",
  },
];

function clamp(v: number, min = 0, max = 1) {
  return Math.min(Math.max(v, min), max);
}

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t: number)  { return t * t * t; }

function cardOpacity(progress: number, [start, end]: [number, number]) {
  const span  = end - start;
  const local = progress - start;
  if (local <= 0 || local >= span) return 0;
  const fade = span * 0.22;
  if (local < fade) return easeOut(local / fade);
  if (local > span - fade) return 1 - easeIn((local - (span - fade)) / fade);
  return 1;
}

export function ScrollVideoHero() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const heroRef         = useRef<HTMLDivElement>(null);
  const featureRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    function drawFrame(idx: number) {
      const img = images[idx];
      if (!img?.complete || !canvas) return;
      const { width, height } = canvas;
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx!.clearRect(0, 0, width, height);
      ctx!.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
    }

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    }

    function onScroll() {
      if (!container) return;
      const rect     = container.getBoundingClientRect();
      const total    = container.offsetHeight - window.innerHeight;
      const progress = clamp(-rect.top / total);

      // Video frame
      const fi = Math.min(Math.floor(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
      if (fi !== currentFrameRef.current) {
        currentFrameRef.current = fi;
        drawFrame(fi);
      }

      // Hero card — fades out first
      if (heroRef.current) {
        const op = clamp(1 - progress / 0.16);
        heroRef.current.style.opacity   = String(op);
        heroRef.current.style.transform = `translateY(${-progress * 50}px)`;
      }

      // Feature cards — each fades in/out at its range
      FEATURES.forEach((f, i) => {
        const el = featureRefs.current[i];
        if (!el) return;
        const op    = cardOpacity(progress, f.range);
        const local = clamp((progress - f.range[0]) / (f.range[1] - f.range[0]));
        const enterT = clamp(local / 0.2);
        const ty = (1 - easeOut(enterT)) * 32;
        el.style.opacity   = String(op);
        el.style.transform = `translateY(${ty}px)`;
      });
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = `/hero-frames/frame${String(i + 1).padStart(4, "0")}.jpg`;
      img.onload = () => {
        images[i] = img;
        if (i === 0) drawFrame(0);
        if (i === currentFrameRef.current) drawFrame(i);
      };
      images[i] = img;
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const CARD_CLASS = "bg-white/60 backdrop-blur-sm rounded-3xl px-10 py-10 max-w-xl w-full shadow-xl shadow-blue-100/40 border border-white/80";

  return (
    <div ref={containerRef} className="relative h-[550vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#e8f0fc]">

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15 pointer-events-none" />

        {/* ── NAV ──────────────────────────────────────────────────────── */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-16 h-[72px]">
          <div className="flex items-center gap-2.5">
            <Image src="/2.png" alt="SENTER MAIL" width={36} height={36} priority />
            <span className="text-[17px] font-bold text-[#0D1B4B] tracking-tight">
              senter <span className="text-[#4361EE]">mail</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3450d4] transition-colors shadow-lg shadow-blue-300/50">
              Get Started →
            </Link>
          </div>
        </nav>

        {/* Shared card position */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none">

          {/* ── HERO CARD ─────────────────────────────────────────────── */}
          <div
            ref={heroRef}
            className={`absolute text-center ${CARD_CLASS}`}
            style={{ willChange: "opacity, transform", pointerEvents: "auto" }}
          >
            <h1 className="font-black leading-[0.92] tracking-tight text-[#0D1B4B] mb-5"
              style={{ fontSize: "clamp(38px, 5.5vw, 72px)" }}>
              The CRM for<br />
              <span style={{
                background: "linear-gradient(125deg, #4361EE 0%, #6366f1 60%, #818cf8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Pack &amp; Ship
              </span>
            </h1>
            <p className="text-slate-500 leading-relaxed mb-8 max-w-sm mx-auto text-sm md:text-base">
              Manage mailbox customers, send instant alerts, and keep subscriptions on track.
            </p>
            <div className="flex gap-3 flex-wrap justify-center mb-4">
              <Link href="/register" className="text-sm font-bold text-white px-7 py-3.5 rounded-xl transition-all"
                style={{ background: "linear-gradient(135deg, #4361EE 0%, #6366f1 100%)", boxShadow: "0 8px 28px rgba(67,97,238,0.40)" }}>
                Start free trial →
              </Link>
              <Link href="/login" className="text-sm font-semibold text-slate-600 px-7 py-3.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-white transition-all">
                Sign in
              </Link>
            </div>
            <p className="text-xs text-slate-400 tracking-wide">No setup fees &nbsp;·&nbsp; Cancel anytime</p>
          </div>

          {/* ── FEATURE CARDS ─────────────────────────────────────────── */}
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                ref={(el) => { featureRefs.current[i] = el; }}
                className={`absolute text-center ${CARD_CLASS}`}
                style={{ opacity: 0, transform: "translateY(32px)", willChange: "opacity, transform" }}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: f.bg }}>
                    <Icon className="w-7 h-7" style={{ color: f.color }} />
                  </div>
                </div>

                {/* Title */}
                <h2 className="font-black leading-tight tracking-tight text-[#0D1B4B] mb-4"
                  style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
                  {f.title}
                </h2>

                {/* Desc */}
                <p className="text-slate-500 leading-relaxed max-w-sm mx-auto text-sm md:text-base">
                  {f.desc}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
