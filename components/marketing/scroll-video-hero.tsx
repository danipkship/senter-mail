"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const TOTAL_FRAMES = 240;

const FEATURES = [
  {
    range: [0.12, 0.38] as [number, number],
    num: "01",
    tag: "Notifications",
    title: ["Instant", "Mail Alerts"],
    desc: "The moment mail or a package arrives, your customer gets notified — via email or SMS, instantly.",
    accent: "#818cf8",
  },
  {
    range: [0.36, 0.62] as [number, number],
    num: "02",
    tag: "CRM",
    title: ["Customer", "Management"],
    desc: "Every mailbox, every subscription, every contact — organized and always up to date.",
    accent: "#67e8f9",
  },
  {
    range: [0.60, 0.84] as [number, number],
    num: "03",
    tag: "Automation",
    title: ["Renewal", "Reminders"],
    desc: "Never lose a customer to an expired subscription. Reminders go out before they think to leave.",
    accent: "#d8b4fe",
  },
  {
    range: [0.82, 1.0] as [number, number],
    num: "04",
    tag: "Analytics",
    title: ["Notification", "History"],
    desc: "Every message ever sent — logged, searchable, and always accurate.",
    accent: "#6ee7b7",
  },
];

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t: number)  { return t * t * t; }
function clamp(v: number, min = 0, max = 1) { return Math.min(Math.max(v, min), max); }

function featureOpacity(progress: number, [start, end]: [number, number]) {
  const span = end - start;
  const local = progress - start;
  if (local <= 0 || local >= span) return 0;
  const fade = span * 0.15;
  if (local < fade) return easeOut(local / fade);
  if (local > span - fade) return 1 - easeIn((local - (span - fade)) / fade);
  return 1;
}

