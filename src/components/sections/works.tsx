"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { allProjects, projectDetails, type ProjectDetail } from "@/lib/projects";
import { pad2 } from "@/lib/site";
import { playTick } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { scrollToHash } from "@/components/providers/transition-provider";
import TransitionLink from "@/components/ui/transition-link";
import TextReveal from "@/components/ui/text-reveal";
import RollingText from "@/components/ui/rolling-text";
import PreviewVideo from "@/components/ui/preview-video";
import PhoneMockup from "@/components/ui/phone-mockup";
import SocketDiagram from "@/components/ui/socket-diagram";

const projects = allProjects.map((project) => projectDetails[project.id]);
const host = (url: string) => new URL(url).host.replace(/^www\./, "");

/**
 * The work, laid out like an issue of a magazine: a contents page, then one
 * spread per case study — each with its own grid, as an art director would
 * set them, rather than six copies of the same card.
 */
export default function Works() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>("[data-spread]", section).forEach((spread) => {
        const chars = spread.querySelectorAll("[data-char]");
        if (chars.length) {
          gsap.fromTo(
            chars,
            { yPercent: 112 },
            {
              yPercent: 0,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.035,
              scrollTrigger: { trigger: spread, start: "top 80%", once: true },
            }
          );
        }
        const reveals = spread.querySelectorAll("[data-reveal]");
        if (reveals.length) {
          gsap.fromTo(
            reveals,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: spread, start: "top 72%", once: true },
            }
          );
        }
      });

      // Footage drifts inside its frame, a touch slower than the page.
      gsap.utils.toArray<HTMLElement>("[data-parallax]", section).forEach((inner) => {
        gsap.fromTo(
          inner,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: inner.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      // The cover opens from a framed plate to full bleed.
      gsap.utils.toArray<HTMLElement>("[data-cover-clip]", section).forEach((plate) => {
        gsap.fromTo(
          plate,
          { clipPath: "inset(8% 11% 8% 11% round 1.5rem)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0rem)",
            ease: "none",
            scrollTrigger: { trigger: plate, start: "top 92%", end: "top 8%", scrub: true },
          }
        );
      });

      // Footage that slides across the type it sits on.
      gsap.utils.toArray<HTMLElement>("[data-drift]", section).forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 9 },
          {
            xPercent: -9,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      // Objects that travel faster than the page around them.
      gsap.utils.toArray<HTMLElement>("[data-float]", section).forEach((el) => {
        gsap.fromTo(
          el,
          { y: 90 },
          {
            y: -90,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="works" ref={sectionRef} aria-labelledby="works-title" className="relative bg-void py-28 sm:py-36">
      {/* Contents */}
      <div className="px-gutter">
        <div className="flex items-center justify-between mono uppercase text-fg-3">
          <span>(05) — Work</span>
          <span className="hidden sm:inline">Issue ’26 · {projects.length} case studies</span>
        </div>
        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <TextReveal
            as="h2"
            text="Selected work."
            split="words"
            className="font-heading text-display text-fg [font-variation-settings:'wght'_640] lg:col-span-6"
          />
          <nav aria-label="Case studies in this issue" className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <p className="mono uppercase text-fg-4">In this issue</p>
            <ol className="mt-4 border-t border-line-2">
              {projects.map((project) => (
                <li key={project.id} className="border-b border-line-2">
                  <a
                    href={`#work-${project.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToHash(`#work-${project.id}`);
                    }}
                    onPointerEnter={() => playTick(1 + project.index * 0.04)}
                    className="backlit roll-trigger group grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-4 py-3.5 outline-none sm:grid-cols-[2.5rem_1fr_auto_3rem]"
                  >
                    <span className="mono text-fg-4">{pad2(project.index)}</span>
                    <span className="flex items-center gap-3 font-heading text-[clamp(1.2rem,1.7vw,1.6rem)] leading-none text-fg [font-variation-settings:'wght'_620]">
                      <RollingText text={project.listTitle} />
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 scale-0 rounded-full transition-transform duration-500 ease-expo group-hover:scale-100 group-focus-visible:scale-100"
                        style={{ background: project.accent }}
                      />
                    </span>
                    <span className="hidden mono uppercase text-fg-3 sm:block">{project.category}</span>
                    <span className="mono text-right text-fg-4">p.{pad2(project.index * 2)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <span id="works-title" className="sr-only">
          Selected work
        </span>
      </div>

      {/* Spreads */}
      <div className="mt-32 flex flex-col gap-36 sm:mt-44 sm:gap-48">
        {projects.map((project) => {
          const Spread = SPREADS[project.id] ?? QuoteSpread;
          return (
            <div key={project.id}>
              <Spread project={project} />
              <Folio project={project} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Shared pieces
   ───────────────────────────────────────────────────────────────────────── */

type SpreadProps = { project: ProjectDetail };

function Kicker({ project, note }: { project: ProjectDetail; note: string }) {
  return (
    <div
      data-reveal
      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mono uppercase text-fg-3"
    >
      <span className="flex items-center gap-3">
        <span className="text-fg">{pad2(project.index)}</span>
        <span className="text-fg-4">/ {pad2(project.total)}</span>
        <span aria-hidden className="h-px w-8 bg-line-3" />
        <span>{note}</span>
      </span>
      <span className="flex items-center gap-2.5">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: project.accent }} />
        {project.category} · {project.year}
      </span>
    </div>
  );
}

/** Decorative title set letter by letter, so each glyph can rise through its own mask. */
function Letters({ lines, className, lineClassNames }: { lines: string[]; className?: string; lineClassNames?: string[] }) {
  return (
    <span aria-hidden className={cn("block", className)}>
      {lines.map((line, l) => (
        <span key={l} className={cn("block whitespace-nowrap", lineClassNames?.[l])}>
          {Array.from(line).map((char, i) => (
            <span key={i} className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-top">
              <span data-char className="inline-block">
                {char === " " ? " " : char}
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/** The one real heading per spread — visual titles are decoration. */
function SpreadHeading({ project }: SpreadProps) {
  return (
    <h3 id={`work-${project.id}-title`} className="sr-only">
      {project.listTitle} — {project.category}
    </h3>
  );
}

function CaseLink({
  project,
  className,
  children,
  view = false,
}: {
  project: ProjectDetail;
  className?: string;
  children: React.ReactNode;
  /** Media links: hidden from assistive tech (the "Read" link covers them) and shown with the VIEW cursor. */
  view?: boolean;
}) {
  return (
    <TransitionLink
      href={`/work/${project.id}`}
      label={project.listTitle}
      className={className}
      {...(view
        ? { "aria-hidden": true, tabIndex: -1, "data-cursor": "view", "data-cursor-label": "View" }
        : {})}
    >
      {children}
    </TransitionLink>
  );
}

function Footage({ project, className }: SpreadProps & { className?: string }) {
  return (
    <span className={cn("group/footage relative block overflow-hidden bg-elevated", className)}>
      <span data-parallax className="absolute inset-x-0 -inset-y-[9%] block">
        {project.video && (
          <PreviewVideo
            src={project.video}
            poster={project.poster}
            label={`${project.listTitle} — screen recording`}
            className="h-full w-full object-cover transition-[scale] duration-[1.2s] ease-expo group-hover/footage:scale-[1.035]"
          />
        )}
      </span>
    </span>
  );
}

function ReadMore({ project }: SpreadProps) {
  return (
    <CaseLink
      project={project}
      className="roll-trigger group inline-flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.14em] text-fg"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line-3 transition-colors duration-500 ease-expo group-hover:border-lime group-hover:bg-lime group-hover:text-void">
        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:rotate-45" />
      </span>
      <RollingText text="Read the case study" />
      <span className="sr-only">: {project.listTitle}</span>
    </CaseLink>
  );
}

function StackLine({ project }: SpreadProps) {
  return <p className="mono uppercase leading-relaxed text-fg-3">{project.stack.join(" / ")}</p>;
}

function Highlights({ project, count = 3 }: SpreadProps & { count?: number }) {
  return (
    <ul className="flex flex-col gap-2.5 text-[15px] leading-relaxed text-fg-2">
      {project.highlights.slice(0, count).map((highlight) => (
        <li key={highlight} className="flex gap-3">
          <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-fg-4" />
          {highlight}
        </li>
      ))}
    </ul>
  );
}

function Folio({ project }: SpreadProps) {
  return (
    <div aria-hidden className="mt-20 flex items-center gap-5 px-gutter mono text-fg-4 sm:mt-24">
      <span className="h-px flex-1 bg-line" />
      <span>— {pad2(project.index * 2)} —</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Spreads
   ───────────────────────────────────────────────────────────────────────── */

/** 01 — Cover story: the name across the full measure, footage opening to full bleed. */
function CoverSpread({ project }: SpreadProps) {
  return (
    <article id={`work-${project.id}`} data-spread aria-labelledby={`work-${project.id}-title`} className="relative">
      <SpreadHeading project={project} />
      <div className="px-gutter">
        <Kicker project={project} note="Cover story" />
        <CaseLink project={project} view className="mt-6 block">
          <Letters
            lines={[project.title]}
            className="font-heading text-[12.6vw] uppercase leading-[0.8] tracking-[-0.055em] text-fg [font-variation-settings:'wght'_780]"
          />
        </CaseLink>
      </div>
      <CaseLink project={project} view className="mt-8 block sm:mt-10">
        <span data-cover-clip className="block">
          <Footage project={project} className="aspect-[4/3] max-h-[92svh] w-full sm:aspect-[16/9]" />
        </span>
      </CaseLink>
      <div className="mt-12 grid gap-10 px-gutter sm:mt-16 lg:grid-cols-12">
        <p data-reveal className="text-lead font-light text-fg lg:col-span-6">
          {project.tagline}
        </p>
        <dl data-reveal className="grid content-start gap-5 text-sm lg:col-span-3">
          <div className="flex flex-col gap-1.5">
            <dt className="mono uppercase text-fg-4">Role</dt>
            <dd className="text-fg-2">{project.role}</dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="mono uppercase text-fg-4">Credits</dt>
            <dd className="text-fg-2">{project.credits}</dd>
          </div>
        </dl>
        <div data-reveal className="flex flex-col items-start gap-8 lg:col-span-3">
          <StackLine project={project} />
          <ReadMore project={project} />
        </div>
      </div>
    </article>
  );
}

/** 02 — Phone: the name runs up the spine, the handset floats ahead of the page. */
function PhoneSpread({ project }: SpreadProps) {
  return (
    <article id={`work-${project.id}`} data-spread aria-labelledby={`work-${project.id}-title`} className="relative px-gutter">
      <SpreadHeading project={project} />
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div aria-hidden className="hidden h-full items-center lg:col-span-3 lg:flex">
          <span className="font-heading text-[min(10.5vw,12.5svh)] uppercase leading-[0.8] tracking-[-0.04em] text-fg [font-variation-settings:'wght'_700] [writing-mode:vertical-rl] rotate-180">
            <Letters lines={[project.title]} />
          </span>
        </div>

        <div className="flex flex-col gap-8 lg:hidden">
          <Kicker project={project} note="Mobile" />
          <Letters
            lines={[project.title]}
            className="font-heading text-[13.5vw] uppercase leading-[0.8] tracking-[-0.04em] text-fg [font-variation-settings:'wght'_700]"
          />
        </div>

        <div className="flex justify-center lg:col-span-4">
          <CaseLink project={project} view className="block">
            <span data-float className="block">
              <PhoneMockup video={project.video} poster={project.poster} label={`${project.listTitle} app — screen recording`} />
            </span>
          </CaseLink>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
          <div className="hidden lg:block">
            <Kicker project={project} note="Mobile" />
          </div>
          <p data-reveal className="font-heading text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1.12] tracking-[-0.02em] text-fg [font-variation-settings:'wght'_520]">
            {project.tagline}
          </p>
          <div data-reveal>
            <Highlights project={project} />
          </div>
          <div data-reveal className="flex flex-col items-start gap-8">
            <StackLine project={project} />
            <ReadMore project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

/** 03 — Feature: the name set huge, the footage sliding across its lower edge. */
function BehindSpread({ project }: SpreadProps) {
  const [first, ...rest] = project.title.split(" ");
  const titleClass =
    "font-heading text-[10vw] uppercase leading-[0.8] tracking-[-0.05em] text-fg [font-variation-settings:'wght'_700]";
  return (
    <article id={`work-${project.id}`} data-spread aria-labelledby={`work-${project.id}-title`} className="relative overflow-hidden">
      <SpreadHeading project={project} />
      <div className="px-gutter">
        <Kicker project={project} note="Feature" />
      </div>
      {/* One grid, three overlapping cells: the footage starts inside the
          first line and fills the space the right-set second line leaves. */}
      <div className="mt-8 grid gap-y-8 px-gutter sm:mt-12 lg:grid-cols-12 lg:gap-y-0">
        <Letters lines={[first]} className={cn(titleClass, "lg:col-span-12 lg:row-start-1")} />
        <Letters
          lines={[rest.join(" ")]}
          className={cn(titleClass, "text-right lg:col-span-4 lg:col-start-9 lg:row-start-2")}
        />
        <CaseLink
          project={project}
          view
          className="relative z-10 block lg:col-span-6 lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:-mt-[3.2vw]"
        >
          <span data-drift className="block">
            <Footage
              project={project}
              className="aspect-[832/480] w-full rounded-xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
            />
          </span>
        </CaseLink>
      </div>
      <div className="mt-12 grid gap-10 px-gutter sm:mt-16 lg:grid-cols-12">
        <p data-reveal className="text-lead font-light text-fg lg:col-span-5">
          {project.tagline}
        </p>
        <div data-reveal className="lg:col-span-4 lg:col-start-6">
          <Highlights project={project} />
        </div>
        <div data-reveal className="flex flex-col items-start gap-8 lg:col-span-3 lg:col-start-10 lg:items-end">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 mono uppercase text-fg-2 transition-colors hover:text-lime"
          >
            {host(project.liveUrl)}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:rotate-45" />
          </a>
          <ReadMore project={project} />
        </div>
      </div>
    </article>
  );
}

/** 04 — Pull quote: the pitch set as display type beside a small framed figure. */
function QuoteSpread({ project }: SpreadProps) {
  return (
    <article id={`work-${project.id}`} data-spread aria-labelledby={`work-${project.id}-title`} className="relative px-gutter">
      <SpreadHeading project={project} />
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-10 lg:col-span-7">
          <Kicker project={project} note="Client work" />
          <Letters
            lines={[project.title]}
            className="font-heading text-[14vw] uppercase leading-[0.8] tracking-[-0.045em] text-fg [font-variation-settings:'wght'_700] lg:text-[8vw]"
          />
          <blockquote
            data-reveal
            className="font-heading text-[clamp(1.75rem,3.3vw,3.4rem)] leading-[1.08] tracking-[-0.025em] text-fg-2 [font-variation-settings:'wght'_480]"
          >
            <span aria-hidden className="text-lime">“</span>
            {project.tagline}
            <span aria-hidden className="text-lime">”</span>
          </blockquote>
          <div data-reveal className="flex flex-wrap items-center justify-between gap-8">
            <StackLine project={project} />
            <ReadMore project={project} />
          </div>
        </div>
        <figure data-reveal className="lg:col-span-5 lg:self-end">
          <CaseLink project={project} view className="block">
            <Footage project={project} className="aspect-[960/444] w-full rounded-xl ring-1 ring-white/10" />
          </CaseLink>
          <figcaption className="mt-3 flex items-center justify-between mono uppercase text-fg-4">
            <span>Fig. {pad2(project.index)}</span>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-lime"
            >
              {host(project.liveUrl)} ↗
            </a>
          </figcaption>
        </figure>
      </div>
    </article>
  );
}

/** 05 — Split: footage bleeds off the left edge, the name stacks beside it. */
function SplitSpread({ project }: SpreadProps) {
  const name = project.listTitle;
  const cut = Math.ceil(name.length / 2);
  const isCamel = /[a-z][A-Z]/.test(name);
  const [top, bottom] = isCamel
    ? [name.slice(0, name.search(/[a-z][A-Z]/) + 1), name.slice(name.search(/[a-z][A-Z]/) + 1)]
    : [name.slice(0, cut), name.slice(cut)];

  return (
    <article id={`work-${project.id}`} data-spread aria-labelledby={`work-${project.id}-title`} className="relative">
      <SpreadHeading project={project} />
      <div className="px-gutter lg:hidden">
        <Kicker project={project} note="Tooling" />
      </div>
      <div className="mt-8 grid items-center gap-12 lg:mt-0 lg:grid-cols-12 lg:gap-10">
        <CaseLink project={project} view className="block lg:col-span-7">
          <Footage project={project} className="aspect-[832/480] w-full lg:rounded-r-2xl" />
        </CaseLink>
        <div className="flex flex-col gap-8 px-gutter lg:col-span-5 lg:pl-0">
          <div className="hidden lg:block">
            <Kicker project={project} note="Tooling" />
          </div>
          <Letters
            lines={[top.toUpperCase(), bottom.toUpperCase()]}
            lineClassNames={["", "text-outline [--outline-color:var(--text-secondary)]"]}
            className="font-heading text-[18vw] leading-[0.8] tracking-[-0.05em] text-fg [font-variation-settings:'wght'_700] lg:text-[8.6vw]"
          />
          <p data-reveal className="text-lead font-light text-fg">
            {project.tagline}
          </p>
          <div data-reveal>
            <Highlights project={project} />
          </div>
          <div data-reveal className="flex flex-col items-start gap-8">
            <StackLine project={project} />
            <ReadMore project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

/** 06 — No footage: the mechanism, drawn. */
function SignalSpread({ project }: SpreadProps) {
  return (
    <article id={`work-${project.id}`} data-spread aria-labelledby={`work-${project.id}-title`} className="relative px-gutter">
      <SpreadHeading project={project} />
      <Kicker project={project} note="No footage — a diagram instead" />
      <CaseLink project={project} view className="mt-6 block">
        <Letters
          lines={[project.title]}
          className="font-heading text-[11.3vw] uppercase leading-[0.8] tracking-[-0.055em] text-fg [font-variation-settings:'wght'_780]"
        />
      </CaseLink>
      <div className="mt-14 grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <p data-reveal className="text-lead font-light text-fg">
            {project.tagline}
          </p>
          <div data-reveal>
            <Highlights project={project} />
          </div>
          <div data-reveal className="flex flex-col items-start gap-8">
            <StackLine project={project} />
            <ReadMore project={project} />
          </div>
        </div>
        <div data-reveal className="lg:col-span-6 lg:col-start-7">
          <SocketDiagram />
        </div>
      </div>
    </article>
  );
}

const SPREADS: Record<string, (props: SpreadProps) => React.ReactElement> = {
  obsera: CoverSpread,
  spendova: PhoneSpread,
  "malappuram-fc": BehindSpread,
  kriscorp: QuoteSpread,
  devpulse: SplitSpread,
  synapse: SignalSpread,
};
