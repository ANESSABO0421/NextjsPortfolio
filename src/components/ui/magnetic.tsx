"use client";

import { useRef } from "react";
import { gsap, useGSAP, hasFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: React.ReactNode;
  /** How far the content follows the pointer, as a fraction of the offset (0–1). */
  strength?: number;
  className?: string;
}

/**
 * Pulls its content towards the pointer and snaps back with an elastic
 * rebound on leave. The bounding rect is measured on enter only, never per
 * move, so tracking never forces layout.
 */
export default function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner || !hasFinePointer() || prefersReducedMotion()) return;

      const xTo = gsap.quickTo(inner, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(inner, "y", { duration: 0.45, ease: "power3.out" });
      let rect = outer.getBoundingClientRect();

      const onEnter = () => {
        rect = outer.getBoundingClientRect();
      };
      const onMove = (event: PointerEvent) => {
        xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: true });
      };

      outer.addEventListener("pointerenter", onEnter);
      outer.addEventListener("pointermove", onMove);
      outer.addEventListener("pointerleave", onLeave);
      return () => {
        outer.removeEventListener("pointerenter", onEnter);
        outer.removeEventListener("pointermove", onMove);
        outer.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: outerRef, dependencies: [strength] }
  );

  return (
    <span ref={outerRef} className={cn("relative inline-flex", className)}>
      <span ref={innerRef} className="relative inline-flex will-change-transform">
        {children}
      </span>
    </span>
  );
}
