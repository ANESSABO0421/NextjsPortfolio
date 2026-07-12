"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/components/ui/magnetic";
import { ArrowDownRight, Globe } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const firstTextRef = useRef<HTMLSpanElement>(null);
  const secondTextRef = useRef<HTMLSpanElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;
      const canUseHeavyMotion =
        window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Kinetic marquee animation parameters (encapsulated within GSAP scope)
      let xPercent = 0;
      let direction = -1;

      // 1. Entrance animations
      gsap.fromTo(
        portraitRef.current,
        { scale: 1.08, opacity: 0, y: 80 },
        {
          scale: 1.0,
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power4.out",
          delay: 0.25,
        }
      );

      gsap.fromTo(
        ".hero-floating-element",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.8,
        }
      );

      const xTo = canUseHeavyMotion
        ? gsap.quickTo(portraitRef.current, "x", { duration: 0.6, ease: "power3.out" })
        : null;
      const yTo = canUseHeavyMotion
        ? gsap.quickTo(portraitRef.current, "y", { duration: 0.6, ease: "power3.out" })
        : null;

      const handleMouseMove = (e: MouseEvent) => {
        if (!xTo || !yTo) return;
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) * 0.035;
        const y = (clientY - window.innerHeight / 2) * 0.035;
        xTo(x);
        yTo(y);
      };

      if (canUseHeavyMotion) {
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
      }

      // 3. Map scroll direction to marquee direction
      if (canUseHeavyMotion) {
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
      }

      // 4. Infinite loop scroll marquee
      let isCancelled = false;
      const animateMarquee = () => {
        if (isCancelled || !firstTextRef.current || !secondTextRef.current) return;
        if (!canUseHeavyMotion) return;

        if (xPercent <= -100) {
          xPercent = 0;
        }
        if (xPercent > 0) {
          xPercent = -100;
        }

        gsap.set(firstTextRef.current, { xPercent: xPercent });
        gsap.set(secondTextRef.current, { xPercent: xPercent });

        xPercent += 0.075 * direction;
        requestAnimationFrame(animateMarquee);
      };

      if (canUseHeavyMotion) {
        requestAnimationFrame(animateMarquee);
      }

      return () => {
        isCancelled = true;
        if (canUseHeavyMotion) {
          window.removeEventListener("mousemove", handleMouseMove);
        }
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[640px] h-[100svh] w-full bg-[#9c9e9f] overflow-hidden flex items-center justify-center select-none"
    >
      {/* 1. Large Kinetic Scrolling Marquee Text (Layered BEHIND the portrait) */}
      <div className="absolute bottom-[12%] left-0 w-full overflow-hidden whitespace-nowrap z-0 pointer-events-none">
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap text-[18vw] sm:text-[15vw] lg:text-[12vw] font-heading font-extrabold uppercase leading-none text-white select-none"
        >
          <span ref={firstTextRef} className="inline-block pr-12 will-change-transform">
            Anessa Bo — Creative Architect —
          </span>
          <span ref={secondTextRef} className="inline-block pr-12 will-change-transform">
            Anessa Bo — Creative Architect —
          </span>
        </div>
      </div>

      {/* 2. Center Portrait Image (Layered ABOVE the marquee) */}
      <div
        ref={portraitRef}
        className="absolute bottom-0 left-0 right-0 mx-auto w-full sm:w-[78vh] lg:w-[100vh] h-[100svh] min-h-[640px] z-10 transition-transform duration-75 ease-out"
      >
        <Image
          src="/anees-aboo3.png"
          alt="Anessa Bo"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 78vh, 100vh"
          priority
          className="object-cover sm:object-contain object-bottom scale-95 origin-bottom sm:scale-100"
        />
      </div>

      {/* 3. Sliding Location Badge (Left Edge) */}
      <div className="hero-floating-element absolute bottom-[22%] left-0 z-20 transform transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] -translate-x-[calc(100%-60px)] hover:translate-x-0">
        <div className="bg-[#1c1c1f]/95 backdrop-blur-md text-white pl-8 pr-4 py-3 sm:py-3.5 rounded-r-full flex items-center gap-4 sm:gap-6 shadow-2xl border-y border-r border-white/5 cursor-pointer whitespace-nowrap">
          <span className="text-[9px] sm:text-xs tracking-wider uppercase font-medium leading-relaxed text-left">
            Located in <br />
            <span className="text-zinc-400 font-light font-sans normal-case">London, UK</span>
          </span>
          <Magnetic actionStrength={0.25} hoverAreaPadding="p-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#c9fd34] shrink-0">
              <div className="animate-[spin_12s_linear_infinite]">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </Magnetic>
        </div>
      </div>

      {/* 4. Intro Text Block with Arrow (Right Side on desktop, Left Side on mobile) */}
      <div className="hero-floating-element absolute top-[25%] sm:top-[32%] lg:top-[35%] left-6 sm:left-auto sm:right-12 lg:right-24 z-20 flex flex-col gap-4 sm:gap-6 text-[#1c1c1f] max-w-[150px] sm:max-w-[220px] lg:max-w-[240px]">
        <ArrowDownRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5px] text-[#1c1c1f] animate-bounce" />
        <p className="font-heading text-sm sm:text-2xl font-bold uppercase leading-tight tracking-tight">
          Freelance <br />
          Designer & Developer
        </p>
      </div>
    </section>
  );
}
