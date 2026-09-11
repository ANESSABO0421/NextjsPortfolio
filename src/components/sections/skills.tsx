"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTransition } from "@/components/providers/transition-provider";
import { projectDetails } from "@/lib/projects";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import {
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiSocketdotio,
  SiPostgresql,
  SiRedux,
  SiDocker,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import type { IconType } from "react-icons";

interface Skill {
  /** Must match the spelling used in project `stack` arrays to link projects. */
  name: string;
  Icon: IconType;
  color: string;
  note: string;
  usedFor: string[];
}

const skills: Skill[] = [
  {
    name: "React.js", Icon: SiReact, color: "#61DAFB",
    note: "Component architecture, hooks, render performance.",
    usedFor: ["ERP & HRMS dashboards with 6 role-based views", "Refactoring 6,000+ lines into 50+ modular components"],
  },
  {
    name: "Next.js", Icon: SiNextdotjs, color: "#ffffff",
    note: "App Router, server rendering, SEO-first builds.",
    usedFor: ["Client websites and community platforms", "SEO-friendly pages deployed on Vercel"],
  },
  {
    name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E",
    note: "REST APIs, service-layer design, background jobs.",
    usedFor: ["APIs serving both web and React Native clients", "node-cron jobs for reminders and attendance closing"],
  },
  {
    name: "Express.js", Icon: SiExpress, color: "#e8e8e8",
    note: "Middleware, RBAC, controller/service split.",
    usedFor: ["JWT auth, RBAC and modular middleware routing", "Splitting large controllers into service layers"],
  },
  {
    name: "MongoDB", Icon: SiMongodb, color: "#00ED64",
    note: "Aggregation pipelines, compound indexing.",
    usedFor: ["Aggregation pipelines for alumni and analytics data", "Compound indexes to speed up hot queries"],
  },
  {
    name: "TypeScript", Icon: SiTypescript, color: "#3178C6",
    note: "Typed contracts across the stack.",
    usedFor: ["Typed API contracts and shared models", "Safer refactors in larger codebases"],
  },
  {
    name: "React Native", Icon: TbBrandReactNative, color: "#61DAFB",
    note: "Cross-platform mobile apps with Expo.",
    usedFor: ["Voice-driven expense tracking on mobile", "ERP mobile forms backed by shared REST APIs"],
  },
  {
    name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38BDF8",
    note: "Utility-first, design-system driven UI.",
    usedFor: ["Responsive layouts from 320px phones up", "Consistent design tokens — including this site"],
  },
  {
    name: "Socket.io", Icon: SiSocketdotio, color: "#c9fd34",
    note: "Real-time events, room-scoped broadcasting.",
    usedFor: ["Live HRMS notifications with presence", "Room-scoped broadcasting for real-time updates"],
  },
  {
    name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1",
    note: "Relational schemas, indexed querying.",
    usedFor: ["Relational schemas for structured data", "Joins and indexed queries"],
  },
  {
    name: "Redux Toolkit", Icon: SiRedux, color: "#764ABC",
    note: "Predictable global state at scale.",
    usedFor: ["Global state for data-heavy ERP modules", "Slices for predictable, testable updates"],
  },
  {
    name: "Docker", Icon: SiDocker, color: "#2496ED",
    note: "Containerized builds and environments.",
    usedFor: ["Reproducible local development setups", "Consistent builds across machines"],
  },
];

const REVOLUTION_MS = 42000; // one full lap of the arc
const APEX_DEG = 270; // top-center of the circle in screen space (0 = right, 90 = down)
const STEP = 360 / skills.length;

/**
 * Standalone skills section: tech icons orbit a dome like a marquee. The icon
 * at the apex is "in focus" — it lights up on the arc and a panel below shows
 * what it's used for and which projects use it. Clicking an icon spins it to
 * the apex and holds it there; hovering the arc pauses the orbit.
 *
 * Per-frame positions are written straight to refs; only the focused index is
 * React state, so re-renders happen ~12 times per lap, not 60 times a second.
 */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const radiusRef = useRef(200);
  const rotation = useRef({ deg: 0 });
  const pausedRef = useRef(false);

  const [radius, setRadius] = useState(200);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { transitionTo } = useTransition();

  // Skill name -> projects whose stack lists it. Single source of truth: lib/projects.
  const projectsBySkill = useMemo(() => {
    const all = Object.values(projectDetails);
    return Object.fromEntries(
      skills.map((s) => [
        s.name,
        all.filter((p) => p.stack.includes(s.name)).map((p) => ({ id: p.id, title: p.listTitle })),
      ])
    );
  }, []);

  const measure = useCallback(() => {
    const arc = arcRef.current;
    if (!arc) return;
    const next = Math.round(Math.min(Math.max(arc.clientWidth * 0.42, 130), 340));
    radiusRef.current = next;
    setRadius(next);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Orbit loop.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastActive = -1;
    // Skip a redundant style write when a frame's math produces the same
    // rounded position as the last one (happens constantly on high-refresh
    // displays where deltaMs is tiny) — cuts main-thread work on mobile.
    const lastX = new Array(skills.length).fill(NaN);
    const lastY = new Array(skills.length).fill(NaN);

    const render = () => {
      const r = radiusRef.current;
      let closestDist = 999;
      let closestIndex = 0;

      for (let i = 0; i < skills.length; i++) {
        const theta = (((rotation.current.deg + i * STEP) % 360) + 360) % 360;
        const rad = (theta * Math.PI) / 180;

        let dist = Math.abs(theta - APEX_DEG);
        if (dist > 180) dist = 360 - dist;

        const inDome = dist < 90; // upper half of the circle is the visible arc
        const closeness = inDome ? 1 - dist / 90 : 0;
        const el = iconRefs.current[i];

        if (el) {
          const x = Math.round(r * Math.cos(rad) * 10) / 10;
          const y = Math.round(r * Math.sin(rad) * 10) / 10;
          if (x !== lastX[i] || y !== lastY[i]) {
            lastX[i] = x;
            lastY[i] = y;
            const scale = 0.62 + closeness * 0.6;
            // translate3d promotes each icon to its own GPU layer, so the
            // orbit is pure compositor work — no layout/paint per frame.
            el.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
            el.style.opacity = inDome ? String(Math.min(1, closeness * 1.6 + 0.15)) : "0";
            el.style.zIndex = String(Math.round(closeness * 100));
            // Keep hidden icons out of the tab order / hit testing.
            el.style.pointerEvents = inDome ? "auto" : "none";
            el.tabIndex = inDome ? 0 : -1;
          }
        }

        if (inDome && dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      }

      if (closestIndex !== lastActive) {
        lastActive = closestIndex;
        setActiveIndex(closestIndex);
      }
    };

    // Shares GSAP's ticker with Lenis/ScrollTrigger — one rAF loop for the page.
    // Keeps moving continuously — hovering or focusing a skill never stops it,
    // only the explicit Pause button does.
    const ticker = (_time: number, deltaMs: number) => {
      if (!prefersReducedMotion && !pausedRef.current) {
        rotation.current.deg += (Math.min(deltaMs, 64) / REVOLUTION_MS) * 360;
      }
      render();
    };

    render();

    // Only tick while the section is on screen.
    let running = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          gsap.ticker.add(ticker);
          running = true;
        } else if (!entry.isIntersecting && running) {
          gsap.ticker.remove(ticker);
          running = false;
        }
      },
      { rootMargin: "100px" }
    );
    if (arcRef.current) observer.observe(arcRef.current);

    return () => {
      observer.disconnect();
      gsap.ticker.remove(ticker);
    };
  }, []);

  // Cross-fade the focus panel whenever the focused skill changes.
  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current.querySelectorAll(".focus-fade"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
    );
  }, [activeIndex]);

  // Section header reveal.
  useGSAP(
    () => {
      gsap.fromTo(
        ".skills-reveal",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    },
    { scope: sectionRef }
  );

  const setPausedState = useCallback((value: boolean) => {
    pausedRef.current = value;
    setPaused(value);
  }, []);

  // Spin the clicked icon to the apex along the shortest path. The orbit
  // keeps moving through and past it afterwards — this just fast-forwards
  // to bring that skill into focus rather than stopping on it.
  const focusSkill = useCallback((index: number) => {
    const current = rotation.current.deg;
    let delta = (((APEX_DEG - index * STEP - current) % 360) + 360) % 360;
    if (delta > 180) delta -= 360;
    gsap.to(rotation.current, { deg: current + delta, duration: 0.9, ease: "power3.inOut", overwrite: true });
  }, []);

  const active = skills[activeIndex];
  const activeProjects = projectsBySkill[active.name] ?? [];

  return (
    <section
      id="skills"
      ref={sectionRef}
      // No border here on purpose — About, Skills and Experience all share
      // the same #111112 background so they read as one continuous surface;
      // a border line would print a hairline seam across identical color.
      className="relative w-full bg-[#111112] py-20 sm:py-28 lg:py-32 text-white overflow-hidden"
    >
      {/* Ambient glow spanning the top of the section, tinted by the focused
          skill. Centered well below the top edge (not at 0%) so it has
          already faded to transparent by the time it reaches the boundary
          with About above — that's what avoids the hard seam a gradient (or
          blurred circle) centered right on the edge would print. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] sm:h-[38rem] transition-colors duration-700"
        style={{
          background: `radial-gradient(60% 55% at 50% 38%, color-mix(in srgb, ${active.color} 14%, transparent), transparent 100%)`,
        }}
      />

      <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-24 max-w-7xl mx-auto w-full flex flex-col gap-10 sm:gap-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col gap-4">
            <span className="skills-reveal text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9fd34]" />
              Skills &amp; Stack
            </span>
            <h2 className="skills-reveal font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              My Skills.
            </h2>
          </div>
          <p className="skills-reveal max-w-sm text-sm text-zinc-500 font-light leading-relaxed">
            The tools I ship production work with. Tap any icon to bring it into
            focus and see what I use it for.
          </p>
        </div>

        {/* Orbit stage — circle is centered on the stage's bottom edge, so only the dome shows */}
        <div
          ref={arcRef}
          className="relative w-full overflow-hidden"
          style={{ height: radius + 60 }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-full rounded-full border border-dashed border-white/[0.09]"
            style={{ width: radius * 2, height: radius * 2, transform: "translate(-50%, -50%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-full rounded-full border border-white/[0.04]"
            style={{ width: radius * 1.55, height: radius * 1.55, transform: "translate(-50%, -50%)" }}
          />

          {skills.map((skill, i) => (
            <button
              key={skill.name}
              type="button"
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              onClick={() => focusSkill(i)}
              aria-label={`Focus ${skill.name}`}
              aria-pressed={i === activeIndex}
              style={{ "--accent": skill.color } as React.CSSProperties}
              className={`absolute left-1/2 top-full flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border bg-[#151517] cursor-pointer will-change-transform transition-[border-color,box-shadow] duration-500 focus-visible:outline-2 focus-visible:outline-[#c9fd34] ${
                i === activeIndex
                  ? "border-[color:var(--accent)]/50 shadow-[0_0_32px_-6px_var(--accent)]"
                  : "border-white/[0.08] shadow-lg hover:border-white/20"
              }`}
            >
              <skill.Icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: "var(--accent)" }} />
            </button>
          ))}
        </div>

        {/* Focus card — sits centered right under the arc apex, no boxed panel */}
        <div
          ref={panelRef}
          className="relative z-10 -mt-3 sm:-mt-5 mx-auto flex w-full max-w-lg flex-col items-center gap-4 text-center"
          style={{ "--accent": active.color } as React.CSSProperties}
        >
          <span
            className="focus-fade flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border shadow-[0_0_40px_-12px_var(--accent)]"
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
              background: "color-mix(in srgb, var(--accent) 12%, #151517)",
            }}
          >
            <active.Icon className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: active.color }} />
          </span>

          <div className="focus-fade flex flex-col gap-1.5">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">{active.name}</h3>
            <p className="max-w-xs mx-auto text-xs sm:text-sm text-zinc-500 font-light leading-relaxed">
              {active.note}
            </p>
          </div>

          <ul className="focus-fade flex flex-col items-center gap-1.5">
            {active.usedFor.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-xs sm:text-sm leading-relaxed text-zinc-300 font-light"
              >
                <span className="h-1 w-1 shrink-0 rounded-full" style={{ background: active.color }} />
                {item}
              </li>
            ))}
          </ul>

          {activeProjects.length > 0 ? (
            <div className="focus-fade flex flex-wrap items-center justify-center gap-2 pt-1">
              {activeProjects.map((p) => (
                <a
                  key={p.id}
                  href={`/work/${p.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    transitionTo(`/work/${p.id}`, p.title);
                  }}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors duration-300 hover:bg-white hover:text-black hover:border-transparent"
                >
                  {p.title}
                  <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:rotate-45" />
                </a>
              ))}
            </div>
          ) : (
            <p className="focus-fade text-xs text-zinc-600 font-light leading-relaxed pt-1">
              Used in professional and client work rather than a listed case study.
            </p>
          )}

          <button
            type="button"
            onClick={() => setPausedState(!paused)}
            className="focus-fade inline-flex items-center gap-2 pt-1 text-[10px] uppercase tracking-widest font-semibold text-zinc-600 hover:text-white transition-colors"
          >
            {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            {paused ? "Resume orbit" : "Pause orbit"}
          </button>
        </div>
      </div>
    </section>
  );
}
