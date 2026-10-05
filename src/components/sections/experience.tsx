"use client";

import { useRef } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { certifications, education, roles, type Role, type RoleKind } from "@/lib/experience";
import { pad2, site } from "@/lib/site";
import { getLenis } from "@/lib/stores";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/ui/magnetic";
import TextReveal from "@/components/ui/text-reveal";
import TransitionLink from "@/components/ui/transition-link";
import RollingText from "@/components/ui/rolling-text";

// Mirrors the `rail` custom variant in globals.css.
const RAIL_QUERY =
  "(min-width: 64rem) and (min-height: 37.5rem) and (prefers-reduced-motion: no-preference)";
// Where the train idles, as a share of the viewport width.
const TRAIN_X = 28;

type Stop =
  | { kind: "depot"; id: string; station: string; label: string; period: string }
  | { kind: "role"; id: string; station: string; label: string; period: string; role: Role; branch: boolean }
  | { kind: "terminus"; id: string; station: string; label: string; period: string };

const stops: Stop[] = [
  { kind: "depot", id: "depot", station: education.campus, label: "GEMS College", period: education.period },
  ...roles.map(
    (role): Stop => ({
      kind: "role",
      id: role.id,
      station: role.station,
      label: role.short,
      period: `${role.start} — ${role.end}`,
      role,
      branch: role.kind === "studio",
    })
  ),
  { kind: "terminus", id: "next", station: "Next stop", label: "Yours?", period: "" },
];

const KIND: Record<RoleKind, string> = {
  internship: "Internship",
  employment: "Employment",
  studio: "Own studio",
};

