"use client";

import { useEffect, useRef } from "react";

export function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Load without autoplay
    video.pause();
    video.currentTime = 0;

    function onScroll() {
      if (!video || !container) return;
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;

      // progress: 0 when container top hits viewport bottom, 1 when container bottom hits viewport top
      const total = rect.height + windowH;
      const elapsed = windowH - rect.top;
      const progress = Math.min(Math.max(elapsed / total, 0), 1);

      if (video.duration) {
        video.currentTime = progress * video.duration;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      {/* Sticky video wrapper */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-[#0D1B4B]">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B4B] via-transparent to-[#0D1B4B] pointer-events-none z-10" />

        <video
          ref={videoRef}
          src="/demo.mp4"
          muted
          playsInline
          preload="auto"
          className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl shadow-blue-900/50 relative z-0"
          style={{ aspectRatio: "16/9", objectFit: "cover" }}
        />

        {/* Scroll hint — fades as user scrolls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 text-xs animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Scroll to play
        </div>
      </div>
    </div>
  );
}
