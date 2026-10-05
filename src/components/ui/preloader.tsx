"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getLenis, markIntroDone, useLenis } from "@/lib/stores";
import { site } from "@/lib/site";

const greetings = [
  "Hello", // English
  "नमस्ते", // Hindi
  "നമസ്കാരം", // Malayalam
  "مرحباً", // Arabic
  "Bonjour", // French
  "Hola", // Spanish
  "Anees", // Brand
];

const COLUMNS = 5;

function waitForAssets(timeoutMs: number) {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const portrait = document.querySelector<HTMLImageElement>("img[data-hero-portrait]");
  const image = portrait && !portrait.complete ? portrait.decode().catch(() => undefined) : Promise.resolve();
  const timeout = new Promise((resolve) => window.setTimeout(resolve, timeoutMs));
  return Promise.race([Promise.all([fonts, image]), timeout]);
}

/**
 * First-visit intro: greetings flick through like a split-flap board while a
 * counter tracks real asset readiness (fonts + hero portrait), then the
 * screen lifts away as staggered columns. Shown once per session, only on
 * the home page — the inline script in layout.tsx decides before first paint.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const playingRef = useRef(false);
  const lenis = useLenis();

  // Lenis is created by a parent effect, which runs after this one — so stop
  // it whenever it appears while the intro is still on screen.
  useEffect(() => {
    if (playingRef.current) lenis?.stop();
  }, [lenis]);

  useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    if (html.dataset.intro !== "play" || !root) {
      markIntroDone();
      return;
    }

    playingRef.current = true;
    html.style.overflow = "hidden";
    const reduce = prefersReducedMotion();
    const word = wordRef.current!;
    const columns = root.querySelectorAll<HTMLElement>("[data-column]");
    const content = root.querySelectorAll<HTMLElement>("[data-content]");
    const counter = { value: 0 };
    let cancelled = false;

    const renderCounter = () => {
      const value = Math.round(counter.value);
      if (counterRef.current) counterRef.current.textContent = String(value).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${counter.value / 100})`;
    };

    const finish = () => {
      if (cancelled) return;
      playingRef.current = false;
      html.style.overflow = "";
      html.dataset.intro = "done";
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {
        // Storage can be unavailable; the intro simply plays again next visit.
      }
      getLenis()?.start();
    };

    const cycle = gsap.timeline();
    gsap.set(word, { opacity: 1 });
    if (!reduce) {
      word.textContent = greetings[0];
      cycle.fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out" }).to({}, { duration: 0.45 });
      greetings.slice(1).forEach((greeting, i) => {
        const last = i === greetings.length - 2;
        cycle
          .to(word, { yPercent: -110, duration: 0.13, ease: "power2.in" })
          .add(() => {
            word.textContent = greeting;
          })
          .fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: last ? 0.6 : 0.16, ease: last ? "expo.out" : "power2.out" })
          .to({}, { duration: last ? 0.2 : 0.07 });
      });
    } else {
      word.textContent = greetings[greetings.length - 1];
    }

    const count = gsap.to(counter, {
      value: 100,
      duration: reduce ? 0.6 : 2.6,
      ease: "power2.inOut",
      onUpdate: renderCounter,
    });

    const exit = () => {
      if (cancelled) return;
      const tl = gsap.timeline({ onComplete: finish });
      if (reduce) {
        tl.to(root, { opacity: 0, duration: 0.4 }).add(markIntroDone, 0.1);
        return;
      }
      tl.to(content, { yPercent: -120, opacity: 0, duration: 0.6, ease: "expo.in", stagger: 0.04 })
        .to(
          columns,
          {
            yPercent: -100,
            duration: 1.1,
            ease: "expo.inOut",
            stagger: { each: 0.07, from: "center" },
          },
          0.35
        )
        // The hero starts building while the columns are still lifting.
        .add(markIntroDone, 0.75)
        .set(root, { display: "none" });
    };

    void Promise.all([cycle, count, waitForAssets(3200)]).then(exit);

    return () => {
      cancelled = true;
      cycle.kill();
      count.kill();
      html.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="preloader fixed inset-0 z-[80] touch-none select-none overflow-hidden text-fg"
    >
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span key={i} data-column className="-mx-px h-full flex-1 bg-void" />
        ))}
      </div>

      <div className="relative flex h-full flex-col justify-between px-gutter py-6 sm:py-8">
        <div data-content className="flex items-start justify-between mono uppercase text-fg-3">
          <span>{site.name} — Portfolio ’26</span>
          <span className="hidden sm:inline">{site.coordinates}</span>
        </div>

        <div className="flex items-center justify-center">
          <div data-content className="flex items-center gap-4">
            <span className="h-2 w-2 shrink-0 rounded-full bg-lime" />
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span
                ref={wordRef}
                dir="auto"
                style={{ opacity: 0 }}
                className="block font-heading text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[1.15] tracking-[-0.02em]"
              >
                {greetings[0]}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div data-content className="flex items-end justify-between gap-6">
            <span className="caption max-w-[14rem] text-fg-3">{site.role}</span>
            <span
              ref={counterRef}
              className="font-heading text-[clamp(3.5rem,13vw,12rem)] font-bold leading-[0.8] tracking-[-0.04em] tabular-nums"
            >
              000
            </span>
          </div>
          <span data-content className="relative block h-px w-full bg-line-2">
            <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-lime" />
          </span>
        </div>
      </div>
    </div>
  );
}
