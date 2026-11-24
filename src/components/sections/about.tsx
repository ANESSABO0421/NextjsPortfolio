"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDownRight, Download } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
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


export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const reduce = prefersReducedMotion();

      if (reduce) return;

      /* The portrait develops like a Polaroid while you read */
      gsap.fromTo(
        "[data-develop]",
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-transcript]", start: "top 70%", end: "center 40%", scrub: true },
        }
      );

      /* Transcript: questions scramble in, answers type with the scroll */
      gsap.utils.toArray<HTMLElement>("[data-qa]", section).forEach((item) => {
        const question = item.querySelector<HTMLElement>("[data-question]");
        const answer = item.querySelector<HTMLElement>("[data-answer]");
        const caret = item.querySelector<HTMLElement>("[data-caret]");
        if (!question || !answer || !caret) return;

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
    },
    { scope: sectionRef }
  );

  return (
    <section id="about" ref={sectionRef} aria-labelledby="about-title" className="relative bg-night py-28 sm:py-36">
      <div className="px-gutter">
        <div className="flex items-center justify-between mono uppercase text-fg-3">
          <span>About</span>
        </div>
        <TextReveal
          as="h2"
          text="A little about me."
          split="words"
          className="mt-10 max-w-[15ch] font-heading text-h1 text-fg [font-variation-settings:'wght'_620]"
        />
        <span id="about-title" className="sr-only">
          About {site.name}
        </span>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-16 px-gutter lg:grid-cols-12 lg:gap-10">
        {/* Portrait + actions */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[14vh]">
            <figure className="relative">
              <div className="relative aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-[1.25rem] bg-elevated">
                <Image
                  src={site.portraitStudio}
                  alt={`${site.name}, photographed in the studio`}
                  fill
                  sizes="(max-width: 1024px) 90vw, 30vw"
                  className="object-cover object-[50%_20%] [filter:grayscale(1)_brightness(1.55)_contrast(0.55)]"
                />
                <div data-develop className="absolute inset-0 opacity-0">
                  <Image
                    src={site.portraitStudio}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 90vw, 30vw"
                    className="object-cover object-[50%_20%]"
                  />
                </div>
              </div>
              <figcaption className="mt-4 flex max-w-[26rem] items-center justify-between mono uppercase text-fg-3">
                <span>{site.name}</span>

              </figcaption>
            </figure>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.3}>
                <a
                  href={site.resume}
                  download={site.resumeFileName}
                  className="group inline-flex items-center gap-3 rounded-full bg-lime px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-void transition-colors duration-300 hover:bg-fg"
                >
                  Download résumé
                  <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href="#works"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToHash("#works");
                  }}
                  className="group inline-flex items-center gap-3 rounded-full border border-line-3 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-fg transition-colors duration-300 hover:border-transparent hover:bg-fg hover:text-void"
                >
                  See the work
                  <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-45deg]" />
                </a>
              </Magnetic>
            </div>
          </div>
        </aside>

        {/* Transcript */}
        <ol data-transcript className="flex flex-col lg:col-span-7 lg:col-start-6">
          {interview.map((item) => (
            <li key={item.q} data-qa className="border-t border-line-2 py-9 first:border-t-0 first:pt-0 sm:py-12">
              <div className="flex items-baseline gap-5">
                <h3 data-question className="caption text-fg-2">
                  {item.q}
                </h3>
              </div>
              <div className="mt-5 flex gap-5">
                <p className="sr-only">{item.a}</p>
                <p
                  data-answer
                  aria-hidden
                  className="relative text-[clamp(1.2rem,1.9vw,1.85rem)] font-light leading-[1.42] text-fg"
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
