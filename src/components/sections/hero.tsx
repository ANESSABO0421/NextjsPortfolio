"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDownRight, Globe } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion, hasFinePointer } from "@/lib/gsap";
import { useIntroDone, usePageRevealed } from "@/lib/stores";
import { site } from "@/lib/site";
import TextReveal from "@/components/ui/text-reveal";

const statement =
  "I build ERPs, web apps and real-time tools for education and business.";

// Copies of the name in the marquee track — enough to cover any viewport.
const COPIES = 3;
const BASE_SPEED = 85; // px / second at rest
const MAX_BOOST = 1400; // extra px / second while scrolling hard

/** The name, set huge, endlessly drifting — and it reacts to scrolling. */
function useMarquee(trackRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    let groupWidth = 0;
    let x = 0;
    let direction = -1;
    let boost = 0;
    let lastScroll = window.scrollY;

    const measure = () => {
      const first = track.firstElementChild as HTMLElement | null;
      groupWidth = first ? first.getBoundingClientRect().width : 0;
    };
    measure();
    void document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);

    const tick = (_time: number, deltaMs: number) => {
      if (!groupWidth) return;
      const dt = Math.min(deltaMs, 64) / 1000;
      const scroll = window.scrollY;
      const velocity = dt > 0 ? (scroll - lastScroll) / dt : 0;
      lastScroll = scroll;

      // Scrolling down speeds it up in its own direction; scrolling up flips it.
      if (Math.abs(velocity) > 40) direction = velocity > 0 ? -1 : 1;
      const target = Math.min(MAX_BOOST, Math.abs(velocity) * 0.6);
      boost += (target - boost) * Math.min(1, dt * 6);

      x += direction * (BASE_SPEED + boost) * dt;
      if (x <= -groupWidth) x += groupWidth;
      if (x > 0) x -= groupWidth;
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", measure);
    };
  }, [trackRef]);
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const introDone = useIntroDone();
  const revealed = usePageRevealed();
  const ready = introDone && revealed;

  useMarquee(trackRef);

  /* ── Entrance — waits for the intro / route curtain ────────────────── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const rise = gsap.utils.toArray<HTMLElement>("[data-rise]", section);
      const fade = gsap.utils.toArray<HTMLElement>("[data-fade]", section);
      const slide = gsap.utils.toArray<HTMLElement>("[data-slide]", section);
      const portrait = section.querySelector<HTMLElement>("[data-portrait-inner]");
      const arrow = section.querySelector<HTMLElement>("[data-arrow]");

      gsap.set(section.querySelectorAll(".intro-hidden"), { visibility: "visible" });
      if (prefersReducedMotion()) return;

      if (!ready) {
        gsap.set(rise, { yPercent: 105 });
        gsap.set(fade, { opacity: 0, y: 28 });
        gsap.set(slide, { xPercent: -110 });
        gsap.set(portrait, { yPercent: 10, opacity: 0, scale: 1.06 });
        gsap.set(arrow, { opacity: 0, scale: 0.4, rotate: -45 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .to(portrait, { yPercent: 0, opacity: 1, scale: 1, duration: 2 }, 0)
        .to(rise, { yPercent: 0, duration: 1.7, stagger: 0.08 }, 0.25)
        .to(slide, { xPercent: 0, duration: 1.4 }, 0.7)
        .to(fade, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.8)
        .to(arrow, { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: "back.out(2)" }, 1.0);
    },
    { scope: sectionRef, dependencies: [ready] }
  );

  /* ── Scroll — the portrait drifts slower than the page, copy lifts away ─ */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion()) return;
      const scrub = {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        invalidateOnRefresh: true,
      };
      gsap.to(portraitRef.current, { yPercent: 9, scale: 1.1, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-lift]", { y: -90, opacity: 0, ease: "none", scrollTrigger: { ...scrub, end: "60% top" } });
      gsap.to("[data-pill]", { xPercent: -60, ease: "none", scrollTrigger: { ...scrub, end: "70% top" } });
      gsap.to("[data-marquee]", { yPercent: 18, ease: "none", scrollTrigger: scrub });
    },
    { scope: sectionRef }
  );

  /* ── Pointer parallax — layers follow the cursor at different depths ── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion() || !hasFinePointer()) return;
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", section).map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
      }));
      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        layers.forEach(({ depth, x, y }) => {
          x(nx * depth);
          y(ny * depth * 0.6);
        });
      };
      const onLeave = () => layers.forEach(({ x, y }) => (x(0), y(0)));
      section.addEventListener("pointermove", onMove, { passive: true });
      section.addEventListener("pointerleave", onLeave);
      return () => {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: sectionRef }
  );

  const group = (
    <span className="flex shrink-0 items-center">
      <span className="px-[0.18em]">Anees Aboobacker</span>
      <span aria-hidden className="px-[0.1em] font-light">—</span>
    </span>
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-pal-slate text-white"
    >
      <h1 id="hero-title" className="sr-only">
        {site.name} — {site.role}
      </h1>

      {/* Studio light — a soft glow behind the head, vignette at the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 62% at 50% 40%, rgba(255,255,255,0.22), rgba(255,255,255,0) 70%), radial-gradient(120% 90% at 50% 100%, rgba(40,52,58,0.28), rgba(40,52,58,0) 60%)",
        }}
      />

      {/* Portrait */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
        <div ref={portraitRef} className="relative aspect-[1792/2390] h-[64svh] origin-bottom sm:h-[90svh]">
          <div data-depth="-22" className="absolute inset-0">
            <div data-portrait-inner className="intro-hidden absolute inset-0">
              <Image
                src={site.portrait}
                alt={`Portrait of ${site.name}`}
                fill
                preload
                sizes="(max-width: 640px) 90vw, 70svh"
                className="select-none object-contain object-bottom drop-shadow-[0_30px_60px_rgba(30,40,46,0.35)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top-left statement */}
      <div data-lift className="absolute left-0 top-[22svh] z-30 hidden px-gutter md:block">
        <TextReveal
          text={statement}
          ready={ready}
          delay={0.7}
          className="intro-hidden max-w-[17rem] text-[clamp(0.9rem,1vw,1.05rem)] font-normal leading-[1.4] text-white/90"
        />
      </div>

      {/* Right — arrow + role */}
      <div
        data-lift
        data-depth="14"
        className="absolute inset-x-0 top-[13svh] z-30 px-gutter sm:top-[22svh] sm:text-right"
      >
        <span data-arrow className="intro-hidden hero-arrow mb-4 block w-fit sm:mb-6 sm:ml-auto">
          <ArrowDownRight className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.25} />
        </span>
        <p className="font-medium leading-[1.12] tracking-[-0.035em] text-[clamp(1.25rem,2.1vw,2.2rem)]">
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-rise className="intro-hidden block">Full Stack</span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-rise className="intro-hidden block">MERN Developer</span>
          </span>
        </p>
      </div>

      {/* Location pill — a dark capsule hugging the left edge */}
      <div
        data-pill
        className="absolute left-0 top-[40svh] z-30 sm:top-[44svh]"
      >
        <div
          data-slide
          className="intro-hidden flex items-center gap-5 rounded-r-full bg-[#1b2124] py-3 pl-gutter pr-3 sm:gap-6 sm:py-3"
        >
          <p className="text-[0.95rem] font-medium leading-[1.2] tracking-[-0.02em] sm:text-[clamp(0.95rem,1.1vw,1.15rem)]">
            Located
            <br />
            in {site.region.split(",")[0]},
            <br />
            India
          </p>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 sm:h-16 sm:w-16">
            <Globe className="orbit h-7 w-7 sm:h-8 sm:w-8" style={{ ["--orbit-speed" as string]: "14s" }} strokeWidth={1.1} />
          </span>
        </div>
      </div>

      {/* The name — an endless ribbon in front of the portrait */}
      <div
        data-marquee
        aria-hidden
        className="absolute inset-x-0 bottom-[calc(var(--lap)+1.5svh)] z-20 overflow-hidden"
      >
        <div data-rise className="intro-hidden">
          <div
            ref={trackRef}
            className="flex w-max select-none whitespace-nowrap font-medium leading-[0.84] tracking-[-0.045em] text-[min(15vw,25svh)] will-change-transform"
          >
            {Array.from({ length: COPIES }, (_, i) => (
              <span key={i} className="flex shrink-0">
                {group}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
