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

  // Kinetic marquee animation parameters
  let xPercent = 0;
  let direction = -1;

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

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

      // 2. Optimized Parallax quickTo triggers for mouse tracking
      const xTo = gsap.quickTo(portraitRef.current, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(portraitRef.current, "y", { duration: 0.6, ease: "power3.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) * 0.035;
        const y = (clientY - window.innerHeight / 2) * 0.035;
        xTo(x);
        yTo(y);
      };

      window.addEventListener("mousemove", handleMouseMove);

      // 3. Map scroll direction to marquee direction
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

      // 4. Infinite loop scroll marquee
      let isCancelled = false;
      const animateMarquee = () => {
        if (isCancelled || !firstTextRef.current || !secondTextRef.current) return;

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

      requestAnimationFrame(animateMarquee);

      return () => {
        isCancelled = true;
        window.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full bg-[#9c9e9f] overflow-hidden flex items-center justify-center select-none"
    >
      {/* 1. Large Kinetic Scrolling Marquee Text (Layered BEHIND the portrait) */}
      <div className="absolute bottom-[12%] left-0 w-full overflow-hidden whitespace-nowrap z-0 pointer-events-none">
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap text-[12vw] sm:text-[15vw] font-heading font-extrabold uppercase leading-none text-white select-none"
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
        className="absolute bottom-0 left-0 right-0 mx-auto w-[100vh] max-w-full h-screen z-10 transition-transform duration-75 ease-out"
      >
        <Image
          src="/anees-aboo.png"
          alt="Anessa Bo"
          fill
          sizes="100vh"
          priority
          className="object-contain object-bottom"
        />
      </div>

      {/* 3. Floating Location Badge (Bottom Left) */}
      <div className="hero-floating-element absolute bottom-20 left-4 sm:bottom-12 sm:left-12 z-20">
        <div className="bg-[#1c1c1f]/95 backdrop-blur-md text-white pl-4 pr-3 py-3 sm:pl-6 sm:pr-4 sm:py-4 rounded-full flex items-center gap-3 sm:gap-4 shadow-xl border border-white/5 whitespace-nowrap">
          <span className="text-[9px] sm:text-xs tracking-wider uppercase font-medium leading-relaxed">
            Located in <br />
            <span className="text-zinc-400 font-light font-sans">London, United Kingdom</span>
          </span>
          <Magnetic actionStrength={0.25} hoverAreaPadding="p-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#c9fd34] animate-[spin_12s_linear_infinite]">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </Magnetic>
        </div>
      </div>

      {/* 4. Intro Text Block with Arrow (Right Side) */}
      <div className="hero-floating-element absolute top-[35%] right-6 sm:right-12 md:right-24 z-20 hidden sm:flex flex-col gap-6 text-[#1c1c1f] max-w-[200px] sm:max-w-[240px]">
        <ArrowDownRight className="w-8 h-8 stroke-[1.5px] text-[#1c1c1f] animate-bounce" />
        <p className="font-heading text-lg sm:text-2xl font-bold uppercase leading-tight tracking-tight">
          Freelance <br />
          Designer & Developer
        </p>
      </div>
    </section>
  );
}
