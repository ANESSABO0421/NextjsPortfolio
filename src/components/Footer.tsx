"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import gsap from "gsap";

export default function Footer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  // Setup HLS background video loop (inverted vertically)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true,
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  // Setup GSAP Marquee animation
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const ctx = gsap.context(() => {
      gsap.to(".marquee-content", {
        xPercent: -50,
        ease: "none",
        duration: 25,
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  const marqueeText = Array(10).fill("BUILDING THE FUTURE • ").join("");

  return (
    <footer className="relative w-full bg-bg pt-24 md:pt-36 pb-8 md:pb-12 overflow-hidden border-t border-stroke/40">
      {/* Background Video (scale-y-[-1] to flip vertically) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Dark overlay (heavier bg-black/60) */}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* GSAP Marquee */}
        <div
          ref={marqueeRef}
          className="w-full overflow-hidden select-none pointer-events-none mb-16 md:mb-24 flex border-y border-stroke/20 py-4 bg-black/20 backdrop-blur-sm"
        >
          <div className="flex whitespace-nowrap text-3xl md:text-5xl lg:text-6xl font-display italic uppercase tracking-widest text-text-primary/20 marquee-content">
            <span className="px-4">{marqueeText}</span>
            <span className="px-4">{marqueeText}</span>
          </div>
        </div>

        {/* CTA Contact Section */}
        <div className="flex flex-col items-center px-6 text-center max-w-2xl mb-20 md:mb-32">
          <span className="text-[10px] text-muted uppercase tracking-[0.3em] font-semibold mb-4">
            LET'S WORK TOGETHER
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display italic font-light text-text-primary mb-8 tracking-tight">
            Start a new <span className="text-transparent bg-clip-text accent-gradient font-semibold">conversation</span>
          </h2>
          
          {/* Email button with gradient hover border ring */}
          <a
            href="mailto:hello@michaelsmith.com"
            className="group relative rounded-full text-base font-medium px-10 py-5 bg-text-primary text-bg transition-all duration-300 hover:scale-105 hover:bg-transparent hover:text-text-primary overflow-hidden cursor-pointer"
          >
            {/* Gradient border on hover */}
            <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            hello@michaelsmith.com
          </a>
        </div>

        {/* Bottom Footer Bar */}
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-stroke/20">
          
          {/* Availability Status */}
          <div className="flex items-center gap-3 order-2 md:order-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-muted font-medium">
              Available for projects
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 order-1 md:order-2">
            {[
              { name: "Twitter", url: "https://twitter.com" },
              { name: "LinkedIn", url: "https://linkedin.com" },
              { name: "Dribbble", url: "https://dribbble.com" },
              { name: "GitHub", url: "https://github.com" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted hover:text-text-primary hover:underline underline-offset-4 transition-colors duration-200"
              >
                {social.name}
              </a>
            ))}
          </div>
          
          {/* Copyright label */}
          <div className="text-[10px] text-muted/60 order-3 font-mono">
            © 2026 MS. All Rights Reserved.
          </div>

        </div>

      </div>
    </footer>
  );
}
