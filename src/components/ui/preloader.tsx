"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const words = [
  "Hello",     // English
  "Bonjour",   // French
  "Ciao",      // Italian
  "Olá",       // Portuguese
  "Hallo",     // German
  "Hola",      // Spanish
  "Anessa Bo"  // Portfolio Brand Name
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated with latest onComplete callback
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 1. Text cycle animation with a guaranteed onComplete fallback
  useEffect(() => {
    console.log("Preloader useEffect triggered, index:", index);
    if (index === words.length - 1) {
      console.log("Reached last word, starting exit animation timeline timeout");
      // Fallback timeout to guarantee onComplete is called even if GSAP is interrupted/reverted (e.g. by React StrictMode)
      const exitTimeout = setTimeout(() => {
        console.log("Exit animation timeout fired, calling onComplete");
        onCompleteRef.current();
      }, 1500); // 1.5s matches the exit animation timeline duration
      return () => {
        clearTimeout(exitTimeout);
      };
    }
    
    const timeout = setTimeout(
      () => {
        console.log("Preloader timeout fired, setting index to:", index + 1);
        setIndex((prev) => prev + 1);
      },
      index === 0 ? 1000 : 150
    );

    return () => {
      console.log("Preloader useEffect cleanup, clearing timeout for index:", index);
      clearTimeout(timeout);
    };
  }, [index]);

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
      const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height + 300} 0 ${height} Z`;
      const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height} 0 ${height} Z`;

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
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
    { dependencies: [index] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#141414] select-none touch-none"
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
