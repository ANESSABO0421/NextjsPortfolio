"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const words = [
  "Hello",             // English
  "नमस्ते",              // Hindi
  "നമസ്കാരം",          // Malayalam
  "مرحباً",              // Arabic
  "Bonjour",           // French
  "Hola",              // Spanish
  "Anees Aboobacker",  // Portfolio Brand Name
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  const finishPreloader = React.useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onCompleteRef.current();
  }, []);

  // Keep ref updated with latest onComplete callback
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 1. Text cycle animation with a guaranteed onComplete fallback
  useEffect(() => {
    if (index === words.length - 1) {
      // Fallback timeout to guarantee onComplete is called even if GSAP is interrupted/reverted (e.g. by React StrictMode)
      const exitTimeout = setTimeout(() => {
        finishPreloader();
      }, 1500); // 1.5s matches the exit animation timeline duration
      return () => {
        clearTimeout(exitTimeout);
      };
    }
    
    const timeout = setTimeout(
      () => {
        setIndex((prev) => prev + 1);
      },
      index === 0 ? 1000 : 250
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [finishPreloader, index]);

  useEffect(() => {
    const maxDurationTimeout = setTimeout(() => {
      finishPreloader();
    }, 4500);

    return () => {
      clearTimeout(maxDurationTimeout);
    };
  }, [finishPreloader]);

  // 2. Set initial curve on client mount to prevent SSR hydration mismatch
  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height + 300} 0 ${height} Z`;
      gsap.set(path, { attr: { d: initialPath } });
    },
    { scope: containerRef }
  );

  // 3. Liquid SVG slide up exit animation
  useGSAP(
    () => {
      if (index !== words.length - 1) return;

      const container = containerRef.current;
      const path = pathRef.current;
      if (!container || !path) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Curve descriptors
      const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height} 0 ${height} Z`;

      const tl = gsap.timeline({
        onComplete: () => {
          finishPreloader();
        },
      });

      // Animate text fade out
      tl.to(".preloader-text", {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.inOut",
      });

      // Warp the SVG curve to make it look organic/fluid
      tl.to(
        path,
        {
          attr: { d: targetPath },
          duration: 0.8,
          ease: "power3.in",
        },
        "-=0.1"
      );

      // Slide the entire preloader panel out of the screen
      tl.to(
        container,
        {
          yPercent: -100,
          duration: 1.0,
          ease: "power4.inOut",
        },
        "-=0.7"
      );

      // Remove component from view entirely
      tl.set(container, { display: "none" });
    },
    { dependencies: [finishPreloader, index] }
  );

  return (
    <div
      ref={containerRef}
      className="preloader-shell fixed inset-0 z-[100] flex items-center justify-center bg-[#141414] select-none touch-none"
    >
      {/* 3D-ish fluid curve bottom border */}
      <svg className="absolute top-0 left-0 w-full h-[calc(100%+300px)] fill-[#141414] pointer-events-none">
        <path ref={pathRef} d="" />
      </svg>

      {/* Kinetic word transition */}
      <div className="relative z-10 flex items-center gap-3 text-white">
        {index === words.length - 1 ? (
          <h1 className="preloader-text font-heading text-4xl sm:text-6xl font-bold tracking-tight">
            {words[index]}
          </h1>
        ) : (
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <h1 className="preloader-text font-sans text-3xl sm:text-5xl font-light tracking-wide opacity-90">
              {words[index]}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
