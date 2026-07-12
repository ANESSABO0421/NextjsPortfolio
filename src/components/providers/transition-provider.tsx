"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useLenis } from "@/components/providers/smooth-scroll-provider";

interface TransitionContextType {
  transitionTo: (href: string, title: string) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { lenis } = useLenis();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [targetTitle, setTargetTitle] = useState("");
  const [isActive, setIsActive] = useState(false);

  // SVG morphing curves relative to viewBox="0 0 100 100"
  const curves = {
    initialBottom: "M 0 100 L 0 100 Q 50 100 100 100 L 100 100 Q 50 100 0 100 Z",
    slideUpCurved: "M 0 100 L 0 60 Q 50 0 100 60 L 100 100 Q 50 100 0 100 Z",
    flatFill: "M 0 100 L 0 0 Q 50 0 100 0 L 100 100 Q 50 100 0 100 Z",
    slideOutCurved: "M 0 40 L 0 0 Q 50 0 100 0 L 100 40 Q 50 100 0 40 Z",
    finalTop: "M 0 0 L 0 0 Q 50 0 100 0 L 100 0 Q 50 0 0 0 Z",
  };

  const transitionTo = (href: string, title: string) => {
    if (isActive) return;
    setIsActive(true);
    setTargetTitle(title);
    
    // Stop smooth scroll during transitions
    lenis?.stop();

    const tl = gsap.timeline({
      onComplete: () => {
        // Unlock scroll and reset state
        lenis?.start();
        setIsActive(false);
      }
    });

    // 1. Reset overlay positions
    gsap.set(overlayRef.current, { display: "flex", yPercent: 100 });
    gsap.set(pathRef.current, { attr: { d: curves.initialBottom } });
    gsap.set(textRef.current, { y: 50, opacity: 0 });

    // 2. Slide overlay up and morph path to dome
    tl.to(overlayRef.current, {
      yPercent: 0,
      duration: 0.8,
      ease: "power4.inOut"
    });

    tl.to(pathRef.current, {
      attr: { d: curves.slideUpCurved },
      duration: 0.4,
      ease: "power2.in"
    }, "-=0.8");

    // 3. Morph top edge of path to flat fill
    tl.to(pathRef.current, {
      attr: { d: curves.flatFill },
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.4");

    // 4. Slide text up and fade in
    tl.to(textRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power3.out"
    }, "-=0.2");

    // 5. Midpoint Route Navigation swap (at full flat screen coverage)
    tl.add(() => {
      router.push(href);
    });

    // Pause briefly to let Next.js render/hydrate the target page
    tl.to({}, { duration: 0.35 });

    // 6. Slide text out
    tl.to(textRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.4,
      ease: "power3.in"
    });

    // 7. Slide overlay up out of screen and morph bottom edge
    tl.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut"
    });

    tl.to(pathRef.current, {
      attr: { d: curves.slideOutCurved },
      duration: 0.4,
      ease: "power2.in"
    }, "-=0.8");

    tl.to(pathRef.current, {
      attr: { d: curves.finalTop },
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.4");

    tl.set(overlayRef.current, { display: "none" });
  };

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      {children}

      {/* Full-screen SVG route transition curtain overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 w-full h-screen z-[100] pointer-events-none flex flex-col items-center justify-center select-none"
        style={{ display: "none" }}
      >
        {/* SVG Bezier path curtain */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path ref={pathRef} fill="#141416" d={curves.initialBottom} />
        </svg>

        {/* Dynamic target text section loader */}
        <div className="relative z-10 text-center flex items-center justify-center gap-4">
          <span className="w-2 h-2 rounded-full bg-[#c9fd34] animate-ping" />
          <h1
            ref={textRef}
            className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-wider text-white select-none leading-none"
          >
            {targetTitle}
          </h1>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
