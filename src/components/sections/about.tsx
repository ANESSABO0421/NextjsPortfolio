"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDownRight, Download } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, hasFinePointer } from "@/lib/gsap";
import { site } from "@/lib/site";
import { scrollToHash } from "@/components/providers/transition-provider";
import Magnetic from "@/components/ui/magnetic";
import TextReveal from "@/components/ui/text-reveal";

const interview = [
  {
    q: "About me",
    a: "Anees Aboobacker — a full-stack MERN developer from Kerala, India, and a Computer Science graduate of Calicut University, class of 2025. I speak English, Malayalam and Hindi, and write mostly JavaScript.",
  },
  {
    q: "What I build",
    a: "Production systems for institutions: ERPs, HRMS platforms and real-time tools that staff open every working day — the screens, the APIs behind them and the database they lean on.",
  },
  {
    q: "Current work",
    a: "A multi-tenant HRMS at XY-NEX & Alans Academy — six role-based dashboards across two branches. I own its Leave Management module, from the quota engine to the three-step approval chain, and lead the refactor of its frontend and backend architecture.",
  },
  {
    q: "SkiaFlow",
    a: "SkiaFlow, the freelance studio I founded in April 2026. It has shipped two client products end to end so far: the Malappuram FC Ultras community platform and the KrisCorp corporate website.",
  },
  {
    q: "What I enjoy",
    a: "I enjoy working on approval workflows, scheduled jobs and real-time notifications, and finding ways to make database queries faster.",
  },
];

