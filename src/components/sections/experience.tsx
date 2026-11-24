"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { roles } from "@/lib/experience";
import { pad2 } from "@/lib/site";

const THEMES = [
  { bg: "var(--pal-cream)", fg: "var(--pal-espresso)", flag: "var(--pal-espresso)", wall: "#e9e5da" },
  { bg: "var(--pal-ink)", fg: "#ffffff", flag: "var(--pal-ink)", wall: "#b9c2c5" },
  { bg: "var(--pal-glass)", fg: "var(--pal-ink)", flag: "#5f8792", wall: "#c6d7dc" },
  { bg: "var(--pal-espresso)", fg: "var(--pal-cream)", flag: "var(--pal-espresso)", wall: "#d8cfc4" },
] as const;

const KIND_LABEL = { internship: "Internship", employment: "Full-time", studio: "Own studio" } as const;
const yearOf = (date: string) => date.match(/\d{4}/)?.[0] ?? date;

const STEP = 58; // vw between checkpoints
const START = 22; // vw where the walker stands
const ROUTE = `calc(${START}vw + ${roles.length * STEP}vw + 40vw)`;

// Trees scattered along the path, as offsets (vw) from the world's start.
const TREES = [8, 30, 47, 63, 88, 104, 121, 146, 163, 179, 204, 221, 238, 262].filter(
  (x) => x < START + roles.length * STEP + 30
);

