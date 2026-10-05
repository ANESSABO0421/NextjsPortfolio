"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useIntroDone, usePageRevealed } from "@/lib/stores";
import { projectDetails, type ProjectDetail, type ProjectModule } from "@/lib/projects";
import { elements, type StackElement } from "@/lib/skills";
import { pad2 } from "@/lib/site";
import { cn } from "@/lib/utils";
import TransitionLink from "@/components/ui/transition-link";
import Magnetic from "@/components/ui/magnetic";
import RollingText from "@/components/ui/rolling-text";
import PreviewVideo from "@/components/ui/preview-video";
import PhoneMockup from "@/components/ui/phone-mockup";
import LaptopMockup from "@/components/ui/laptop-mockup";
import SocketDiagram from "@/components/ui/socket-diagram";

const host = (url: string) => new URL(url).host.replace(/^www\./, "");
const longestWord = (title: string) => Math.max(...title.split(" ").map((word) => word.length));

// Syne at wght 760 with this tracking runs ≈1.06em per capital (measured), so
// the longest word of any title fits the measure without overflowing.
const mastheadSize = (title: string) => `min(17rem, calc(84vw / ${(longestWord(title) * 1.06).toFixed(2)}))`;
const nextSize = (title: string) => `min(10rem, calc(52vw / ${(longestWord(title) * 0.82).toFixed(2)}))`;

const elementByName = Object.fromEntries(elements.map((element) => [element.name, element]));

/**
 * A case study, set on paper. Light bands and dark bands are siblings rather
 * than nested, so the cursor and focus rings always pick the right ink.
 */
