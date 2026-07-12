"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "view" | "drag">("default");
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device on client mount to avoid hydration mismatch and logic locks
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(isTouchDevice);
  }, []);

  useGSAP(
    () => {
      if (isTouch) return;
      const cursor = cursorRef.current;
      if (!cursor) return;

      // Initial cursor placement offscreen
      gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

      // Highly optimized position trackers using GSAP quickTo
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });

      const handleMouseMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Search upward in DOM for interactive tags or custom cursor attributes
        const interactiveEl = target.closest("[data-cursor], a, button, [role='button']");

        if (interactiveEl) {
          const type = interactiveEl.getAttribute("data-cursor");
          if (type === "view") {
            setCursorState("view");
          } else if (type === "drag") {
            setCursorState("drag");
          } else {
            setCursorState("hover");
          }
        } else {
          setCursorState("default");
        }
      };

      const handleMouseLeaveWindow = () => {
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
      };

      const handleMouseEnterWindow = () => {
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseover", handleMouseOver);
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

  // Render a dual circle layer cursor with hardware acceleration styles
  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 z-[9999] pointer-events-none rounded-full flex items-center justify-center font-heading text-[10px] font-bold tracking-widest uppercase transition-[width,height,background-color] duration-300 ease-out will-change-transform mix-blend-difference
        ${cursorState === "default" && "w-3 h-3 bg-white"}
        ${cursorState === "hover" && "w-14 h-14 bg-white text-black"}
        ${cursorState === "view" && "w-20 h-20 bg-white text-black"}
        ${cursorState === "drag" && "w-20 h-20 bg-white text-black"}
      `}
    >
      {cursorState === "view" && (
        <span className="text-black font-bold select-none animate-[opacity_0.2s_ease-out_forwards]">
          VIEW
        </span>
      )}
      {cursorState === "drag" && (
        <span className="text-black font-bold select-none animate-[opacity_0.2s_ease-out_forwards]">
          DRAG
        </span>
      )}
    </div>
  );
}
