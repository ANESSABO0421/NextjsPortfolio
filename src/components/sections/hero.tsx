"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useFinePointer, useIntroDone, usePageRevealed } from "@/lib/stores";
import { projectDetails } from "@/lib/projects";
import { pad2, site } from "@/lib/site";
import TransitionLink from "@/components/ui/transition-link";
import TextReveal from "@/components/ui/text-reveal";

// Each letter of the name is also a door into one case study.
const LETTERS = [
  { char: "A", id: "obsera" },
  { char: "N", id: "spendova" },
  { char: "E", id: "malappuram-fc" },
  { char: "E", id: "kriscorp" },
  { char: "S", id: "devpulse" },
] as const;

// Syne's wght axis also drives width: ~0.62em per glyph at 400, ~1.16em at 800.
const REST = 640;
const MIN = 470;
const MAX = 800;

// Where each letter flies on scroll — outward and towards the camera.
const FLIGHT = [
  { x: -46, y: 26, r: -12 },
  { x: -24, y: 38, r: -6 },
  { x: 0, y: 52, r: 0 },
  { x: 24, y: 38, r: 6 },
  { x: 46, y: 26, r: 12 },
];

const statement =
  "I build the systems institutions run on — ERPs, HRMS platforms and real-time tools, engineered end to end.";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [active, setActive] = useState<number | null>(null);
  const introDone = useIntroDone();
  const revealed = usePageRevealed();
  const finePointer = useFinePointer();
  const ready = introDone && revealed;

  /* ── Entrance — waits for the intro / route curtain ────────────────── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const rise = gsap.utils.toArray<HTMLElement>("[data-rise]", section);
      const fade = gsap.utils.toArray<HTMLElement>("[data-fade]", section);
      const lines = gsap.utils.toArray<HTMLElement>("[data-gridline]", section);
      const portrait = section.querySelector<HTMLElement>("[data-portrait-inner]");

      gsap.set(section.querySelectorAll(".intro-hidden"), { visibility: "visible" });
      if (prefersReducedMotion()) return;

      if (!ready) {
        gsap.set(rise, { yPercent: 115 });
        gsap.set(fade, { opacity: 0, y: 24 });
        gsap.set(lines, { scaleY: 0 });
        gsap.set(portrait, { yPercent: 14, opacity: 0, scale: 1.04 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .to(lines, { scaleY: 1, duration: 1.6, stagger: 0.08, ease: "expo.inOut" }, 0)
        .to(portrait, { yPercent: 0, opacity: 1, scale: 1, duration: 1.8 }, 0.1)
        .to(rise, { yPercent: 0, duration: 1.5, stagger: 0.07 }, 0.25)
        .to(fade, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.7);
    },
    { scope: sectionRef, dependencies: [ready] }
  );

  /* ── Scroll fly-through — created at mount so later triggers measure
        positions with this pin's spacer already in place ────────────── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion()) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-gridline]", section);

      // Scrolling dives through the name: letters scatter past the camera
      // while the portrait comes forward.
      const mm = gsap.matchMedia();
      mm.add("(min-height: 500px)", () => {
        const flight = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        flight
          .to("[data-copy]", { y: -90, opacity: 0, ease: "power1.in", duration: 0.35 }, 0)
          .to(
            "[data-fly]",
            {
              // FLIGHT is in viewport units; resolved again on every refresh.
              x: (i: number) => (FLIGHT[i].x * window.innerWidth) / 100,
              y: (i: number) => (FLIGHT[i].y * window.innerHeight) / 100,
              rotate: (i: number) => FLIGHT[i].r,
              scale: 2.7,
              ease: "power2.in",
              duration: 1,
            },
            0
          )
          .to("[data-fly]", { opacity: 0, ease: "none", duration: 0.35 }, 0.62)
          .to(portraitRef.current, { scale: 1.2, yPercent: -5, ease: "none", duration: 1 }, 0)
          .to("[data-shade]", { opacity: 0.7, ease: "none", duration: 0.6 }, 0.4)
          .to(lines, { opacity: 0, ease: "none", duration: 0.4 }, 0);
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  /* ── Living letters: weight/width follows the pointer ──────────────── */
  useEffect(() => {
    const letters = letterRefs.current.filter((el): el is HTMLAnchorElement => !!el);
    const word = wordRef.current;
    if (letters.length !== LETTERS.length || !word || prefersReducedMotion()) return;

    const weights = letters.map(() => REST);
    const targets = letters.map(() => REST);
    let centers: number[] = [];
    let wordMidY = 0;
    let span = 1;
    let running = false;
    let idleTimer = 0;

    const measure = () => {
      // Measured at rest so the field doesn't chase its own deformation.
      letters.forEach((el) => el.style.setProperty("--wght", String(REST)));
      centers = letters.map((el) => {
        const rect = el.getBoundingClientRect();
        return rect.left + rect.width / 2;
      });
      const wordRect = word.getBoundingClientRect();
      wordMidY = wordRect.top + wordRect.height / 2;
      span = Math.max(1, wordRect.width);
      letters.forEach((el, i) => el.style.setProperty("--wght", weights[i].toFixed(1)));
    };

    const tick = (_time: number, deltaMs: number) => {
      const ease = 1 - Math.pow(1 - 0.14, Math.min(deltaMs, 64) / 16.67);
      let settled = true;
      for (let i = 0; i < letters.length; i++) {
        const diff = targets[i] - weights[i];
        if (Math.abs(diff) > 0.4) {
          settled = false;
          weights[i] += diff * ease;
          letters[i].style.setProperty("--wght", weights[i].toFixed(1));
        }
      }
      if (settled) stop();
    };

    const start = () => {
      if (running) return;
      running = true;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(tick);
    };

    const rest = () => {
      targets.fill(REST);
      start();
    };

    const focusOn = (index: number) => {
      targets.forEach((_, i) => {
        targets[i] = i === index ? MAX : Math.abs(i - index) === 1 ? (REST + MIN) / 2 : MIN;
      });
      start();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !centers.length) return;
      const vertical = Math.max(0.2, 1 - Math.abs(event.clientY - wordMidY) / (window.innerHeight * 0.75));
      const radius = span * 0.2;
      for (let i = 0; i < letters.length; i++) {
        const d = (event.clientX - centers[i]) / radius;
        const influence = Math.exp(-d * d) * vertical;
        targets[i] = MIN + (MAX - MIN) * influence;
      }
      start();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(rest, 1400);
    };

    measure();
    const section = sectionRef.current!;
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", rest);
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);

    // Touch devices get an ambient cycle instead of pointer tracking.
    let cycle = 0;
    let cycleIndex = 0;
    let visible = true;
    const coarse = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(section);
    if (coarse) {
      cycle = window.setInterval(() => {
        if (!visible) return;
        cycleIndex = (cycleIndex + 1) % letters.length;
        focusOn(cycleIndex);
        setActive(cycleIndex);
      }, 2600);
    }

    return () => {
      stop();
      window.clearTimeout(idleTimer);
      window.clearInterval(cycle);
      observer.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", rest);
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ── Warm the letter fills once the hero has landed ────────────────── */
  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => {
      LETTERS.forEach(({ id }) => {
        const poster = projectDetails[id]?.poster;
        if (poster) new window.Image().src = poster;
      });
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [ready]);

  const activeProject = active !== null ? projectDetails[LETTERS[active].id] : null;

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-void"
    >
      <h1 id="hero-title" className="sr-only">
        {site.name} — {site.role}
      </h1>

      {/* Architectural hairlines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex justify-between px-gutter">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} data-gridline className="h-full w-px origin-top bg-line" />
        ))}
      </div>

      {/* Soft spotlight so the portrait doesn't sit on a flat void */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 58% at 50% 46%, rgba(255,255,255,0.055), rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Portrait — stands behind the name */}
      <div
        ref={portraitRef}
        className="absolute bottom-0 right-[-16vw] aspect-[1792/2390] h-[70svh] origin-bottom sm:right-auto sm:left-1/2 sm:h-[86svh] sm:-translate-x-1/2"
      >
        <div data-portrait-inner className="intro-hidden absolute inset-0">
          <Image
            src={site.portrait}
            alt={`Portrait of ${site.name}`}
            fill
            preload
            sizes="(max-width: 640px) 110vw, 66svh"
            data-hero-portrait
            className="object-contain object-bottom select-none"
          />
        </div>
      </div>

      <div data-shade aria-hidden className="pointer-events-none absolute inset-0 bg-void opacity-0" />

      {/* Copy */}
      <div
        data-copy
        className="relative z-10 flex items-start justify-between gap-10 px-gutter pt-[17svh] sm:pt-[19svh]"
      >
        <div className="max-w-[19rem] sm:max-w-[26rem]">
          <p data-fade className="intro-hidden mono mb-5 uppercase text-fg-3">
            (01) — Index · Portfolio ’26
          </p>
          <TextReveal
            text={statement}
            ready={ready}
            delay={0.55}
            className="intro-hidden text-[clamp(1.1rem,1.7vw,1.6rem)] font-light leading-[1.35] text-fg"
          />
        </div>

        <dl data-fade className="intro-hidden hidden shrink-0 gap-x-6 gap-y-2.5 mono uppercase md:grid md:grid-cols-[auto_auto]">
          <dt className="text-fg-3">Now</dt>
          <dd className="text-fg-2">Full Stack Dev, XY-NEX &amp; Alans</dd>
          <dt className="text-fg-3">Studio</dt>
          <dd className="text-fg-2">Founder, {site.studio.name}</dd>
          <dt className="text-fg-3">Based</dt>
          <dd className="text-fg-2">{site.region} · IST</dd>
        </dl>
      </div>

      {/* Hint row — beside the vertical name on phones, above the word elsewhere */}
      <div
        data-copy
        className="absolute bottom-[4svh] left-[calc(1.5rem_+_min(15svh,30vw)*0.78_+_1rem)] right-6 z-30 flex items-end justify-between sm:inset-x-0 sm:bottom-[calc(min(21vw,40svh)*0.86_+_4svh)] sm:px-gutter"
      >
        <p data-fade className="intro-hidden mono max-w-[16rem] uppercase text-fg-3">
          {activeProject ? (
            <span className="text-fg">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: activeProject.accent }} />
              {pad2(activeProject.index)} / {activeProject.listTitle} — {activeProject.category}
            </span>
          ) : finePointer ? (
            "↳ Hover the letters — each one opens a case study"
          ) : (
            "↳ Tap a letter — each one opens a case study"
          )}
        </p>
        <p data-fade className="intro-hidden mono hidden uppercase text-fg-3 sm:block">
          Scroll to dive in
        </p>
      </div>

      {/* The name — runs up the left edge like a book spine on phones */}
      <div
        ref={wordRef}
        className="absolute bottom-[4svh] left-6 z-20 sm:inset-x-0 sm:left-0 sm:flex sm:justify-center sm:px-gutter"
        onPointerLeave={() => setActive(null)}
      >
        <nav
          aria-label="Case studies — one per letter"
          className="flex origin-bottom-left items-end font-heading text-[min(15svh,30vw)] uppercase leading-[0.78] tracking-[-0.02em] [transform:rotate(-90deg)_translateY(100%)] sm:text-[min(21vw,40svh)] sm:[transform:none]"
        >
          {LETTERS.map((letter, i) => {
            const project = projectDetails[letter.id];
            return (
              <span key={i} data-fly className="inline-block will-change-transform">
                <span data-rise className="intro-hidden inline-block">
                  <TransitionLink
                    href={`/work/${letter.id}`}
                    label={project.listTitle}
                    ref={(el: HTMLAnchorElement | null) => {
                      letterRefs.current[i] = el;
                    }}
                    data-active={active === i}
                    data-cursor="view"
                    data-cursor-label="Open"
                    aria-label={`Open case study: ${project.listTitle}`}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setActive(i);
                    }}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="hero-letter outline-none focus-visible:outline-none"
                    style={{ "--wght": REST } as React.CSSProperties}
                  >
                    <span aria-hidden className="hero-letter__solid">
                      {letter.char}
                    </span>
                    <span
                      aria-hidden
                      className="hero-letter__fill"
                      style={{ backgroundImage: project.poster ? `url(${project.poster})` : undefined }}
                    >
                      {letter.char}
                    </span>
                  </TransitionLink>
                </span>
              </span>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