export default function CaseStudy({ project }: { project: ProjectDetail }) {
  const rootRef = useRef<HTMLElement>(null);
  const introDone = useIntroDone();
  const revealed = usePageRevealed();
  const ready = introDone && revealed;
  const next = projectDetails[project.nextId];

  /* ── Masthead entrance — waits for the route curtain ───────────────── */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const chars = root.querySelectorAll("[data-mast-char]");
      const fades = root.querySelectorAll("[data-mast-fade]");
      gsap.set(root.querySelectorAll(".intro-hidden"), { visibility: "visible" });
      if (prefersReducedMotion()) return;

      if (!ready) {
        gsap.set(chars, { yPercent: 115 });
        gsap.set(fades, { opacity: 0, y: 22 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .to(chars, { yPercent: 0, duration: 1.4, stagger: 0.045 }, 0.1)
        .to(fades, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07 }, 0.5);
    },
    { scope: rootRef, dependencies: [ready] }
  );

  /* ── Scroll choreography ───────────────────────────────────────────── */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      gsap.fromTo(
        "[data-device]",
        { scale: 0.84, y: 70 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-stage]", start: "top bottom", end: "top 15%", scrub: true },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      gsap.fromTo(
        "[data-next-media]",
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: "[data-next]", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: rootRef }
  );

  const sections = [
    "The brief",
    "Built with",
    ...(project.modules?.length ? ["Modules"] : []),
    ...(project.rolesMatrix?.length ? ["Access"] : []),
  ];
  const label = (name: string) => `(${pad2(sections.indexOf(name) + 1)}) — ${name}`;
  const matched = project.stack
    .map((name) => elementByName[name])
    .filter((element): element is StackElement => !!element)
    .sort((a, b) => a.number - b.number);
  const unmatched = project.stack.filter((name) => !elementByName[name]);
  const titleWords = project.title.split(" ");

  return (
    <main id="main" ref={rootRef} className="relative">
      {/* ── Masthead ───────────────────────────────────────────────────── */}
      <div data-theme="light" className="bg-paper px-gutter pb-16 pt-28 text-void sm:pt-36">
        <div data-mast-fade className="intro-hidden flex items-center justify-between mono uppercase text-black/50">
          <TransitionLink
            href="/#works"
            label="Work"
            className="roll-trigger group inline-flex items-center gap-2 transition-colors hover:text-void"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:-translate-x-1" />
            <RollingText text="All work" />
          </TransitionLink>
          <span>
            Case {pad2(project.index)} / {pad2(project.total)}
          </span>
        </div>

        <h1
          className="mt-10 font-heading uppercase leading-[0.8] tracking-[-0.05em] [font-variation-settings:'wght'_760] sm:mt-14"
          style={{ fontSize: mastheadSize(project.title) }}
        >
          <span className="sr-only">{project.listTitle}</span>
          <span aria-hidden className="intro-hidden flex flex-wrap gap-x-[0.22em]">
            {titleWords.map((word, w) => (
              <span key={w} className="whitespace-nowrap">
                {Array.from(word).map((char, i) => (
                  <span key={i} className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-top">
                    <span data-mast-char className="inline-block">
                      {char}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:mt-14 lg:flex-row lg:items-end lg:justify-between">
          <p
            data-mast-fade
            className="intro-hidden max-w-[36rem] text-[clamp(1.25rem,2vw,1.85rem)] font-light leading-[1.35] text-black/80"
          >
            {project.tagline}
          </p>
          <span data-mast-fade className="intro-hidden flex items-center gap-2.5 mono uppercase text-black/55">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: project.accent }} />
            {project.category}
          </span>
        </div>

        <dl className="grid gap-8 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Role", project.role],
            ["Credits", project.credits],
            ["Location & year", project.locationYear],
          ].map(([term, value]) => (
            <div key={term} data-mast-fade className="intro-hidden flex flex-col gap-2">
              <dt className="mono uppercase text-black/45">{term}</dt>
              <dd className="text-[15px] leading-relaxed text-black/80">{value}</dd>
            </div>
          ))}
          <div data-mast-fade className="intro-hidden flex flex-col gap-2">
            <dt className="mono uppercase text-black/45">{project.liveLabel === "Live Site" ? "Live" : "Code"}</dt>
            <dd>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-[15px] text-void underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-void"
              >
                {host(project.liveUrl)}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:rotate-45" />
              </a>
            </dd>
          </div>
        </dl>
      </div>

      {/* ── Stage ──────────────────────────────────────────────────────── */}
      <section
        data-theme="dark"
        data-stage
        aria-label={`${project.listTitle} in use`}
        className="relative overflow-hidden bg-void px-gutter py-20 text-fg sm:py-28"
      >
        <div data-device className="relative mx-auto flex w-full max-w-[68rem] justify-center will-change-transform">
          {project.device === "phone" ? (
            <PhoneMockup
              video={project.video}
              poster={project.poster}
              label={`${project.listTitle} app — screen recording`}
              className="w-[clamp(15rem,28vw,22rem)]"
            />
          ) : (
            <LaptopMockup>
              {project.video ? (
                <PreviewVideo
                  src={project.video}
                  poster={project.poster}
                  label={`${project.listTitle} — screen recording`}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0b0b0c] px-[10%] pt-[5%]">
                  <SocketDiagram className="w-full max-w-[34rem]" />
                </div>
              )}
            </LaptopMockup>
          )}
        </div>

        <div className="mx-auto mt-12 flex max-w-[68rem] flex-wrap items-center justify-between gap-6 mono uppercase text-fg-4">
          <span>
            Fig. {pad2(project.index)} — {project.video ? "Screen recording" : "Diagram — no recording yet"}
          </span>
          <Magnetic strength={0.35}>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-28 w-28 flex-col items-center justify-center gap-1.5 rounded-full bg-cobalt text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-transform duration-500 ease-expo hover:scale-105 sm:h-32 sm:w-32"
            >
              {project.liveLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:rotate-45" />
            </a>
          </Magnetic>
        </div>
      </section>

      {/* ── Story ──────────────────────────────────────────────────────── */}
      <div data-theme="light" className="bg-paper px-gutter py-24 text-void sm:py-32">
        <section aria-labelledby="brief-title" className="grid gap-10 lg:grid-cols-12">
          <p className="mono uppercase text-black/45 lg:col-span-3">{label("The brief")}</p>
          <div className="flex flex-col gap-14 lg:col-span-9">
            <h2 id="brief-title" className="sr-only">
              The brief
            </h2>
            <p
              data-reveal
              className="text-[clamp(1.35rem,2.3vw,2.2rem)] font-light leading-[1.4] tracking-[-0.01em] text-black/85"
            >
              {project.about}
            </p>
            <ol className="grid border-t border-black/10 sm:grid-cols-2 sm:gap-x-10">
              {project.highlights.map((highlight, i) => (
                <li
                  key={highlight}
                  data-reveal
                  className="flex gap-5 border-b border-black/10 py-6 text-[15px] leading-relaxed text-black/75"
                >
                  <span className="mono shrink-0 pt-0.5 text-black/35">{pad2(i + 1)}</span>
                  {highlight}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="stack-title" className="mt-24 grid gap-10 sm:mt-32 lg:grid-cols-12">
          <p className="mono uppercase text-black/45 lg:col-span-3">{label("Built with")}</p>
          <div className="lg:col-span-9">
            <h2 id="stack-title" className="sr-only">
              Built with
            </h2>
            <ul data-reveal className="flex flex-wrap gap-2">
              {matched.map((element) => (
                <li
                  key={element.symbol}
                  title={element.note}
                  className="flex h-24 w-24 flex-col justify-between rounded-md border border-black/15 bg-white/50 p-2.5 sm:h-28 sm:w-28"
                >
                  <span className="mono text-[10px] leading-none text-black/40">{pad2(element.number)}</span>
                  <span className="font-heading text-[2rem] leading-none tracking-[-0.03em] [font-variation-settings:'wght'_700]">
                    {element.symbol}
                  </span>
                  <span className="truncate text-[11px] leading-none text-black/60">{element.name}</span>
                </li>
              ))}
              {unmatched.map((name) => (
                <li
                  key={name}
                  className="flex h-24 items-end rounded-md border border-dashed border-black/15 px-3 pb-2.5 mono uppercase text-black/55 sm:h-28"
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-4 mono uppercase text-black/40">
              Solid tiles are elements from the stack table on the home page.
            </p>
          </div>
        </section>

        {project.modules && project.modules.length > 0 && (
          <section aria-labelledby="modules-title" className="mt-24 grid gap-10 sm:mt-32 lg:grid-cols-12">
            <p className="mono uppercase text-black/45 lg:col-span-3">{label("Modules")}</p>
            <div className="lg:col-span-9">
              <h2
                id="modules-title"
                data-reveal
                className="font-heading text-h2 leading-none [font-variation-settings:'wght'_660]"
              >
                {project.modules.length} modules, one platform.
              </h2>
              <ModuleIndex modules={project.modules} />
            </div>
          </section>
        )}

        {project.rolesMatrix && project.rolesMatrix.length > 0 && (
          <section aria-labelledby="roles-title" className="mt-24 grid gap-10 sm:mt-32 lg:grid-cols-12">
            <p className="mono uppercase text-black/45 lg:col-span-3">{label("Access")}</p>
            <div className="lg:col-span-9">
              <h2
                id="roles-title"
                data-reveal
                className="font-heading text-h2 leading-none [font-variation-settings:'wght'_660]"
              >
                {project.rolesMatrix.length} roles, each scoped.
              </h2>
              <ul className="mt-10 border-t border-black/10">
                {project.rolesMatrix.map((persona, i) => (
                  <li
                    key={persona.role}
                    data-reveal
                    className="grid gap-2 border-b border-black/10 py-6 sm:grid-cols-12 sm:gap-6"
                  >
                    <span className="mono text-black/35 sm:col-span-1">{pad2(i + 1)}</span>
                    <span className="font-heading text-xl leading-tight [font-variation-settings:'wght'_640] sm:col-span-3">
                      {persona.role}
                    </span>
                    <span className="mono uppercase text-black/50 sm:col-span-3">{persona.badge}</span>
                    <p className="text-[15px] leading-relaxed text-black/70 sm:col-span-5">{persona.scope}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      {/* ── Next case ──────────────────────────────────────────────────── */}
      <section
        data-theme="dark"
        data-next
        aria-labelledby="next-title"
        className="relative overflow-hidden bg-void px-gutter pb-32 pt-24 text-fg sm:pt-32"
      >
        <div className="flex items-center justify-between mono uppercase text-fg-3">
          <span>Next case</span>
          <span>
            {pad2(next.index)} / {pad2(next.total)}
          </span>
        </div>

        <TransitionLink
          href={`/work/${next.id}`}
          label={next.listTitle}
          data-cursor="view"
          data-cursor-label="Next"
          className="roll-trigger group mt-12 grid items-end gap-10 lg:grid-cols-12"
        >
          <span className="flex flex-col gap-6 lg:col-span-7">
            <span
              id="next-title"
              className="font-heading uppercase leading-[0.82] tracking-[-0.045em] text-fg [font-variation-settings:'wght'_700]"
              style={{ fontSize: nextSize(next.title) }}
            >
              {next.title.split(" ").map((word) => (
                <span key={word} className="block">
                  <RollingText text={word} />
                </span>
              ))}
            </span>
            <span className="flex items-center gap-3 mono uppercase text-fg-3">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: next.accent }} />
              {next.category}
            </span>
          </span>
          <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-elevated ring-1 ring-white/10 lg:col-span-5">
            <span data-next-media className="absolute inset-x-0 -inset-y-[12%] block">
              {next.poster ? (
                <Image
                  src={next.poster}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover object-top transition-[scale] duration-[1.2s] ease-expo group-hover:scale-[1.05]"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-heading text-[clamp(5rem,12vw,11rem)] leading-none text-outline [--outline-color:var(--border-strong)] [font-variation-settings:'wght'_800]">
                  {pad2(next.index)}
                </span>
              )}
            </span>
          </span>
        </TransitionLink>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line-2 pt-8">
          <TransitionLink
            href="/#works"
            label="Work"
            className="roll-trigger group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-fg-2 transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:-translate-x-1" />
            <RollingText text="All work" />
          </TransitionLink>
          <TransitionLink
            href="/contact"
            label="Contact"
            className="roll-trigger group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-fg-2 transition-colors hover:text-lime"
          >
            <RollingText text="Start a project" />
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:rotate-45" />
          </TransitionLink>
        </div>
      </section>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Module index — an accordion set like a table of contents. Rows open with
   a grid-rows transition (no measured heights); closed panels are inert.
   ───────────────────────────────────────────────────────────────────────── */

function ModuleIndex({ modules }: { modules: ProjectModule[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ol className="mt-10 border-t border-black/10">
      {modules.map((module, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-module-${i}`;
        return (
          <li key={module.title} data-reveal className="border-b border-black/10">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-5 py-6 text-left sm:gap-8"
              >
                <span className="mono w-6 shrink-0 text-black/35">{pad2(i + 1)}</span>
                <span className="flex-1 font-heading text-[clamp(1.15rem,2vw,1.9rem)] leading-tight tracking-[-0.015em] [font-variation-settings:'wght'_600] transition-[font-variation-settings] duration-500 ease-expo group-hover:[font-variation-settings:'wght'_760]">
                  {module.title}
                </span>
                {module.badge && (
                  <span className="hidden shrink-0 mono uppercase text-black/45 md:inline">{module.badge}</span>
                )}
                <span
                  aria-hidden
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 transition-[transform,background-color,color,border-color] duration-500 ease-expo",
                    isOpen ? "rotate-45 border-void bg-void text-paper" : "group-hover:border-black/40"
                  )}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-label={module.title}
              inert={!isOpen}
              onTransitionEnd={(event) => {
                if (event.propertyName === "grid-template-rows") ScrollTrigger.refresh();
              }}
              className={cn(
                "grid transition-[grid-template-rows] duration-700 ease-expo",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="grid gap-6 pb-10 pl-11 sm:pl-14 lg:grid-cols-2 lg:gap-12">
                  <p className="text-[15px] leading-relaxed text-black/75">{module.description}</p>
                  {module.points && (
                    <ul className="flex flex-col gap-2.5 text-[15px] leading-relaxed text-black/65">
                      {module.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-black/30" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