export function ScrollVideoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);

  const heroRef           = useRef<HTMLDivElement>(null);
  // Each feature has an INNER animated div (separate from the positioning outer)
  const featureRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef    = useRef<HTMLDivElement>(null);
  const progressFillRef   = useRef<HTMLDivElement>(null);
  const progressLabelsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scrollHintRef     = useRef<HTMLDivElement>(null);

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

      // ── video frame ──
      const fi = Math.min(Math.floor(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
      if (fi !== currentFrameRef.current) { currentFrameRef.current = fi; drawFrame(fi); }

      // ── hero: fade + drift up 0→13% ──
      if (heroRef.current) {
        heroRef.current.style.opacity   = String(clamp(1 - progress / 0.13));
        heroRef.current.style.transform = `translateY(${-progress * 56}px)`;
      }

      // ── scroll hint: gone by 5% ──
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(clamp(1 - progress / 0.05));
      }

      // ── feature panels ──
      // Note: featureRefs point to the INNER animated div.
      // The outer div handles static vertical centering via transform: translateY(-50%),
      // so JS only controls opacity + a small enter animation on the inner div.
      let activeIndex = -1;
      FEATURES.forEach((f, i) => {
        const inner = featureRefs.current[i];
        if (!inner) return;
        const op = featureOpacity(progress, f.range);
        const local = clamp((progress - f.range[0]) / (f.range[1] - f.range[0]));
        // Only add enter offset (slide up on entry), not exit — stays in place then fades
        const enterProgress = clamp(local / 0.18);
        const ty = (1 - easeOut(enterProgress)) * 40;
        inner.style.opacity   = String(op);
        inner.style.transform = `translateY(${ty}px)`;
        if (op > 0.35) activeIndex = i;
      });

      // ── progress bar ──
      if (progressBarRef.current && progressFillRef.current) {
        progressBarRef.current.style.opacity = progress > 0.09 ? "1" : "0";

        let activeFeature = -1;
        let localPct = 0;
        for (let i = 0; i < FEATURES.length; i++) {
          const [s, e] = FEATURES[i].range;
          if (progress >= s - 0.02 && progress <= e) {
            activeFeature = i; localPct = clamp((progress - s) / (e - s)); break;
          }
          if (progress > e) { activeFeature = i; localPct = 1; }
        }
        const seg      = 100 / FEATURES.length;
        const totalPct = activeFeature >= 0 ? (activeFeature * seg) + localPct * seg : 0;
        progressFillRef.current.style.width      = `${totalPct}%`;
        progressFillRef.current.style.background = activeFeature >= 0 ? FEATURES[activeFeature].accent : "#4361EE";

        progressLabelsRef.current.forEach((lbl, i) => {
          if (!lbl) return;
          const on = i === activeIndex;
          lbl.style.color      = on ? FEATURES[i].accent : "rgba(255,255,255,0.25)";
          lbl.style.fontWeight = on ? "700" : "500";
        });
      }
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = `/frames/frame${String(i + 1).padStart(4, "0")}.jpg`;
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

  // ─────────────────────────────────────────────────────────────────────────
  // Shared layout constants
  const PAD_X = "clamp(40px, 7vw, 100px)";

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* ── Overlays ────────────────────────────────────────── */}

        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.20) 40%, rgba(0,0,0,0.55) 100%)",
        }} />

        {/* ── NAV ─────────────────────────────────────────────── */}
        <nav
          className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between"
          style={{ height: "72px", paddingLeft: PAD_X, paddingRight: PAD_X }}
        >
          <div className="flex items-center gap-2.5">
            <Image src="/2.png" alt="SENTER MAIL" width={36} height={36} />
            <span style={{ fontSize: "17px", fontWeight: 700, color: "#fff", letterSpacing: "-0.015em" }}>
              senter <span style={{ color: "#4361EE" }}>mail</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.65)" }}
              className="hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/register" style={{
              fontSize: "13px", fontWeight: 600, color: "#fff",
              padding: "9px 22px", borderRadius: "10px",
              background: "#4361EE",
              boxShadow: "0 4px 20px rgba(67,97,238,0.42)",
            }}>
              Get Started →
            </Link>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────── */}
        {/* pointer-events:none on wrapper, auto on buttons only */}
        <div
          ref={heroRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10"
          style={{ paddingTop: "72px", paddingLeft: "24px", paddingRight: "24px", willChange: "opacity, transform" }}
        >
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center",
            background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.20)",
            borderRadius: "999px", padding: "5px 16px", marginBottom: "28px",
          }}>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.13em", color: "rgba(255,255,255,0.75)", textTransform: "uppercase" }}>
              Built for Pack &amp; Ship Stores
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(48px, 7.5vw, 90px)",
            fontWeight: 900,
            lineHeight: 0.93,
            letterSpacing: "-0.032em",
            color: "#fff",
            maxWidth: "800px",
            marginBottom: "22px",
          }}>
            The CRM for<br />
            <span style={{
              background: "linear-gradient(125deg, #ffffff 0%, #bfdbfe 45%, #4361EE 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Pack &amp; Ship
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "clamp(15px, 1.4vw, 18px)",
            color: "rgba(255,255,255,0.65)",
            maxWidth: "440px",
            lineHeight: 1.6,
            marginBottom: "36px",
          }}>
            Manage mailbox customers, send instant alerts, and keep subscriptions on track.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 flex-wrap justify-center" style={{ pointerEvents: "auto" }}>
            <Link href="/register" style={{
              fontSize: "14px", fontWeight: 700, color: "#fff",
              padding: "14px 30px", borderRadius: "12px", textDecoration: "none",
              background: "linear-gradient(135deg, #4361EE 0%, #6366f1 100%)",
              boxShadow: "0 8px 28px rgba(67,97,238,0.48)",
            }}>
              Start free trial →
            </Link>
            <Link href="/login" style={{
              fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.80)",
              padding: "14px 26px", borderRadius: "12px", textDecoration: "none",
              background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.20)",
            }}>
              Sign in
            </Link>
          </div>

          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "16px", letterSpacing: "0.05em" }}>
            No setup fees &nbsp;·&nbsp; Cancel anytime
          </p>
        </div>

        {/* ── FEATURE PANELS ───────────────────────────────────── */}
        {/*
          TWO-LAYER PATTERN:
          - Outer div:  static absolute positioning (left + top 50%) with transform:translateY(-50%)
                        for vertical centering. JS never touches this.
          - Inner div:  holds the ref. JS only sets opacity + a small enter translateY.
        */}
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="absolute pointer-events-none z-10"
            style={{
              left: PAD_X,
              top: "52%",
              transform: "translateY(-50%)",
              width: "min(580px, 60vw)",
            }}
          >
            {/* Inner — animated by JS */}
            <div
              ref={(el) => { featureRefs.current[i] = el; }}
              style={{ opacity: 0, transform: "translateY(40px)", willChange: "opacity, transform" }}
            >
              {/* Tag row */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <div style={{ width: "24px", height: "2px", borderRadius: "2px", background: f.accent }} />
                <span style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em",
                  textTransform: "uppercase", color: f.accent,
                }}>
                  {f.tag}
                </span>
              </div>

              {/* Title block with watermark number */}
              <div style={{ position: "relative", marginBottom: "18px" }}>
                {/* Watermark */}
                <span style={{
                  position: "absolute",
                  top: "-22px",
                  left: "-4px",
                  fontSize: "clamp(88px, 14vw, 160px)",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.06em",
                  color: "rgba(255,255,255,0.04)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}>
                  {f.num}
                </span>

                {/* Title */}
                <h2 style={{
                  position: "relative", zIndex: 1,
                  fontWeight: 900,
                  lineHeight: 0.92,
                  letterSpacing: "-0.03em",
                  fontSize: "clamp(36px, 5.2vw, 66px)",
                }}>
                  <span style={{ display: "block", color: "#ffffff" }}>{f.title[0]}</span>
                  <span style={{
                    display: "block",
                    background: `linear-gradient(115deg, #ffffff 0%, ${f.accent} 100%)`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    {f.title[1]}
                  </span>
                </h2>
              </div>

              {/* Accent rule */}
              <div style={{ width: "36px", height: "2px", borderRadius: "2px", background: f.accent, opacity: 0.55, marginBottom: "16px" }} />

              {/* Description */}
              <p style={{
                fontSize: "clamp(14px, 1.25vw, 16px)",
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.70,
                maxWidth: "360px",
              }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}

        {/* ── PROGRESS BAR ─────────────────────────────────────── */}
        <div
          ref={progressBarRef}
          className="absolute left-0 right-0 z-20"
          style={{ bottom: "14px", opacity: 0, transition: "opacity 0.5s ease" }}
        >
          {/* Labels */}
          <div style={{
            display: "flex",
            paddingLeft: PAD_X, paddingRight: PAD_X,
            marginBottom: "8px",
          }}>
            {FEATURES.map((f, i) => (
              <span
                key={i}
                ref={(el) => { progressLabelsRef.current[i] = el; }}
                style={{
                  flex: 1, textAlign: "center",
                  fontSize: "9px", fontWeight: 500,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.25)",
                  transition: "color 0.3s ease, font-weight 0.3s ease",
                }}
              >
                {f.tag}
              </span>
            ))}
          </div>

          {/* Track — full width, edge to edge */}
          <div style={{ height: "2px", background: "rgba(255,255,255,0.10)" }}>
            <div
              ref={progressFillRef}
              style={{
                height: "100%", width: "0%",
                background: "#4361EE",
                transition: "width 0.04s linear, background 0.35s ease",
                borderRadius: "0 2px 2px 0",
              }}
            />
          </div>
        </div>

        {/* ── SCROLL HINT ──────────────────────────────────────── */}
        <div
          ref={scrollHintRef}
          className="absolute z-10"
          style={{
            bottom: "52px", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "5px",
            color: "rgba(255,255,255,0.30)",
            animation: "bounce 2s infinite",
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
          <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Scroll
          </span>
        </div>

      </div>
    </div>
  );
}