/** A small walker drawn in the site's ink. Limbs pivot at the hip and shoulder. */
function Walker() {
  return (
    <svg viewBox="0 0 60 120" className="block h-full w-full overflow-visible" aria-hidden>
      <ellipse data-shadow cx="30" cy="118" rx="16" ry="3" fill="var(--pal-ink)" opacity="0.18" />
      <g data-body>
        <g data-arm-b opacity="0.5">
          <line x1="30" y1="44" x2="30" y2="70" stroke="var(--pal-ink)" strokeWidth="6" strokeLinecap="round" />
        </g>
        <g data-leg-b opacity="0.5">
          <line x1="30" y1="76" x2="30" y2="114" stroke="var(--pal-ink)" strokeWidth="7" strokeLinecap="round" />
        </g>
        <rect x="13" y="43" width="12" height="23" rx="4" fill="var(--pal-espresso)" />
        <line x1="30" y1="42" x2="30" y2="78" stroke="var(--pal-ink)" strokeWidth="9" strokeLinecap="round" />
        <circle cx="31" cy="27" r="11" fill="var(--pal-ink)" />
        <path d="M21 23 Q31 9 42 22 L42 19 Q31 6 20 20 Z" fill="var(--pal-espresso)" />
        <g data-leg-f>
          <line x1="30" y1="76" x2="30" y2="114" stroke="var(--pal-ink)" strokeWidth="7" strokeLinecap="round" />
        </g>
        <g data-arm-f>
          <line x1="30" y1="44" x2="30" y2="70" stroke="var(--pal-ink)" strokeWidth="6" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

function Tree({ tall = false }: { tall?: boolean }) {
  return (
    <svg viewBox="0 0 40 80" className={tall ? "h-24 w-12" : "h-16 w-8"} aria-hidden>
      <rect x="18" y="44" width="4" height="36" rx="2" fill="var(--pal-ink)" opacity="0.55" />
      <ellipse cx="20" cy="30" rx="16" ry="26" fill="var(--pal-ink)" opacity="0.16" />
    </svg>
  );
}

function Cloud({ className }: { className: string }) {
  return (
    <svg data-cloud viewBox="0 0 120 40" className={className} aria-hidden>
      <path
        d="M14 34 Q2 34 4 24 Q6 15 18 17 Q22 4 38 7 Q50 -2 64 8 Q78 2 86 14 Q102 11 106 23 Q118 25 114 34 Z"
        fill="#ffffff"
        opacity="0.55"
      />
    </svg>
  );
}

function RoleCard({ index, className = "" }: { index: number; className?: string }) {
  const role = roles[index];
  const theme = THEMES[index % THEMES.length];
  return (
    <article
      className={`relative overflow-hidden rounded-[1.5rem] p-6 shadow-[0_40px_80px_-45px_rgba(21,26,28,0.7)] sm:p-7 ${className}`}
      style={{ background: theme.bg, color: theme.fg }}
    >
      <span aria-hidden className="pointer-events-none absolute -right-3 -top-8 text-[8rem] font-medium leading-none tracking-[-0.08em] opacity-[0.08]">
        {pad2(index + 1)}
      </span>
      <div className="relative flex items-center justify-between gap-4 mono uppercase opacity-70">
        <span className="flex items-center gap-2">
          {role.current && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" />}
          {role.start} — {role.end}
        </span>
        <span className="rounded-full border border-current px-2.5 py-0.5 text-[10px]">{KIND_LABEL[role.kind]}</span>
      </div>
      <h3 className="relative mt-6 text-[clamp(1.35rem,1.9vw,1.9rem)] font-medium leading-[1] tracking-[-0.04em]">{role.company}</h3>
      <p className="relative mt-2 text-[0.95rem] opacity-80">
        {role.title} <span className="opacity-60">· {role.location}</span>
      </p>
      <p className="relative mt-4 border-t border-current/25 pt-3 text-[0.88rem] leading-[1.5] opacity-90">{role.brief[0]}</p>
      <ul className="relative mt-4 flex flex-wrap gap-1.5">
        {role.stack.slice(0, 5).map((tech) => (
          <li key={tech} className="rounded-full border border-current/30 px-2.5 py-0.5 text-[0.72rem] opacity-85">
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * The route so far, walked through a small world. The section pins; scroll
 * moves the ground, trees, hills and clouds past a walker at different
 * depths. The sun arcs across the sky as the journey goes on. Each role is a
 * little building with a flag: it lights up and its card rises as he arrives,
 * and dust kicks up with every footstep.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const world = worldRef.current;
      const walker = walkerRef.current;
      const dust = dustRef.current;
      if (!section || !world || !walker || !dust || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem) and (min-height: 34rem)", () => {
        const flags = gsap.utils.toArray<HTMLElement>("[data-checkpoint]", world);
        const signs = gsap.utils.toArray<HTMLElement>("[data-sign]", section);
        const years = gsap.utils.toArray<HTMLElement>("[data-year]", section);
        const walkerX = () => walker.getBoundingClientRect().left + walker.offsetWidth / 2;
        const distance = () => {
          const last = flags[flags.length - 1];
          return last.offsetLeft + 40 - (walkerX() - world.getBoundingClientRect().left - (gsap.getProperty(world, "x") as number));
        };
        const length = () => distance() * 1.15;

        const q = (sel: string) => walker.querySelector(sel) as SVGGElement;
        const legF = q("[data-leg-f]"), legB = q("[data-leg-b]");
        const armF = q("[data-arm-f]"), armB = q("[data-arm-b]");
        const body = q("[data-body]"), shadow = q("[data-shadow]");
        gsap.set([legF, legB], { svgOrigin: "30 76" });
        gsap.set([armF, armB], { svgOrigin: "30 44" });

        let phase = 0;
        let lastProgress = 0;
        let facing = 1;
        let reached = -2;
        let idleTimer = 0;
        let lastStepSign = 1;

        const pose = (swing: number) => {
          gsap.set(legF, { rotation: swing * 30 });
          gsap.set(legB, { rotation: -swing * 30 });
          gsap.set(armF, { rotation: -swing * 24 });
          gsap.set(armB, { rotation: swing * 24 });
          gsap.set(body, { y: -Math.abs(swing) * 3 });
          gsap.set(shadow, { scaleX: 1 - Math.abs(swing) * 0.15, transformOrigin: "50% 50%" });
        };
        const rest = () => {
          const from = { s: Math.sin(phase) };
          gsap.to(from, { s: 0, duration: 0.35, ease: "power2.out", onUpdate: () => pose(from.s) });
        };

        // A puff of dust behind the planted foot.
        const puff = () => {
          const p = document.createElement("span");
          p.className = "absolute bottom-0 block h-2.5 w-2.5 rounded-full bg-pal-ink/25";
          dust.appendChild(p);
          gsap.fromTo(
            p,
            { x: -facing * 6, y: 0, scale: 0.6, opacity: 0.7 },
            {
              x: -facing * gsap.utils.random(22, 38),
              y: gsap.utils.random(-14, -6),
              scale: gsap.utils.random(1.6, 2.4),
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
              onComplete: () => p.remove(),
            }
          );
        };

        const arrive = (index: number) => {
          flags.forEach((flag, i) => {
            const on = i <= index;
            gsap.to(flag.querySelector("[data-cloth]"), {
              scaleY: on ? 1 : 0,
              duration: 0.7,
              ease: on ? "back.out(2)" : "power2.in",
              overwrite: "auto",
            });
            gsap.to(flag.querySelector("[data-window]"), {
              opacity: on ? 1 : 0.15,
              duration: 0.6,
              overwrite: "auto",
            });
            gsap.to(signs[i], {
              opacity: i === index ? 1 : 0,
              y: i === index ? 0 : i < index ? -40 : 60,
              rotate: i === index ? 0 : i < index ? -4 : 5,
              scale: i === index ? 1 : 0.9,
              duration: 0.8,
              ease: "expo.out",
              overwrite: "auto",
            });
          });
          const showYear = Math.max(0, index);
          years.forEach((el, i) => {
            gsap.to(el, {
              yPercent: i === showYear ? 0 : i < showYear ? -100 : 100,
              opacity: i === showYear ? 1 : 0,
              duration: 0.9,
              ease: "expo.out",
              overwrite: "auto",
            });
          });
          const counter = section.querySelector("[data-counter]");
          if (counter) counter.textContent = pad2(Math.max(1, index + 1));
        };
        arrive(-1);

        const scrub = { trigger: section, start: "top top", end: () => `+=${length()}`, scrub: 0.6, invalidateOnRefresh: true };

        gsap.to(world, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            ...scrub,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const delta = self.progress - lastProgress;
              lastProgress = self.progress;
              if (delta !== 0) {
                const dir = delta > 0 ? 1 : -1;
                if (dir !== facing) {
                  facing = dir;
                  gsap.to(walker, { scaleX: dir, duration: 0.25, ease: "power2.out" });
                }
                phase += Math.abs(delta) * distance() * 0.045;
                const swing = Math.sin(phase);
                pose(swing);
                const sign = swing >= 0 ? 1 : -1;
                if (sign !== lastStepSign) {
                  lastStepSign = sign;
                  puff();
                }
                window.clearTimeout(idleTimer);
                idleTimer = window.setTimeout(rest, 140);
              }
              gsap.set("[data-rail]", { scaleX: self.progress });

              const feet = walkerX();
              let index = -1;
              flags.forEach((flag, i) => {
                if (flag.getBoundingClientRect().left <= feet + 90) index = i;
              });
              if (index !== reached) {
                reached = index;
                arrive(index);
              }
            },
          },
        });

        // Depth: far hills, near hills and clouds move at their own speeds.
        gsap.to("[data-far]", { xPercent: -12, ease: "none", scrollTrigger: scrub });
        gsap.to("[data-mid]", { xPercent: -28, ease: "none", scrollTrigger: scrub });
        gsap.to("[data-clouds]", { xPercent: -20, ease: "none", scrollTrigger: scrub });

        // Morning to evening: the sun arcs over and the sky warms.
        gsap
          .timeline({ scrollTrigger: scrub })
          .fromTo("[data-sun]", { x: "0vw", y: "14svh" }, { x: "-30vw", y: "-4svh", ease: "sine.out", duration: 0.5 })
          .to("[data-sun]", { x: "-62vw", y: "16svh", ease: "sine.in", duration: 0.5 })
          .fromTo("[data-dusk]", { opacity: 0 }, { opacity: 1, ease: "none", duration: 1 }, 0);

        return () => window.clearTimeout(idleTimer);
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-labelledby="experience-title"
      className="relative z-20 -mt-[var(--lap)] overflow-hidden rounded-t-[var(--lap)] bg-pal-stone text-pal-ink"
    >
      <div className="relative pb-24 pt-28 sm:pt-32 lg:h-[100svh] lg:pb-0">
        {/* ── Sky ───────────────────────────────────────────────────────── */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#c9d3d5_0%,#d6d4cf_55%,#d1cec8_100%)]" />
          <div data-dusk className="absolute inset-0 bg-[linear-gradient(180deg,#b9a99d_0%,#d9c7b5_60%,#d1cec8_100%)] opacity-0" />

          {/* Sun */}
          <div data-sun className="absolute right-[12vw] top-[14svh]">
            <span className="absolute -inset-16 rounded-full bg-[radial-gradient(closest-side,rgba(255,246,226,0.85),rgba(255,246,226,0))]" />
            <span className="relative block h-20 w-20 rounded-full bg-[#f6ecd9] shadow-[0_0_60px_rgba(255,240,210,0.9)]" />
          </div>

          {/* The year of the current stop, written large in the sky */}
          <div className="absolute left-0 top-[41svh] overflow-hidden px-gutter">
            <div className="relative h-[min(12vw,17svh)] w-[min(40vw,32rem)]">
              {roles.map((role, i) => (
                <span
                  key={role.id}
                  data-year
                  className="absolute inset-0 flex items-start justify-start text-[min(11vw,16svh)] font-medium leading-[0.85] tracking-[-0.07em] text-pal-ink/[0.13]"
                  style={i === 0 ? undefined : { opacity: 0, transform: "translateY(100%)" }}
                >
                  {yearOf(role.start)}
                </span>
              ))}
            </div>
          </div>

          <div data-clouds className="absolute inset-x-0 top-[22svh] h-[30svh] w-[160%]">
            <Cloud className="cloud-drift absolute left-[6%] top-[4%] w-40" />
            <Cloud className="cloud-drift absolute left-[34%] top-[30%] w-28 [animation-delay:-6s]" />
            <Cloud className="cloud-drift absolute left-[58%] top-[0%] w-48 [animation-delay:-12s]" />
            <Cloud className="cloud-drift absolute left-[82%] top-[40%] w-32 [animation-delay:-3s]" />
          </div>

          {/* Far and near hills */}
          <svg data-far viewBox="0 0 2400 200" preserveAspectRatio="none" className="absolute bottom-[13svh] left-0 h-[30svh] w-[200%] text-pal-ink/[0.07]">
            <path d="M0 200 L0 120 Q150 40 320 110 T680 90 T1050 120 T1400 70 T1800 110 T2400 80 L2400 200 Z" fill="currentColor" />
          </svg>
          <svg data-mid viewBox="0 0 2400 200" preserveAspectRatio="none" className="absolute bottom-[13svh] left-0 h-[18svh] w-[240%] text-pal-ink/[0.10]">
            <path d="M0 200 L0 150 Q200 90 420 140 T860 130 T1280 150 T1700 110 T2100 150 T2400 130 L2400 200 Z" fill="currentColor" />
          </svg>
        </div>

        {/* ── Heading ───────────────────────────────────────────────────── */}
        <div className="relative z-10 px-gutter">
          <div className="flex items-center justify-between mono uppercase text-pal-ink/55">
            <span>Experience</span>
            <span>
              (<span data-counter>01</span> / {pad2(roles.length)})
            </span>
          </div>
          <h2 id="experience-title" className="mt-8 max-w-[14ch] text-[clamp(2.2rem,4.4vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.05em]">
            The route so far.
          </h2>
          <p className="mt-4 hidden mono uppercase text-pal-ink/55 lg:block">Scroll to walk the route →</p>
        </div>

        {/* ── The walker ────────────────────────────────────────────────── */}
        <div
          ref={walkerRef}
          aria-hidden
          className="absolute bottom-[13svh] z-20 hidden origin-bottom lg:block"
          style={{ left: `${START}vw`, height: "clamp(7rem, 17svh, 10rem)", width: "calc(clamp(7rem, 17svh, 10rem) / 2)" }}
        >
          <Walker />
          <div ref={dustRef} className="absolute bottom-0 left-1/2" />
        </div>

        {/* ── The world ─────────────────────────────────────────────────── */}
        <div className="relative mt-12 lg:absolute lg:inset-x-0 lg:bottom-[13svh] lg:mt-0">
          <div ref={worldRef} className="relative will-change-transform lg:h-px" style={{ width: undefined }}>
            <div className="hidden lg:block" style={{ width: ROUTE }} />
            {/* Ground: a road with a dashed centre line, and soil below */}
            <div aria-hidden className="absolute left-0 top-0 hidden h-[3px] rounded-full bg-pal-ink/80 lg:block" style={{ width: ROUTE }} />
            <div
              aria-hidden
              className="absolute left-0 top-3 hidden h-[2px] lg:block"
              style={{ width: ROUTE, backgroundImage: "repeating-linear-gradient(90deg, var(--pal-ink) 0 18px, transparent 18px 42px)", opacity: 0.25 }}
            />
            <div aria-hidden className="absolute left-0 top-[3px] hidden h-[13svh] bg-[#c3beb5] lg:block" style={{ width: ROUTE }} />

            {/* Trees */}
            {TREES.map((x, i) => (
              <span key={x} aria-hidden className="absolute bottom-0 hidden lg:block" style={{ left: `${x}vw` }}>
                <Tree tall={i % 3 === 0} />
              </span>
            ))}

            {/* Start sign */}
            <span aria-hidden className="absolute bottom-0 hidden lg:block" style={{ left: `calc(${START}vw - 7rem)` }}>
              <span className="relative block h-16 w-[3px] bg-pal-ink/70">
                <span className="absolute -left-10 top-1 block whitespace-nowrap rounded-sm bg-pal-ink px-2 py-1 mono uppercase text-pal-cream">
                  Start ↗
                </span>
              </span>
            </span>

            <ol className="flex flex-col gap-5 px-gutter lg:block lg:px-0">
              {roles.map((role, i) => {
                const theme = THEMES[i % THEMES.length];
                return (
                  <li
                    key={role.id}
                    data-checkpoint
                    className="relative lg:absolute lg:bottom-0 lg:left-[var(--at)]"
                    style={{ ["--at" as string]: `calc(${START}vw + ${(i + 1) * STEP}vw - 28vw)` }}
                  >
                    {/* A small building with a flag on its roof */}
                    <div aria-hidden className="absolute bottom-0 left-0 hidden -translate-x-1/2 lg:block">
                      <div className="relative">
                        {/* flag */}
                        <span className="absolute bottom-full left-1/2 block h-14 w-[3px] -translate-x-1/2 bg-pal-ink">
                          <span
                            data-cloth
                            className="flag-wave absolute left-[3px] top-0 block h-7 w-11 origin-left [clip-path:polygon(0_0,100%_20%,80%_50%,100%_80%,0_100%)]"
                            style={{ background: theme.flag }}
                          />
                        </span>
                        {/* roof */}
                        <span className="mx-auto block h-0 w-0 border-x-[46px] border-b-[26px] border-x-transparent border-b-pal-ink" />
                        {/* walls */}
                        <span className="relative block h-20 w-[92px] rounded-b-[3px]" style={{ background: theme.wall }}>
                          <span
                            data-window
                            className="absolute left-3 top-3 block h-6 w-6 rounded-[2px] bg-[#f3dfa4] opacity-15 shadow-[0_0_18px_rgba(243,223,164,0.9)]"
                          />
                          <span className="absolute right-3 top-3 block h-6 w-6 rounded-[2px] bg-pal-ink/15" />
                          <span className="absolute bottom-0 left-1/2 block h-10 w-6 -translate-x-1/2 rounded-t-[3px] bg-pal-ink/80" />
                        </span>
                      </div>
                    </div>
                    <span aria-hidden className="absolute left-0 top-5 hidden -translate-x-1/2 whitespace-nowrap mono uppercase text-pal-ink/65 lg:block">
                      {pad2(i + 1)} · {role.short}
                    </span>

                    {/* Phones read the cards in place; on desktop this copy is for screen readers */}
                    <RoleCard index={i} className="lg:sr-only" />
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* ── Signboard: the current checkpoint's card, just ahead of him ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[6rem] top-[calc(13svh+4rem)] z-30 hidden h-0 w-[min(26rem,34vw)] lg:block [&>[data-sign]]:bottom-auto [&>[data-sign]]:top-0"
        >
          {roles.map((role, i) => (
            <div key={role.id} data-sign className="absolute bottom-0 left-0 w-full opacity-0">
              <RoleCard index={i} />
            </div>
          ))}
        </div>

        {/* Progress rail, under the road */}
        <div className="absolute inset-x-0 bottom-[5svh] z-10 hidden px-gutter lg:block">
          <div className="relative h-px bg-pal-ink/25">
            <span data-rail className="absolute inset-0 origin-left scale-x-0 bg-pal-ink" />
          </div>
        </div>
      </div>
    </section>
  );
}
