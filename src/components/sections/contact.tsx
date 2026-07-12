"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/components/ui/magnetic";
import { ArrowUpRight } from "lucide-react";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [londonTime, setLondonTime] = useState("");

  // 1. Live London Clock for premium detail
  useEffect(() => {
    const updateTime = () => {
      const formatted = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setLondonTime(formatted + " GMT+1");
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Entrance parallax scroll triggers
  useGSAP(
    () => {
      gsap.fromTo(
        ".contact-slide-in",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <footer
      id="contact"
      ref={containerRef}
      className="relative min-h-[90vh] w-full bg-[#0c0c0d] pt-24 pb-12 text-white flex flex-col justify-between overflow-hidden"
    >
      {/* Dynamic background glow */}
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[#c9fd34]/2 blur-[150px] pointer-events-none" />

      <div className="px-6 sm:px-12 md:px-24 max-w-7xl mx-auto w-full flex flex-col gap-16 relative z-10">
        
        {/* Core CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9fd34]" />
              Get In Touch
            </span>
            <h2 className="font-heading text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight uppercase leading-none">
              Let&apos;s Work <br />
              <span className="text-zinc-600">Together.</span>
            </h2>
          </div>

          {/* Huge Magnetic Circular CTA Button */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Magnetic actionStrength={0.35} hoverAreaPadding="p-0">
              <a
                href="mailto:hello@anessabo.dev"
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-[#c9fd34] text-black flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300 font-heading tracking-widest text-xs font-extrabold uppercase shadow-2xl"
              >
                <div className="relative overflow-hidden flex h-4">
                  <span className="inline-block transition-transform duration-300 hover:-translate-y-full">
                    Start Project
                  </span>
                </div>
                <ArrowUpRight className="w-5 h-5 animate-pulse" />
              </a>
            </Magnetic>
          </div>

        </div>

        {/* Contact details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-16 border-t border-zinc-900 mt-8">
          <div className="contact-slide-in flex flex-col gap-2">
            <span className="text-zinc-600 uppercase text-[10px] tracking-widest">Email</span>
            <a
              href="mailto:hello@anessabo.dev"
              className="text-lg font-light hover:text-[#c9fd34] transition-colors duration-200"
            >
              hello@anessabo.dev
            </a>
          </div>
          <div className="contact-slide-in flex flex-col gap-2">
            <span className="text-zinc-600 uppercase text-[10px] tracking-widest">Phone</span>
            <a
              href="tel:+447700900077"
              className="text-lg font-light hover:text-[#c9fd34] transition-colors duration-200"
            >
              +44 (0) 7700 900077
            </a>
          </div>
          <div className="contact-slide-in flex flex-col gap-2">
            <span className="text-zinc-600 uppercase text-[10px] tracking-widest">Socials</span>
            <div className="flex gap-4 text-sm font-light text-zinc-300">
              <Magnetic actionStrength={0.2} hoverAreaPadding="px-2 py-1">
                <a href="https://linkedin.com" target="_blank" className="hover:text-[#c9fd34] transition-colors">LinkedIn</a>
              </Magnetic>
              <Magnetic actionStrength={0.2} hoverAreaPadding="px-2 py-1">
                <a href="https://github.com" target="_blank" className="hover:text-[#c9fd34] transition-colors">GitHub</a>
              </Magnetic>
              <Magnetic actionStrength={0.2} hoverAreaPadding="px-2 py-1">
                <a href="https://dribbble.com" target="_blank" className="hover:text-[#c9fd34] transition-colors">Dribbble</a>
              </Magnetic>
            </div>
          </div>
        </div>

      </div>

      {/* Footer bar with legal notes & clock */}
      <div className="px-6 sm:px-12 md:px-24 max-w-7xl mx-auto w-full border-t border-zinc-900 pt-8 mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-zinc-600 relative z-10">
        <div className="flex items-center gap-6">
          <span>© 2026 Anessa Bo. All Rights Reserved.</span>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9fd34] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9fd34]"></span>
          </span>
          <span>London, UK:</span>
          <span className="font-mono text-zinc-400 font-semibold">{londonTime || "00:00:00 GMT+1"}</span>
        </div>
      </div>
    </footer>
  );
}
