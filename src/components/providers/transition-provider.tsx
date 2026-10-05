"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { getLenis, setPageRevealed } from "@/lib/stores";
import { playWhoosh } from "@/lib/sound";

export interface NavigateOptions {
  /** Shown large on the curtain while the next route loads. */
  label?: string;
  /** Viewport point the iris opens from — usually the click position. */
  origin?: { x: number; y: number };
}

interface TransitionContextValue {
  navigate: (href: string, options?: NavigateOptions) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) throw new Error("usePageTransition must be used within <TransitionProvider>");
  return context;
}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Scrolls to a section on the current page, accounting for pin spacers. */
export function scrollToHash(hash: string, immediate = false) {
  const target = hash ? document.querySelector<HTMLElement>(hash) : null;
  const lenis = getLenis();
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, immediate ? { immediate: true, force: true } : { duration: 1.6, force: true });
  } else {
    target.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }
}

/**
 * Route transitions: an iris opens from the click point, the destination's
 * name rises through it, the route swaps underneath once it has actually
 * committed, and the curtain wipes upward to reveal the new page.
 */
export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(false);
  const commitRef = useRef<{ path: string; resolve: () => void } | null>(null);

  // A navigation counts as done once the new pathname has rendered.
  useEffect(() => {
    const pending = commitRef.current;
    if (pending && pending.path === pathname) {
      commitRef.current = null;
      pending.resolve();
    }
  }, [pathname]);

  const navigate = useCallback(
    (href: string, options: NavigateOptions = {}) => {
      if (activeRef.current) return;
      const url = new URL(href, window.location.href);

      // Same page: just scroll there.
      if (url.pathname === window.location.pathname) {
        if (url.hash) scrollToHash(url.hash);
        else getLenis()?.scrollTo(0, { duration: 1.6, force: true });
        return;
      }

      const overlay = overlayRef.current;
      const fill = fillRef.current;
      const labelEl = labelRef.current;
      if (!overlay || !fill || !labelEl) {
        router.push(href);
        return;
      }

      activeRef.current = true;
      const reduce = prefersReducedMotion();
      const lenis = getLenis();
      lenis?.stop();
      playWhoosh();

      // Build the label imperatively — the timeline needs the characters in
      // the DOM within this same tick, before React could re-render.
      labelEl.replaceChildren();
      const text = (options.label ?? "").toUpperCase();
      for (const char of text) {
        const mask = document.createElement("span");
        mask.className = "inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-top";
        const inner = document.createElement("span");
        inner.className = "t-char inline-block";
        inner.textContent = char === " " ? " " : char;
        mask.appendChild(inner);
        labelEl.appendChild(mask);
      }
      if (pathRef.current) pathRef.current.textContent = url.pathname + url.hash;
      const chars = labelEl.querySelectorAll(".t-char");

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const origin = options.origin ?? { x: vw / 2, y: vh / 2 };
      const radius = Math.hypot(Math.max(origin.x, vw - origin.x), Math.max(origin.y, vh - origin.y)) + 8;

      gsap.set(overlay, { visibility: "visible", pointerEvents: "auto" });

      const enter = gsap.timeline();
      if (reduce) {
        gsap.set(fill, { clipPath: "inset(0% 0% 0% 0%)", opacity: 0 });
        gsap.set(chars, { yPercent: 0 });
        enter.to(fill, { opacity: 1, duration: 0.2 }).to(metaRef.current, { opacity: 1, duration: 0.2 }, 0);
      } else {
        gsap.set(fill, { opacity: 1, clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` });
        gsap.set(chars, { yPercent: 115 });
        gsap.set(metaRef.current, { opacity: 0 });
        enter
          .to(fill, {
            clipPath: `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
            duration: 0.8,
            ease: "expo.inOut",
          })
          .to(chars, { yPercent: 0, duration: 0.7, stagger: 0.028, ease: "expo.out" }, 0.42)
          .to(metaRef.current, { opacity: 1, duration: 0.3 }, 0.5);
      }

      const run = async () => {
        await enter;
        setPageRevealed(false);

        const committed = new Promise<void>((resolve) => {
          commitRef.current = { path: url.pathname, resolve };
          window.setTimeout(resolve, 3000);
        });
        router.push(url.pathname + url.search + url.hash, { scroll: false });
        await committed;
        commitRef.current = null;

        // Let the new page's layout effects (pins, splits) settle first.
        await nextFrame();
        await nextFrame();
        ScrollTrigger.refresh();
        if (url.hash) {
          scrollToHash(url.hash, true);
        } else {
          window.scrollTo(0, 0);
          lenis?.scrollTo(0, { immediate: true, force: true });
        }
        lenis?.start();

        setPageRevealed(true);
        const exit = gsap.timeline();
        if (reduce) {
          exit.to([fill, metaRef.current], { opacity: 0, duration: 0.25 });
        } else {
          gsap.set(fill, { clipPath: "inset(0% 0% 0% 0%)" });
          exit
            .to(chars, { yPercent: -115, duration: 0.45, stagger: 0.016, ease: "expo.in" })
            .to(metaRef.current, { opacity: 0, duration: 0.25 }, 0)
            .to(fill, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut" }, 0.28);
        }
        await exit;

        gsap.set(overlay, { visibility: "hidden", pointerEvents: "none" });
        activeRef.current = false;
        ScrollTrigger.refresh();
      };

      void run();
    },
    [router]
  );

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}

      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none invisible fixed inset-0 z-[90] select-none"
      >
        <div ref={fillRef} className="absolute inset-0 bg-[#141416]" />
        <div className="absolute inset-0 flex items-center justify-center px-gutter">
          <span className="flex items-center gap-[0.18em] font-heading text-[clamp(2.75rem,9vw,9rem)] font-bold leading-none tracking-[-0.03em] text-fg">
            <span ref={labelRef} className="flex flex-wrap justify-center" />
          </span>
        </div>
        <div
          ref={metaRef}
          className="absolute inset-x-0 bottom-0 flex items-center justify-between px-gutter pb-8 mono uppercase text-fg-3"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            Loading
          </span>
          <span ref={pathRef} />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
