"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorStateRef = useRef<"default" | "hover" | "view" | "drag">("default");
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device on client mount to avoid hydration mismatch and logic locks
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(isTouchDevice);
  }, []);

  // Single unified GSAP effect — no React state changes on mouseover (avoids re-renders)
  useGSAP(
    () => {
      if (isTouch) return;
      const cursor = cursorRef.current;
      if (!cursor) return;

      const textEl = cursor.querySelector(".cursor-text") as HTMLElement;

      // Initial cursor placement offscreen
      gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -100, y: -100, scale: 0.15, force3D: true });

      // Highly optimized position trackers using GSAP quickTo
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });

      const handleMouseMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      const animateToState = (state: "default" | "hover" | "view" | "drag") => {
        if (cursorStateRef.current === state) return;
        cursorStateRef.current = state;

        let targetScale = 0.15;
        let text = "";

        if (state === "hover") {
          targetScale = 0.7;
        } else if (state === "view") {
          targetScale = 1.0;
          text = "VIEW";
        } else if (state === "drag") {
          targetScale = 1.0;
          text = "DRAG";
        }

        gsap.to(cursor, {
          scale: targetScale,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
          force3D: true,
        });

        if (textEl) {
          textEl.textContent = text;
        }
      };

      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const interactiveEl = target.closest("[data-cursor], a, button, [role='button']");

        if (interactiveEl) {
          const type = interactiveEl.getAttribute("data-cursor");
          if (type === "view") {
            animateToState("view");
          } else if (type === "drag") {
            animateToState("drag");
          } else {
            animateToState("hover");
          }
        } else {
          animateToState("default");
        }
      };

      const handleMouseLeaveWindow = () => {
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
      };

      const handleMouseEnterWindow = () => {
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("mouseover", handleMouseOver, { passive: true });
      document.addEventListener("mouseleave", handleMouseLeaveWindow);
      document.addEventListener("mouseenter", handleMouseEnterWindow);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("mouseleave", handleMouseLeaveWindow);
        document.removeEventListener("mouseenter", handleMouseEnterWindow);
      };
    },
    { dependencies: [isTouch] }
  );

  if (isTouch) return null;

  // Fixed-size container scaled via GPU transforms.
  // mix-blend-mode: difference REMOVED — it causes catastrophic recompositing on Safari.
  // The white cursor is perfectly visible on the dark portfolio backgrounds.
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full flex items-center justify-center font-heading text-[10px] font-bold tracking-widest uppercase will-change-transform w-20 h-20 bg-white/90"
    >
      <span className="cursor-text text-black font-bold select-none" />
    </div>
  );
}

