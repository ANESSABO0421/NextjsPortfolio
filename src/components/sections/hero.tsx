"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/components/ui/magnetic";
import { ArrowDownRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const firstTextRef = useRef<HTMLSpanElement>(null);
  const secondTextRef = useRef<HTMLSpanElement>(null);

  // Kinetic marquee animation vars
  let xPercent = 0;
  let direction = -1;

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // 1. Entrance animation (Title sliding up from clip path)
      gsap.fromTo(
        ".hero-title-line span",
        { y: "100%" },
        {
          y: "0%",
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.2, // trigger right after preloader curve morphs out
        }
      );

      gsap.fromTo(
        ".hero-fade-in",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.8,
        }
      );

      // 2. Map scroll speed to marquee scroll direction
      gsap.to(marqueeRef.current, {
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: window.innerHeight,
          scrub: 0.25,
          onUpdate: (self) => {
            direction = self.direction * -1;
          },
        },
      });

      // 3. Infinite looping ticker function
      let isCancelled = false;
      const animateMarquee = () => {
        if (isCancelled || !firstTextRef.current || !secondTextRef.current) return;

        if (xPercent <= -100) {
          xPercent = 0;
        }
        if (xPercent > 0) {
          xPercent = -100;
        }
        
        // Update both texts for double text looping width
        gsap.set(firstTextRef.current, { xPercent: xPercent });
        gsap.set(secondTextRef.current, { xPercent: xPercent });
        
        xPercent += 0.075 * direction;
        requestAnimationFrame(animateMarquee);
      };
      
      requestAnimationFrame(animateMarquee);

      return () => {
        isCancelled = true;
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full bg-[#0f0f10] overflow-hidden flex flex-col justify-between text-white"
    >
      {/* Visual background atmospheric elements */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-[#c9fd34]/5 blur-[120px] pointer-events-none" />

      {/* 1. Header margin spacing spacer */}
      <div className="h-24 sm:h-32" />

      {/* 2. Primary Title Grid */}
      <div className="px-6 sm:px-12 md:px-24 flex flex-col gap-6 md:gap-8 z-10">
        <div className="flex flex-col gap-2 max-w-4xl">
          <div className="hero-title-line overflow-hidden h-14 sm:h-24 md:h-28">
            <span className="inline-block font-heading text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-tight leading-none text-zinc-400">
              Creative
            </span>
          </div>
          <div className="hero-title-line overflow-hidden h-14 sm:h-24 md:h-28">
            <span className="inline-block font-heading text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-tight leading-none text-white">
              Development
            </span>
          </div>
        </div>

        <div className="hero-fade-in flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-zinc-800 pt-8 mt-4">
          <p className="text-zinc-400 font-light text-sm max-w-sm leading-relaxed">
            Delivering award-winning personal websites, interactive systems, and premium interface designs with peak optimization and smooth scroll orchestration.
          </p>
          <div className="flex items-center gap-8 text-zinc-500 text-xs tracking-wider uppercase font-semibold">
            <span>© 2026</span>
            <span>Based in London, UK</span>
          </div>
        </div>
      </div>

      {/* 3. Large Kinetic Scrolling Marquee Text */}
      <div className="relative flex overflow-hidden py-4 border-b border-t border-zinc-900 bg-[#0f0f10]/80 z-10">
        <div ref={marqueeRef} className="flex whitespace-nowrap text-[12vw] sm:text-[10vw] font-heading font-extrabold uppercase leading-none select-none text-zinc-800/25">
          <span ref={firstTextRef} className="inline-block pr-8">
            Anessa Bo — Frontend Architect — Motion Designer —
          </span>
          <span ref={secondTextRef} className="inline-block pr-8">
            Anessa Bo — Frontend Architect — Motion Designer —
          </span>
        </div>
      </div>

      {/* 4. Scroll Indicator floating badge (Magnetic circular scroll explorer) */}
      <div className="absolute bottom-[20%] right-6 sm:right-12 md:right-24 z-20 hero-fade-in">
        <Magnetic actionStrength={0.35} hoverAreaPadding="p-0">
          <div
            data-cursor="view"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#c9fd34] text-black flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-300"
          >
            <ArrowDownRight className="w-6 h-6 animate-bounce" />
            <span className="font-heading text-[10px] font-bold tracking-widest uppercase">
              Explore
            </span>
          </div>
        </Magnetic>
      </div>
    </section>
  );
}
