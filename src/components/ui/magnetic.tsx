"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MagneticProps {
  children: React.ReactNode;
  actionStrength?: number; // Strength of attraction (0 to 1)
  hoverAreaPadding?: string; // Optional padding class to control hover threshold area
}

export default function Magnetic({
  children,
  actionStrength = 0.35,
  hoverAreaPadding = "p-4",
}: MagneticProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const canUseMagnetic =
        window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!canUseMagnetic) return;

      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const rect = outer.getBoundingClientRect();
        
        // Find distance relative to the center of the static outer container
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = clientX - centerX;
        const y = clientY - centerY;

        // Animate the inner wrapper towards the cursor coords
        gsap.to(inner, {
          x: x * actionStrength,
          y: y * actionStrength,
          duration: 0.3,
          ease: "power2.out",
          force3D: true,
        });
      };

      const handleMouseLeave = () => {
        // Elastic rebound to center when leaving bounds
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.4)",
          force3D: true,
        });
      };

      outer.addEventListener("mousemove", handleMouseMove);
      outer.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        outer.removeEventListener("mousemove", handleMouseMove);
        outer.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: outerRef }
  );

  return (
    <div ref={outerRef} className={`relative inline-block cursor-pointer ${hoverAreaPadding}`}>
      <div ref={innerRef} className="relative z-10">
        {children}
      </div>
    </div>
  );
}