const onBranch = (stop: Stop) => stop.kind === "role" && stop.branch;
// Both lines meet at the last stop, so the departure board names it as such.
const boardLabel = (stop: Stop) => (stop.kind === "terminus" ? "Interchange" : stop.station);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const mm = gsap.matchMedia();

      /* ── Rail: the map slides under a stationary train ─────────────── */
      mm.add(RAIL_QUERY, () => {
        const track = stage.querySelector<HTMLElement>("[data-track]");
        const mainLine = stage.querySelector<HTMLElement>("[data-main-line]");
        const progress = stage.querySelector<HTMLElement>("[data-progress]");
        const branch = stage.querySelector<HTMLElement>("[data-branch]");
        const boardName = stage.querySelector<HTMLElement>("[data-board-name]");
        const boardIndex = stage.querySelector<HTMLElement>("[data-board-index]");
        const stations = gsap.utils.toArray<HTMLElement>("[data-station]", stage);
        const panels = gsap.utils.toArray<HTMLElement>("[data-stop]", stage);
        if (!track || !mainLine || !progress || !branch || !boardName || !boardIndex) return;

        const first = stations[0];
        const last = stations[stations.length - 1];
        const fork = stations.find((station) => station.dataset.branch === "true");
        const distance = () => last.offsetLeft - first.offsetLeft;

        // Lines are drawn between measured stations, so they always meet
        // the dots no matter how the columns flex.
        const layout = () => {
          const d = distance();
          for (const line of [mainLine, progress]) {
            line.style.left = `${first.offsetLeft}px`;
            line.style.width = `${d}px`;
          }
          if (fork) {
            const start = fork.offsetLeft - 72;
            branch.style.left = `${start}px`;
            branch.style.width = `${last.offsetLeft - start}px`;
          }
        };
        layout();

        let active = 0;
        stations[0].dataset.arrived = "true";
        gsap.set(panels, { opacity: 0, pointerEvents: "none" });
        gsap.set(panels[0], { opacity: 1, pointerEvents: "auto" });

        const setActive = (target: number) => {
          const next = gsap.utils.clamp(0, panels.length - 1, target);
          if (next === active) return;
          const previous = panels[active];
          active = next;
          stations.forEach((station, i) => {
            station.dataset.arrived = String(i <= next);
          });

          gsap.to(previous, { opacity: 0, y: -14, duration: 0.3, ease: "power2.in", pointerEvents: "none", overwrite: true });
          gsap.fromTo(
            panels[next],
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.12, ease: "expo.out", pointerEvents: "auto", overwrite: true }
          );
          gsap.fromTo(
            panels[next].querySelectorAll("[data-line]"),
            { opacity: 0, yPercent: 50 },
            { opacity: 1, yPercent: 0, duration: 0.8, delay: 0.16, stagger: 0.035, ease: "expo.out", overwrite: true }
          );
          boardIndex.textContent = `${pad2(next + 1)} / ${pad2(panels.length)}`;
          gsap.to(boardName, {
            duration: 0.7,
            overwrite: true,
            scrambleText: { text: boardLabel(stops[next]), chars: "ABCDEFGHIJKLMNOPRSTUVWY", speed: 0.6 },
          });
        };

        const ride = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: layout,
          },
        });
        ride
          .to(track, { x: () => -distance(), ease: "none" }, 0)
          .fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
        pinRef.current = ride.scrollTrigger ?? null;

        // A station "arrives" as it slides under the train.
        stations.slice(1).forEach((station, i) => {
          ScrollTrigger.create({
            trigger: station,
            containerAnimation: ride,
            start: `left ${TRAIN_X}%`,
            onEnter: () => setActive(i + 1),
            onLeaveBack: () => setActive(i),
          });
        });

        return () => {
          pinRef.current = null;
          stations.forEach((station) => delete station.dataset.arrived);
          for (const el of [mainLine, progress, branch]) el.removeAttribute("style");
        };
      });

      /* ── Vertical line: phones, tablets, short screens, reduced motion ─ */
      mm.add(`not all and ${RAIL_QUERY}`, () => {
        const list = stage.querySelector<HTMLElement>("[data-list]");
        const line = stage.querySelector<HTMLElement>("[data-vline]");
        const progress = stage.querySelector<HTMLElement>("[data-vprogress]");
        const branch = stage.querySelector<HTMLElement>("[data-vbranch]");
        const dots = gsap.utils.toArray<HTMLElement>("[data-vdot]", stage);
        if (!list || !line || !progress || !branch || dots.length < 2) return;

        const centerOf = (dot: HTMLElement) => {
          const item = dot.offsetParent as HTMLElement | null;
          return (item?.offsetTop ?? 0) + dot.offsetTop + dot.offsetHeight / 2;
        };
        const layout = () => {
          const top = centerOf(dots[0]);
          const bottom = centerOf(dots[dots.length - 1]);
          for (const el of [line, progress]) {
            el.style.top = `${top}px`;
            el.style.height = `${bottom - top}px`;
          }
          const fork = dots.find((dot) => dot.dataset.branch === "true");
          if (fork) {
            const start = centerOf(fork) - 26;
            branch.style.top = `${start}px`;
            branch.style.height = `${bottom - start}px`;
          }
        };
        layout();

        const cleanup = () => {
          dots.forEach((dot) => delete dot.dataset.arrived);
          for (const el of [line, progress, branch]) el.removeAttribute("style");
        };

        if (prefersReducedMotion()) {
          dots.forEach((dot) => {
            dot.dataset.arrived = "true";
          });
          gsap.set(progress, { scaleY: 1 });
          const observer = new ResizeObserver(layout);
          observer.observe(list);
          return () => {
            observer.disconnect();
            cleanup();
          };
        }

        gsap.fromTo(
          progress,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: list, start: "top 62%", end: "bottom 62%", scrub: true, onRefresh: layout },
          }
        );
        dots.forEach((dot) => {
          ScrollTrigger.create({
            trigger: dot,
            start: "top 62%",
            onEnter: () => {
              dot.dataset.arrived = "true";
            },
            onLeaveBack: () => {
              dot.dataset.arrived = "false";
            },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-stop]", stage).forEach((item) => {
          gsap.from(item.querySelectorAll("[data-line]"), {
            y: 26,
            opacity: 0,
            duration: 0.9,
            stagger: 0.05,
            ease: "expo.out",
            scrollTrigger: { trigger: item, start: "top 82%", once: true },
          });
        });

        return cleanup;
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // Keyboard users tabbing into the closing stop on the rail get carried to
  // the end of the line, so the focused link is actually on screen.
  const rideToTerminus = () => {
    const pin = pinRef.current;
    if (!pin || window.scrollY >= pin.end - 2) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(pin.end, { immediate: true, force: true });
    else window.scrollTo(0, pin.end);
  };

  return (
    <section id="experience" ref={sectionRef} aria-labelledby="experience-title" className="relative bg-night">
      {/* Intro */}
      <div className="px-gutter pb-16 pt-28 sm:pt-36 rail:pb-20">
        <div className="flex items-center justify-between mono uppercase text-fg-3">
          <span>(04) — Experience</span>
          <span className="hidden sm:inline">Line map · not to scale</span>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <TextReveal
            as="h2"
            text="The route so far."
            split="words"
            className="font-heading text-h1 text-fg [font-variation-settings:'wght'_620] lg:col-span-7"
          />
          <p className="max-w-[26rem] text-[clamp(1rem,1.25vw,1.15rem)] font-light leading-relaxed text-fg-2 lg:col-span-5 lg:justify-self-end">
            Four stops from intern to founder — and, since July 2026, two lines running side by side: the day job
            and a studio of my own.
          </p>
        </div>
        <span id="experience-title" className="sr-only">
          Work experience
        </span>
      </div>

      {/* Stage — pinned on the rail */}
      <div
        ref={stageRef}
        className="relative pb-28 [--branch-gap:3.75rem] [--line-y:62%] rail:h-[100svh] rail:overflow-hidden rail:pb-0"
        style={{ "--train-x": `${TRAIN_X}vw` } as React.CSSProperties}
      >
        {/* Chrome */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-6 z-10 hidden items-center justify-between px-gutter mono uppercase text-fg-3 rail:flex"
        >
          <span>Line map — not to scale</span>
          <span className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="h-[3px] w-5 bg-lime" /> Line 1 · Employment
            </span>
            <span className="flex items-center gap-2">
              <span className="h-[3px] w-5 bg-cobalt" /> Line 2 · Studio
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-[2px] border-2 border-fg-3" /> Depot · Education
            </span>
          </span>
        </div>

        {/* The map strip (decorative — the list below carries the content) */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-[9%] hidden h-[40%] select-none [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] rail:block"
        >
          <div data-track className="relative flex h-full w-max pl-[var(--train-x)] pr-[40vw] will-change-transform">
            <span data-main-line className="absolute top-[var(--line-y)] -mt-[1.5px] h-[3px] bg-line-3" />
            <span
              data-progress
              className="absolute top-[var(--line-y)] -mt-[1.5px] h-[3px] origin-left scale-x-0 bg-lime"
            />
            <span
              data-branch
              className="absolute top-[calc(var(--line-y)-var(--branch-gap))] h-[var(--branch-gap)] rounded-t-[1.75rem] border-[3px] border-b-0 border-cobalt"
            />

            {stops.map((stop) => (
              <div
                key={stop.id}
                data-station
                data-branch={onBranch(stop)}
                className={cn(
                  "group relative h-full shrink-0",
                  stop.kind === "terminus" ? "w-[52vw]" : "w-[max(14rem,21vw)]"
                )}
              >
                {stop.kind === "terminus" && (
                  <span className="absolute left-0 top-[var(--line-y)] h-[3px] w-[34vw] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,var(--border-strong)_0_12px,transparent_12px_22px)]" />
                )}

                <span
                  className={cn(
                    "absolute left-0 z-[1] -translate-x-1/2 -translate-y-1/2 border-[3px] bg-night transition-[background-color,border-color,transform] duration-500 ease-expo",
                    onBranch(stop) ? "top-[calc(var(--line-y)-var(--branch-gap))]" : "top-[var(--line-y)]",
                    stop.kind === "depot" && "h-4 w-4 rounded-[3px] border-fg-3",
                    stop.kind === "role" && "h-4 w-4 rounded-full",
                    stop.kind === "role" && (onBranch(stop) ? "border-cobalt" : "border-fg-3"),
                    stop.kind === "terminus" &&
                      "h-6 w-6 rounded-full border-fg shadow-[0_0_0_3px_var(--bg-primary),0_0_0_6px_var(--accent-cobalt)]",
                    "group-data-[arrived=true]:scale-110",
                    onBranch(stop)
                      ? "group-data-[arrived=true]:bg-cobalt"
                      : "group-data-[arrived=true]:border-lime group-data-[arrived=true]:bg-lime"
                  )}
                />

                <div
                  className={cn(
                    "absolute left-0 flex -translate-x-2 flex-col gap-1.5 whitespace-nowrap",
                    onBranch(stop)
                      ? "bottom-[calc(100%_-_var(--line-y)_+_var(--branch-gap)_+_1.4rem)]"
                      : "top-[calc(var(--line-y)_+_1.5rem)]"
                  )}
                >
                  <span className="font-heading text-[clamp(1rem,1.45vw,1.4rem)] uppercase leading-none tracking-[0.01em] text-fg-3 transition-colors duration-500 [font-variation-settings:'wght'_700] group-data-[arrived=true]:text-fg">
                    {stop.station}
                  </span>
                  <span className="mono uppercase text-fg-4">
                    {stop.label}
                    {stop.period && ` · ${stop.period}`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* The train stays put; the line moves */}
          <span className="train absolute left-[var(--train-x)] top-[var(--line-y)] z-10 -translate-x-1/2 -translate-y-1/2">
            <span className="flex h-[18px] w-[58px] items-center justify-end gap-[3px] rounded-l-[6px] rounded-r-full bg-lime pl-1.5 pr-2.5 shadow-[0_0_0_5px_var(--bg-primary)]">
              <span className="h-[7px] w-[8px] rounded-[2px] bg-void/75" />
              <span className="h-[7px] w-[8px] rounded-[2px] bg-void/75" />
              <span className="h-[7px] w-[8px] rounded-[2px] bg-void/75" />
            </span>
          </span>
        </div>

        {/* Stops — a vertical line on small screens, a departure board on the rail */}
        <div className="relative px-gutter rail:absolute rail:inset-x-0 rail:bottom-0 rail:top-[52%] rail:flex rail:flex-col rail:pb-28">
          <div
            aria-hidden
            className="hidden shrink-0 items-end justify-between border-t border-line-2 pt-5 rail:flex"
          >
            <div className="flex items-baseline gap-5">
              <span className="mono uppercase text-fg-3">Now at</span>
              <span
                data-board-name
                className="font-heading text-[clamp(1.75rem,2.8vw,2.9rem)] uppercase leading-none tracking-[-0.01em] text-fg [font-variation-settings:'wght'_740]"
              >
                {stops[0].station}
              </span>
            </div>
            <span data-board-index className="mono text-fg-3">
              01 / {pad2(stops.length)}
            </span>
          </div>

          <ol
            data-list
            aria-label="Career stops, oldest first"
            className="relative rail:mt-7 rail:min-h-0 rail:flex-1"
          >
            <span aria-hidden data-vline className="absolute left-5 -ml-[1.5px] w-[3px] bg-line-3 rail:hidden" />
            <span
              aria-hidden
              data-vprogress
              className="absolute left-5 -ml-[1.5px] w-[3px] origin-top scale-y-0 bg-lime rail:hidden"
            />
            <span
              aria-hidden
              data-vbranch
              className="absolute left-5 w-[1.15rem] rounded-r-[1rem] border-[3px] border-l-0 border-cobalt rail:hidden"
            />

            {stops.map((stop, i) => (
              <li
                key={stop.id}
                data-stop
                className={cn(
                  "relative pb-16 pl-16 last:pb-0 sm:pl-20",
                  "rail:pointer-events-none rail:absolute rail:inset-0 rail:pb-0 rail:pl-0 rail:opacity-0",
                  i === 0 && "rail:pointer-events-auto rail:opacity-100"
                )}
              >
                <span
                  aria-hidden
                  data-vdot
                  data-branch={onBranch(stop)}
                  className={cn(
                    "absolute top-1 z-[1] -translate-x-1/2 border-[3px] bg-night transition-[background-color,border-color] duration-500 ease-expo rail:hidden",
                    onBranch(stop) ? "left-[calc(1.25rem_+_1.15rem_-_1.5px)]" : "left-5",
                    stop.kind === "depot" ? "h-4 w-4 rounded-[3px]" : "rounded-full",
                    stop.kind === "terminus" ? "h-6 w-6 border-fg" : "h-4 w-4",
                    onBranch(stop)
                      ? "border-cobalt data-[arrived=true]:bg-cobalt"
                      : "border-fg-3 data-[arrived=true]:border-lime data-[arrived=true]:bg-lime"
                  )}
                />
                <StopDetail stop={stop} onTerminusFocus={rideToTerminus} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   One stop's details. Laid out as a single column on the vertical line and
   as a three-column board on the rail.
   ───────────────────────────────────────────────────────────────────────── */

function LineBadge({ stop }: { stop: Stop }) {
  const label = stop.kind === "depot" ? "Depot" : stop.kind === "terminus" ? "L1 · L2" : onBranch(stop) ? "L2" : "L1";
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full border px-2 mono text-[10px] leading-none",
        stop.kind === "role" && (onBranch(stop) ? "border-cobalt text-[#8ea2ff]" : "border-lime/60 text-lime"),
        stop.kind !== "role" && "border-line-3 text-fg-2"
      )}
    >
      {label}
    </span>
  );
}

function StopHeading({ stop }: { stop: Stop }) {
  return (
    <p data-line className="flex flex-wrap items-center gap-3 rail:hidden">
      <LineBadge stop={stop} />
      <span className="caption text-fg-2">{stop.station}</span>
    </p>
  );
}

function StopDetail({ stop, onTerminusFocus }: { stop: Stop; onTerminusFocus: () => void }) {
  if (stop.kind === "depot") {
    return (
      <div className="grid max-w-[58rem] gap-x-10 gap-y-5 rail:h-full rail:max-w-none rail:grid-cols-12">
        <div className="flex flex-col gap-3 rail:col-span-5">
          <StopHeading stop={stop} />
          <p data-line className="mono uppercase text-fg-3">
            {education.period} · Education
          </p>
          <h3 data-line className="font-heading text-h3 text-fg [font-variation-settings:'wght'_680]">
            {education.school}
          </h3>
          <p data-line className="text-fg-2">
            {education.degree} — {education.university}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-fg-2 rail:col-span-5">
          <p data-line>
            Where the line starts: three years of computer science at {education.school}, {education.campus}, under{" "}
            {education.university}.
          </p>
          {certifications.map((cert) => (
            <p data-line key={cert.title} className="flex gap-3">
              <span className="mono shrink-0 pt-[0.2em] uppercase text-fg-4">Also</span>
              <span>
                {cert.title} — {cert.issuer}, {cert.year}
              </span>
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-2 rail:col-span-2">
          <p data-line className="mono uppercase text-fg-4">
            Speaks
          </p>
          <ul className="flex flex-col gap-1 mono uppercase text-fg-2">
            {site.languages.map((language) => (
              <li data-line key={language.name}>
                {language.name} <span className="text-fg-4">· {language.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (stop.kind === "terminus") {
    return (
      <div className="grid max-w-[58rem] gap-x-10 gap-y-6 rail:h-full rail:max-w-none rail:grid-cols-12">
        <div className="flex flex-col gap-3 rail:col-span-5">
          <StopHeading stop={stop} />
          <h3 data-line className="font-heading text-h3 text-fg [font-variation-settings:'wght'_680]">
            The line keeps going.
          </h3>
          <p data-line className="text-fg-2">Both lines meet here — and the next stop is unbuilt.</p>
        </div>
        <p data-line className="text-[15px] leading-relaxed text-fg-2 rail:col-span-4">
          Freelance projects run through {site.studio.name}, the studio I founded in {site.studio.founded}. Everything
          else starts with a message.
        </p>
        <div data-line className="flex flex-wrap items-start gap-3 rail:col-span-3 rail:flex-col">
          <Magnetic strength={0.3}>
            <TransitionLink
              href="/contact"
              label="Contact"
              onFocus={onTerminusFocus}
              className="roll-trigger group inline-flex items-center gap-3 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-void"
            >
              <RollingText text="Start a conversation" />
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:rotate-45" />
            </TransitionLink>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a
              href={site.resume}
              download={site.resumeFileName}
              onFocus={onTerminusFocus}
              className="group inline-flex items-center gap-3 rounded-full border border-line-3 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-fg transition-colors duration-300 hover:border-transparent hover:bg-fg hover:text-void"
            >
              Résumé
              <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </Magnetic>
        </div>
      </div>
    );
  }

  const { role } = stop;
  return (
    <div className="grid max-w-[58rem] gap-x-10 gap-y-5 rail:h-full rail:max-w-none rail:grid-cols-12">
      <div className="flex flex-col gap-3 rail:col-span-5">
        <StopHeading stop={stop} />
        <p data-line className="flex flex-wrap items-center gap-x-3 gap-y-1 mono uppercase text-fg-3">
          <span>{stop.period}</span>
          <span className="text-fg-4">·</span>
          <span>{KIND[role.kind]}</span>
          {role.current && (
            <span className="flex items-center gap-1.5 text-lime">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" /> Current
            </span>
          )}
        </p>
        <h3 data-line className="font-heading text-h3 text-fg [font-variation-settings:'wght'_680]">
          {role.company}
        </h3>
        <p data-line className="text-fg-2">
          {role.title} <span className="text-fg-4">· {role.location}</span>
        </p>
      </div>

      {/* Full résumé bullets on the vertical line; the condensed set on the board. */}
      <ul className="flex flex-col gap-2.5 text-[15px] leading-relaxed text-fg-2 rail:hidden">
        {role.points.map((point) => (
          <li data-line key={point} className="flex gap-3">
            <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-fg-4" />
            {point}
          </li>
        ))}
      </ul>
      <ul className="hidden flex-col gap-2 text-[15px] leading-snug text-fg-2 rail:col-span-5 rail:flex">
        {role.brief.map((point) => (
          <li data-line key={point} className="flex gap-3">
            <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-fg-4" />
            {point}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 rail:col-span-2">
        <p data-line className="mono uppercase text-fg-4">
          Stack
        </p>
        <ul className="flex flex-wrap gap-x-3 gap-y-1 mono uppercase text-fg-2 rail:flex-col">
          {role.stack.map((tech) => (
            <li data-line key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
