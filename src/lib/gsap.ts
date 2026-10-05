import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

// Every client module imports GSAP through here, so plugins are registered
// exactly once no matter which component happens to load first.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin);
  // Mobile URL bars resize the viewport while scrolling; re-measuring every
  // trigger on each of those resizes causes visible jumps in pinned sections.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin, useGSAP };

export const EASE = {
  out: "power3.out",
  outStrong: "power4.out",
  in: "power2.in",
  inOut: "expo.inOut",
  elastic: "elastic.out(1, 0.4)",
} as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
