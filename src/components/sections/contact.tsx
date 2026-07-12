"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/components/ui/magnetic";
import { useTransition } from "@/components/providers/transition-provider";
import { ArrowUpRight } from "lucide-react";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { transitionTo } = useTransition();
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

  // 2. Entrance triggers
  useGSAP(
    () => {
      gsap.fromTo(
        ".contact-slide-in",
        { opacity: 0, y: 30 },
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

  const handleContactTransition = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    transitionTo("/contact", "Contact");
  }, [transitionTo]);

  return (
    <footer
      id="contact"
      ref={containerRef}
      className="relative min-h-[90vh] w-full bg-[#0c0c0d] pt-28 pb-10 text-white flex flex-col justify-between overflow-hidden"
    >
      {/* Background glow atmospheric overlay */}
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[#3c5df6]/2 blur-[150px] pointer-events-none" />

      <div className="px-6 sm:px-12 md:px-24 max-w-7xl mx-auto w-full flex flex-col relative z-10">
        
        {/* Core CTA */}
        <div className="flex flex-col gap-6 sm:gap-8">
          
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Small portrait icon */}
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden relative border border-zinc-800 bg-zinc-900 shadow-xl">
              <Image
                src="/anees-aboo.png"
                alt="Anessa Bo"
                fill
                sizes="(max-width: 640px) 56px, 80px"
                className="object-cover object-center"
              />
            </div>
            
            <h2 className="font-heading text-4xl sm:text-7xl md:text-8xl font-bold tracking-tight uppercase leading-none text-zinc-100">
              Let&apos;s work
            </h2>
          </div>

          <h2 className="font-heading text-4xl sm:text-7xl md:text-8xl font-bold tracking-tight uppercase leading-none text-zinc-100">
            together
          </h2>
        </div>

        {/* 3. Seam dividing line with massive floating Get in Touch button */}
        <div className="relative w-full h-[1px] bg-zinc-800/80 mt-16 sm:mt-24 flex items-center justify-end">
          
          {/* Circular Magnetic button aligned directly on the line seam */}
          <div className="absolute right-0 sm:right-12 lg:right-24 z-20">
            <Magnetic actionStrength={0.35} hoverAreaPadding="p-0">
              <a
                href="/contact"
                onClick={handleContactTransition}
                className="w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-[#3c5df6] text-white flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-300 font-heading tracking-widest text-[9px] sm:text-xs font-extrabold uppercase shadow-2xl border border-white/5"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* 4. Rounded CTA Detail pills */}
        <div className="flex flex-wrap gap-4 pt-16 sm:pt-20">
          <a
            href="mailto:info@anessaboo.com"
            className="px-6 py-4 rounded-full border border-zinc-800 text-sm font-light text-zinc-400 hover:bg-white hover:text-black hover:border-transparent transition-all duration-300"
          >
            info@anessaboo.com
          </a>
          <a
            href="tel:+447700900077"
            className="px-6 py-4 rounded-full border border-zinc-800 text-sm font-light text-zinc-400 hover:bg-white hover:text-black hover:border-transparent transition-all duration-300"
          >
            +44 7700 900077
          </a>
        </div>

      </div>

      {/* 5. Footer Metadata Bottom bar (VERSION, CLOCK, SOCIALS) */}
      <div className="px-6 sm:px-12 md:px-24 max-w-7xl mx-auto w-full pt-16 mt-16 flex flex-col gap-8 text-[10px] tracking-wider uppercase font-semibold text-zinc-500 relative z-10 border-t border-zinc-900/60">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600">Version</span>
            <p className="text-zinc-400 font-medium">2026 © Edition</p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600">Local Time</span>
            <p className="text-zinc-300 font-mono font-medium">
              {londonTime || "00:00:00 GMT+1"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {["Awwwards", "Instagram", "Twitter", "LinkedIn"].map((social, index) => (
              <a
                key={index}
                href={`https://${social.toLowerCase()}.com`}
                target="_blank"
                className="hover:text-white transition-colors text-zinc-400"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