// Sampled from the casual portrait — the section's whole colour story.
const palette = [
  { name: "Espresso", hex: "#452f31" },
  { name: "Cream", hex: "#e9e5da" },
  { name: "Stone", hex: "#cfccc6" },
  { name: "Glass", hex: "#91b3bd" },
  { name: "Slate", hex: "#94a0a5" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const reduce = prefersReducedMotion();

      if (reduce) return;

      /* ── Photos ──────────────────────────────────────────────────────── */
      const clip = (inset: string) => `inset(${inset} round 1.5rem)`;

      // Main portrait wipes open from the bottom while its picture settles.
      gsap.fromTo(
        "[data-photo-main]",
        { clipPath: clip("100% 0% 0% 0%") },
        {
          clipPath: clip("0% 0% 0% 0%"),
          duration: 1.7,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-stage]", start: "top 78%", once: true },
        }
      );
      gsap.fromTo(
        "[data-photo-main-img]",
        { scale: 1.45 },
        {
          scale: 1,
          duration: 2.2,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-stage]", start: "top 78%", once: true },
        }
      );

      // …then drifts slower than the page while you read.
      gsap.fromTo(
        "[data-photo-main-drift]",
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: "[data-stage]", start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      // The studio portrait flips in on top, tilting into place.
      gsap.fromTo(
        "[data-photo-alt]",
        { y: 120, opacity: 0, rotate: 14, scale: 0.88 },
        {
          y: 0,
          opacity: 1,
          rotate: 4,
          scale: 1,
          duration: 1.6,
          delay: 0.55,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-stage]", start: "top 78%", once: true },
        }
      );

      // …and develops like a Polaroid as the transcript is read.
      gsap.fromTo(
        "[data-develop]",
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-transcript]", start: "top 70%", end: "center 40%", scrub: true },
        }
      );

      // Floating tag and swatches arrive last.
      gsap.fromTo(
        "[data-tag]",
        { scale: 0, rotate: -24, opacity: 0 },
        {
          scale: 1,
          rotate: -7,
          opacity: 1,
          duration: 1.1,
          delay: 1.1,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: "[data-stage]", start: "top 78%", once: true },
        }
      );
      gsap.fromTo(
        "[data-swatch]",
        { y: 28, opacity: 0, scale: 0.5 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "back.out(2)",
          scrollTrigger: { trigger: "[data-swatches]", start: "top 92%", once: true },
        }
      );

      // The whole section's backdrop slides up out of the hero's shadow.
      gsap.fromTo(
        "[data-fade-up]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-actions]", start: "top 92%", once: true },
        }
      );

      /* ── Pointer depth: the photos float at different heights ───────── */
      let cleanupPointer: (() => void) | undefined;
      const stage = stageRef.current;
      if (stage && hasFinePointer()) {
        const depths = [
          { el: stage.querySelector<HTMLElement>("[data-depth-main]"), d: 10 },
          { el: stage.querySelector<HTMLElement>("[data-depth-alt]"), d: 26 },
          { el: stage.querySelector<HTMLElement>("[data-depth-tag]"), d: 40 },
        ]
          .filter((l): l is { el: HTMLElement; d: number } => !!l.el)
          .map(({ el, d }) => ({
            d,
            x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
          }));
        const onMove = (event: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const nx = (event.clientX - rect.left) / rect.width - 0.5;
          const ny = (event.clientY - rect.top) / rect.height - 0.5;
          depths.forEach(({ d, x, y }) => {
            x(nx * d);
            y(ny * d);
          });
        };
        const onLeave = () => depths.forEach(({ x, y }) => (x(0), y(0)));
        stage.addEventListener("pointermove", onMove, { passive: true });
        stage.addEventListener("pointerleave", onLeave);
        cleanupPointer = () => {
          stage.removeEventListener("pointermove", onMove);
          stage.removeEventListener("pointerleave", onLeave);
        };
      }

      /* ── Transcript: questions scramble in, answers type with the scroll ── */
      gsap.utils.toArray<HTMLElement>("[data-qa]", section).forEach((item) => {
        const question = item.querySelector<HTMLElement>("[data-question]");
        const answer = item.querySelector<HTMLElement>("[data-answer]");
        const caret = item.querySelector<HTMLElement>("[data-caret]");
        const rule = item.querySelector<HTMLElement>("[data-rule]");
        if (!question || !answer || !caret) return;

        if (rule) {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.4,
              ease: "expo.inOut",
              scrollTrigger: { trigger: item, start: "top 90%", once: true },
            }
          );
        }

        const finalQuestion = question.textContent ?? "";
        gsap.set(question, { opacity: 0 });
        gsap.to(question, {
          opacity: 1,
          duration: 1.1,
          scrambleText: { text: finalQuestion, chars: "upperCase", speed: 0.6, revealDelay: 0.25 },
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });

        const chars = Array.from(answer.querySelectorAll<HTMLElement>("[data-char]"));
        let positions: { x: number; y: number; h: number }[] = [];
        let shown = 0;
        gsap.set(chars, { visibility: "hidden" });
        gsap.set(caret, { opacity: 0 });

        const measure = () => {
          positions = chars.map((c) => ({ x: c.offsetLeft + c.offsetWidth, y: c.offsetTop, h: c.offsetHeight }));
        };

        const render = (count: number) => {
          if (count > shown) {
            for (let i = shown; i < count; i++) chars[i].style.visibility = "visible";
          } else if (count < shown) {
            for (let i = count; i < shown; i++) chars[i].style.visibility = "hidden";
          }
          shown = count;
          const anchor = count > 0 ? positions[count - 1] : positions[0] && { x: 0, y: positions[0].y, h: positions[0].h };
          if (anchor) caret.style.transform = `translate3d(${anchor.x + 2}px, ${anchor.y}px, 0)`;
          caret.style.opacity = count > 0 && count < chars.length ? "1" : "0";
        };

        ScrollTrigger.create({
          trigger: item,
          start: "top 80%",
          end: "bottom 42%",
          scrub: true,
          onRefresh: measure,
          onUpdate: (self) => render(Math.round(self.progress * chars.length)),
        });
        measure();
      });

      return () => cleanupPointer?.();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-title"
      className="relative z-20 -mt-[var(--lap)] rounded-t-[var(--lap)] rounded-b-[var(--lap)] bg-pal-cream py-28 text-pal-espresso [--caret-color:var(--pal-espresso)] sm:py-36"
    >
      <div className="px-gutter">
        <div className="flex items-center justify-between mono uppercase text-pal-espresso/60">
          <span>About</span>
          <span>(01)</span>
        </div>
        <TextReveal
          as="h2"
          text="A little about me."
          split="words"
          className="mt-10 max-w-[15ch] font-heading text-h1 text-pal-espresso [font-variation-settings:'wght'_620]"
        />
        <span id="about-title" className="sr-only">
          About {site.name}
        </span>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-16 px-gutter lg:grid-cols-12 lg:gap-10">
        {/* Photos + actions */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-[9vh]">
            <div ref={stageRef} data-stage className="relative mx-auto w-full max-w-[28rem] pb-16 sm:pb-20 lg:mx-0">
              {/* Main — the casual portrait */}
              <div data-depth-main className="w-[84%]">
                <figure
                  data-photo-main
                  className="group relative aspect-[3/4] w-full overflow-hidden rounded-[1.5rem] bg-pal-stone shadow-[0_40px_80px_-40px_rgba(69,47,49,0.55)]"
                >
                  <div data-photo-main-drift className="absolute -inset-y-[6%] inset-x-0">
                    <div
                      data-photo-main-img
                      className="absolute inset-0 transition-transform duration-[1200ms] ease-expo group-hover:scale-[1.05]"
                    >
                      <Image
                        src={site.portraitCasual}
                        alt={`${site.name}, relaxed against a wall in a brown shirt and cream trousers`}
                        fill
                        sizes="(max-width: 1024px) 80vw, 26vw"
                        className="object-cover object-[50%_35%]"
                      />
                    </div>
                  </div>
                </figure>
              </div>

              {/* Studio portrait — tilted onto the corner */}
              <div data-depth-alt className="absolute -bottom-0 right-0 w-[46%]">
                <figure
                  data-photo-alt
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.1rem] border-[6px] border-pal-cream bg-pal-slate shadow-[0_30px_60px_-30px_rgba(69,47,49,0.7)] transition-transform duration-700 ease-expo hover:-rotate-1 hover:scale-[1.04]"
                >
                  <Image
                    src={site.portraitStudio}
                    alt={`${site.name}, photographed in the studio`}
                    fill
                    sizes="(max-width: 1024px) 40vw, 14vw"
                    className="object-cover object-[50%_20%] [filter:grayscale(1)_brightness(1.4)_contrast(0.6)]"
                  />
                  <div data-develop className="absolute inset-0 opacity-0">
                    <Image
                      src={site.portraitStudio}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 40vw, 14vw"
                      className="object-cover object-[50%_20%]"
                    />
                  </div>
                </figure>
              </div>

              {/* Tag — sticks to the main photo */}
              <div data-depth-tag className="absolute left-[56%] top-[-1.1rem] z-10">
                <span
                  data-tag
                  className="mono inline-block rounded-full bg-pal-glass px-4 py-2 uppercase text-pal-espresso shadow-[0_12px_24px_-12px_rgba(69,47,49,0.6)]"
                >
                  Off duty · Kerala
                </span>
              </div>

              {/* Palette */}
              <ul
                data-swatches
                aria-label="Colour palette taken from the photograph"
                className="absolute bottom-3 left-0 flex items-center gap-2.5 sm:bottom-5"
              >
                {palette.map((swatch) => (
                  <li key={swatch.hex} data-swatch className="swatch" title={`${swatch.name} ${swatch.hex}`}>
                    <span
                      className="block h-7 w-7 rounded-full border border-pal-espresso/20 sm:h-8 sm:w-8"
                      style={{ background: swatch.hex }}
                    />
                    <span className="sr-only">{swatch.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-actions className="mt-6 flex flex-wrap items-center gap-3">
              <div data-fade-up>
                <Magnetic strength={0.3}>
                  <a
                    href={site.resume}
                    download={site.resumeFileName}
                    className="group inline-flex items-center gap-3 rounded-full bg-pal-espresso px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-pal-cream transition-colors duration-300 hover:bg-pal-glass hover:text-pal-espresso"
                  >
                    Download résumé
                    <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </a>
                </Magnetic>
              </div>
              <div data-fade-up>
                <Magnetic strength={0.3}>
                  <a
                    href="#works"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToHash("#works");
                    }}
                    className="group inline-flex items-center gap-3 rounded-full border border-pal-espresso/30 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-pal-espresso transition-colors duration-300 hover:border-transparent hover:bg-pal-espresso hover:text-pal-cream"
                  >
                    See the work
                    <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-45deg]" />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </aside>

        {/* Transcript */}
        <ol data-transcript className="flex flex-col lg:col-span-6 lg:col-start-7">
          {interview.map((item, index) => (
            <li key={item.q} data-qa className="relative py-9 first:pt-0 sm:py-12">
              {index > 0 && (
                <span
                  data-rule
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left bg-pal-espresso/20"
                />
              )}
              <div className="flex items-baseline gap-5">
                <span aria-hidden className="mono text-pal-espresso/45">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 data-question className="caption text-pal-espresso/70">
                  {item.q}
                </h3>
              </div>
              <div className="mt-5 flex gap-5">
                <p className="sr-only">{item.a}</p>
                <p
                  data-answer
                  aria-hidden
                  className="relative text-[clamp(1.05rem,1.45vw,1.4rem)] font-light leading-[1.42] text-pal-espresso"
                >
                  {item.a.split(" ").map((word, w) => (
                    <span key={w}>
                      <span className="inline-block whitespace-nowrap">
                        {Array.from(word).map((char, c) => (
                          <span key={c} data-char>
                            {char}
                          </span>
                        ))}
                      </span>{" "}
                    </span>
                  ))}
                  <span
                    data-caret
                    className="caret pointer-events-none absolute left-0 top-0 !h-[1.2em] !w-[0.45em] opacity-0"
                  />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
