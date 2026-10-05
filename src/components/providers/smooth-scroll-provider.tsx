"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis, useLenis } from "@/lib/stores";

export { useLenis };

const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so Lenis, ScrollTrigger and
 * every other per-frame animation on the page share one requestAnimationFrame
 * loop. The instance is published through an external store (not React
 * state), so consumers can read it without re-render cascades.
 */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.15,
      easing: easeOutExpo,
      smoothWheel: !reduceMotion,
      // Native momentum on touch — syncing touch through Lenis feels laggy on iOS.
      syncTouch: false,
      touchMultiplier: 1.2,
      wheelMultiplier: 1,
      autoResize: true,
      stopInertiaOnNavigate: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Lag smoothing would make scroll-linked animations drift from the
    // actual scroll position after a dropped frame.
    gsap.ticker.lagSmoothing(0);

    setLenis(lenis);

    // Web fonts swapping in change text metrics, which moves every trigger's
    // start/end — re-measure once they have settled.
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
