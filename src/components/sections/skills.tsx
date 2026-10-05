"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  SiDocker,
  SiExpress,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiRedux,
  SiSocketdotio,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/stores";
import { playTick } from "@/lib/sound";
import { pad2 } from "@/lib/site";
import { allProjects } from "@/lib/projects";
import {
  elements,
  elementUsage,
  groupLabels,
  mernSymbols,
  projectTotal,
  roleTotal,
  type ElementGroup,
  type StackElement,
} from "@/lib/skills";
import { cn } from "@/lib/utils";
import TransitionLink from "@/components/ui/transition-link";
import TextReveal from "@/components/ui/text-reveal";

const ICONS: Record<string, IconType> = {
  Mg: SiMongodb,
  Ex: SiExpress,
  Re: SiReact,
  No: SiNodedotjs,
  Nx: SiNextdotjs,
  Ts: SiTypescript,
  Rn: TbBrandReactNative,
  Tw: SiTailwindcss,
  Io: SiSocketdotio,
  Pg: SiPostgresql,
  Rx: SiRedux,
  Dk: SiDocker,
};

const GROUP_NAMES: Record<ElementGroup, string> = {
  interface: "Interface",
  server: "Server",
  data: "Data",
  tooling: "Tooling",
};

// Placement on the 8-column desktop table. The two outer blocks echo the s-
// and p-blocks of the real periodic table; the hole between them — where a
// printed table keeps its key — holds the readout.
const PLACEMENT: Record<string, readonly [col: number, row: number]> = {
  Mg: [1, 1],
  Ex: [8, 1],
  Re: [1, 2],
  No: [2, 2],
  Nx: [7, 2],
  Ts: [8, 2],
  Rn: [1, 3],
  Tw: [2, 3],
  Io: [7, 3],
  Pg: [8, 3],
  Rx: [1, 4],
  Dk: [2, 4],
};

const SCRAMBLE = "ABCDEFGHIKLMNOPRSTUXabcdegiklmnorstux";

const bySymbol = Object.fromEntries(elements.map((element) => [element.symbol, element])) as Record<
  string,
  StackElement
>;
const groups = Object.keys(groupLabels) as ElementGroup[];
const groupSize = (group: ElementGroup) => elements.filter((element) => element.group === group).length;
const weightOf = (symbol: string) => elementUsage[symbol].projects.length + elementUsage[symbol].roleCount;
const isMern = (symbol: string) => (mernSymbols as readonly string[]).includes(symbol);
const compoundProjects = allProjects.filter((project) =>
  mernSymbols.every((symbol) => project.stack.includes(bySymbol[symbol].name))
);

type Highlight = { kind: "group"; group: ElementGroup } | { kind: "compound" } | null;
type TileState = "focus" | "bond" | "match" | "dim" | "idle";

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const swappedRef = useRef(false);
  const [focus, setFocus] = useState(elements[0].symbol);
  const [hovering, setHovering] = useState(false);
  const [highlight, setHighlight] = useState<Highlight>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();

  const focused = bySymbol[focus];
  const usage = elementUsage[focus];
  const Icon = ICONS[focus];

  const select = (symbol: string) => {
    setHighlight(null);
    if (symbol === focus) return;
    setFocus(symbol);
    // Pitch climbs with the atomic number, so sweeping the table plays a scale.
    playTick(0.85 + bySymbol[symbol].number * 0.03);
  };

  const stateOf = (element: StackElement): TileState => {
    if (highlight) {
      const match = highlight.kind === "group" ? element.group === highlight.group : isMern(element.symbol);
      return match ? "match" : "dim";
    }
    if (element.symbol === focus) return "focus";
    if (focused.bonds.includes(element.symbol)) return "bond";
    return hovering ? "dim" : "idle";
  };

  // Roving focus: the table is one tab stop, arrows walk the atomic numbers.
  const onTableKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = elements.findIndex((element) => element.symbol === focus);
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: elements.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = elements[(moves[event.key] + elements.length) % elements.length];
    select(next.symbol);
    tileRefs.current[next.symbol]?.focus();
  };

  /* ── Entrance: the table fills in, element by element ──────────────── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      if (!prefersReducedMotion()) {
        const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", section);
        const inners = gsap.utils.toArray<HTMLElement>("[data-tile-inner]", section);
        const extras = gsap.utils.toArray<HTMLElement>("[data-table-extra]", section);
        // Tiles transition opacity and borders in CSS for their hover states,
        // so the entrance animates clip-path and an inner wrapper instead.
        gsap.set(tiles, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(inners, { yPercent: 30 });
        gsap.set(extras, { opacity: 0, y: 24 });

        ScrollTrigger.create({
          trigger: "[data-table]",
          start: "top 78%",
          once: true,
          onEnter: () => {
            gsap.to(tiles, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: "expo.out",
              stagger: 0.05,
              clearProps: "clipPath",
            });
            gsap.to(inners, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.05 });
            tiles.forEach((tile, i) => {
              const symbol = tile.querySelector<HTMLElement>("[data-symbol]");
              if (!symbol) return;
              gsap.to(symbol, {
                duration: 0.9,
                delay: 0.1 + i * 0.05,
                scrambleText: { text: symbol.textContent ?? "", chars: SCRAMBLE, speed: 0.55 },
              });
            });
            gsap.to(extras, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.12, delay: 0.35 });
          },
        });
      }

      // This section ships as its own chunk; if it lands after the sections
      // below have measured themselves, their trigger positions are stale.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  /* ── Readout swap on every new element ─────────────────────────────── */
  useGSAP(
    () => {
      if (!swappedRef.current) {
        swappedRef.current = true;
        return;
      }
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-swap]",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.035, overwrite: true }
      );
      gsap.fromTo(
        "[data-nucleus]",
        { scale: 0.55 },
        { scale: 1, duration: 1, ease: "elastic.out(1, 0.45)", svgOrigin: "100 100", overwrite: true }
      );
    },
    { scope: readoutRef, dependencies: [focus] }
  );

  const hint = finePointer
    ? "Hover an element to see what it bonds with and where it turns up in the work."
    : "Tap an element to see what it bonds with and where it turns up in the work.";

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-title"
      className="relative bg-surface py-28 sm:py-36"
    >
      <div className="px-gutter">
        <div className="flex items-center justify-between mono uppercase text-fg-3">
          <span>(03) — Stack</span>
          <span className="hidden sm:inline">
            Periodic table · {elements.length} elements · {groups.length} groups
          </span>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <TextReveal
            as="h2"
            text="Twelve elements. One compound."
            split="words"
            className="max-w-[14ch] font-heading text-h1 text-fg [font-variation-settings:'wght'_620] lg:col-span-8"
          />
          <p className="max-w-[26rem] text-[clamp(1rem,1.25vw,1.15rem)] font-light leading-relaxed text-fg-2 lg:col-span-4 lg:justify-self-end">
            The stack I reach for, set out like the periodic table and numbered so MERN comes first.{" "}
            <span className="text-fg-3">{hint}</span>
          </p>
        </div>
        <span id="skills-title" className="sr-only">
          Tech stack
        </span>

        <div className="@container mx-auto mt-16 max-w-[88rem] sm:mt-20">
          <div
            data-table
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHovering(true);
            }}
            onPointerLeave={() => setHovering(false)}
            className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-8 lg:[--cell:calc((100cqw_-_2.625rem)/8)] lg:[grid-template-rows:repeat(4,var(--cell))]"
          >
            {/* The elements */}
            <div
              role="group"
              aria-label="Stack elements — use the arrow keys to move between them"
              onKeyDown={onTableKeyDown}
              className="contents"
            >
              {elements.map((element) => {
                const [col, row] = PLACEMENT[element.symbol];
                const state = stateOf(element);
                const isFocus = element.symbol === focus;
                return (
                  <button
                    key={element.symbol}
                    ref={(el) => {
                      tileRefs.current[element.symbol] = el;
                    }}
                    type="button"
                    data-tile
                    data-state={state}
                    aria-pressed={isFocus}
                    aria-label={`${element.name}, element ${pad2(element.number)}, ${GROUP_NAMES[element.group]}`}
                    tabIndex={isFocus ? 0 : -1}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") select(element.symbol);
                    }}
                    onFocus={() => select(element.symbol)}
                    onClick={() => select(element.symbol)}
                    style={{ "--col": col, "--row": row } as React.CSSProperties}
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-md border text-left outline-none",
                      "transition-[opacity,border-color,background-color] duration-500 ease-expo",
                      "lg:aspect-auto lg:[grid-column:var(--col)] lg:[grid-row:var(--row)]",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime",
                      state === "focus" && "border-lime bg-lime/[0.07]",
                      state === "bond" && "border-line-3 bg-raised",
                      state === "match" && "border-fg/40 bg-raised",
                      state === "idle" && "border-line-2 bg-surface hover:border-line-3",
                      state === "dim" && "border-line bg-surface opacity-30"
                    )}
                  >
                    <span
                      data-tile-inner
                      className="flex h-full flex-col justify-between p-2 sm:p-2.5 xl:p-3.5"
                    >
                      <span className="flex items-start justify-between mono text-[10px] leading-none xl:text-[11px]">
                        <span className={isFocus ? "text-lime" : "text-fg-3"}>{pad2(element.number)}</span>
                        <span className="hidden text-fg-4 sm:inline">{groupLabels[element.group]}</span>
                      </span>
                      <span
                        data-symbol
                        className="font-heading text-[clamp(1.45rem,3.3vw,3.4rem)] leading-none tracking-[-0.03em] text-fg [font-variation-settings:'wght'_640] transition-[font-variation-settings] duration-500 ease-expo group-hover:[font-variation-settings:'wght'_800] group-aria-pressed:[font-variation-settings:'wght'_800]"
                      >
                        {element.symbol}
                      </span>
                      <span className="flex items-end justify-between gap-1.5">
                        <span className="hidden truncate text-[11px] leading-tight text-fg-2 sm:block xl:text-xs">
                          {element.name}
                        </span>
                        <span className="mono ml-auto text-[10px] leading-none text-fg-4">
                          {weightOf(element.symbol)}
                        </span>
                      </span>
                    </span>
                    {state === "bond" && (
                      <span
                        aria-hidden
                        className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-lime sm:hidden"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Readout — sits where a printed table keeps its key */}
            <div
              ref={readoutRef}
              data-table-extra
              className="@container relative col-span-full mt-4 flex min-h-0 flex-col overflow-hidden rounded-lg border border-line-2 bg-[#131315] p-5 sm:p-6 lg:mt-0 lg:[grid-column:3/7] lg:[grid-row:1/4] lg:p-5 xl:p-7"
            >
              <p className="sr-only" aria-live="polite">
                {focused.name}, element {pad2(focused.number)}. {focused.note}
              </p>

              <div data-swap className="flex items-center justify-between gap-4 mono uppercase text-fg-3">
                <span>
                  No. {pad2(focused.number)} — {GROUP_NAMES[focused.group]}
                </span>
                <span className="flex items-center gap-2 truncate text-fg-2">
                  <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" style={{ color: focused.color }} />
                  <span className="truncate">{focused.name}</span>
                </span>
              </div>

              <div className="mt-5 flex min-h-0 flex-1 gap-5 @lg:gap-7">
                <div className="relative aspect-square w-[34%] max-w-[13.5rem] shrink-0 self-start">
                  <Atom element={focused} animate={!reduceMotion} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    data-swap
                    className="font-heading text-[1.6rem] leading-none tracking-[-0.025em] text-fg [font-variation-settings:'wght'_700] @md:text-[2rem] @xl:text-[2.6rem]"
                  >
                    {focused.name}
                  </h3>
                  <p data-swap className="mt-3 text-[15px] leading-snug text-fg-2 @xl:text-base">
                    {focused.note}
                  </p>
                  <ul data-swap className="mt-4 flex flex-col gap-1.5 text-sm leading-snug text-fg-3 lg:hidden xl:flex">
                    {focused.usedFor.map((use) => (
                      <li key={use} className="flex gap-2.5">
                        <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-fg-4" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div data-swap className="mt-5 flex flex-col gap-3 border-t border-line-2 pt-4">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="mono uppercase text-fg-4">Found in</span>
                  <span className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                    {usage.projects.map((project) => (
                      <TransitionLink
                        key={project.id}
                        href={`/work/${project.id}`}
                        label={project.title}
                        className="text-fg underline decoration-line-3 underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
                      >
                        {project.title}
                      </TransitionLink>
                    ))}
                  </span>
                  <span className="mono ml-auto uppercase text-fg-4">
                    {usage.projects.length}/{projectTotal} projects · {usage.roleCount}/{roleTotal} roles
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:hidden xl:flex">
                  <span className="mono mr-2 uppercase text-fg-4">Bonds with</span>
                  {focused.bonds.map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      onClick={() => {
                        select(symbol);
                        tileRefs.current[symbol]?.focus({ preventScroll: true });
                      }}
                      className="rounded-full border border-line-2 px-3 py-1 text-xs text-fg-2 transition-colors hover:border-lime hover:text-lime"
                    >
                      {bySymbol[symbol].name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* The compound */}
            <HighlightToggle
              data-table-extra
              value={{ kind: "compound" }}
              active={highlight?.kind === "compound"}
              onChange={setHighlight}
              className="col-span-full mt-1.5 flex flex-col items-start justify-between gap-3 rounded-lg border border-line-2 p-4 text-left transition-colors duration-500 ease-expo hover:border-line-3 sm:flex-row sm:items-center lg:mt-0 lg:flex-col lg:items-start lg:[grid-column:3/7] lg:[grid-row:4] xl:p-5"
            >
              <span className="mono uppercase text-fg-3">
                Compound — whole in {compoundProjects.length} of {projectTotal} projects
              </span>
              <span className="font-heading text-[clamp(1.35rem,2.3vw,2.25rem)] leading-none tracking-[-0.02em] text-fg [font-variation-settings:'wght'_680]">
                {mernSymbols.map((symbol, i) => (
                  <Fragment key={symbol}>
                    {i > 0 && <span className="text-fg-4"> + </span>}
                    {symbol}
                  </Fragment>
                ))}
                <span className="text-fg-4"> → </span>
                <span className="text-lime">MERN</span>
              </span>
            </HighlightToggle>

            {/* Groups */}
            <div
              data-table-extra
              className="col-span-full grid grid-cols-4 gap-1.5 lg:[grid-column:7/9] lg:[grid-row:4] lg:grid-cols-2"
            >
              {groups.map((group) => {
                const active = highlight?.kind === "group" && highlight.group === group;
                return (
                  <HighlightToggle
                    key={group}
                    aria-label={`${GROUP_NAMES[group]} — ${groupSize(group)} elements`}
                    value={{ kind: "group", group }}
                    active={active}
                    onChange={setHighlight}
                    className={cn(
                      "flex min-h-14 flex-col justify-between rounded-md border p-2.5 text-left transition-colors duration-500 ease-expo",
                      active ? "border-fg/40 bg-raised" : "border-line-2 hover:border-line-3"
                    )}
                  >
                    <span className="mono text-[10px] leading-none text-fg-4">{pad2(groupSize(group))}</span>
                    <span className="caption text-fg-2">{groupLabels[group]}</span>
                  </HighlightToggle>
                );
              })}
            </div>
          </div>

          <p data-table-extra className="mt-6 mono uppercase text-fg-4">
            Weight = projects + roles an element appears in. Not to be confused with years.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Highlight toggles (compound, groups). Mouse users preview on hover; touch
   and keyboard users toggle on click — event.detail is 0 for clicks that
   come from the keyboard.
   ───────────────────────────────────────────────────────────────────────── */

type HighlightToggleProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> & {
  value: Exclude<Highlight, null>;
  active: boolean;
  onChange: (next: Highlight) => void;
  "data-table-extra"?: boolean;
};

function HighlightToggle({ value, active, onChange, children, ...rest }: HighlightToggleProps) {
  const pointerTypeRef = useRef("mouse");
  return (
    <button
      type="button"
      aria-pressed={active}
      onPointerDown={(event) => {
        pointerTypeRef.current = event.pointerType;
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onChange(value);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") onChange(null);
      }}
      onClick={(event) => {
        if (event.detail !== 0 && pointerTypeRef.current === "mouse") return;
        onChange(active ? null : value);
      }}
      onBlur={() => onChange(null)}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Atom — the focused element as a Bohr model: three electron shells, and
   its bonds orbiting on the outer ring (labels counter-rotate to stay
   upright). SMIL keeps it off the main thread; it pauses off-screen.
   ───────────────────────────────────────────────────────────────────────── */

const SHELL = "M 38 100 a 62 22 0 1 0 124 0 a 62 22 0 1 0 -124 0";
const RING = 86;

function Atom({ element, animate }: { element: StackElement; animate: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !animate) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <svg ref={svgRef} viewBox="0 0 200 200" aria-hidden className="h-full w-full overflow-visible">
      <circle cx="100" cy="100" r={RING} fill="none" stroke="var(--border-medium)" strokeDasharray="1.5 5" />

      <g>
        {animate && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="44s"
            repeatCount="indefinite"
          />
        )}
        {element.bonds.map((symbol, i) => {
          const angle = (i / element.bonds.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <g
              key={symbol}
              transform={`translate(${(100 + RING * Math.cos(angle)).toFixed(2)} ${(100 + RING * Math.sin(angle)).toFixed(2)})`}
            >
              <g>
                {animate && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="-360"
                    dur="44s"
                    repeatCount="indefinite"
                  />
                )}
                <circle r="14" fill="#131315" stroke="var(--border-strong)" />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fill="var(--text-secondary)"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {symbol}
                </text>
              </g>
            </g>
          );
        })}
      </g>

      {[0, 60, 120].map((tilt, i) => (
        <g key={tilt} transform={`rotate(${tilt} 100 100)`}>
          <path id={`${uid}-shell-${i}`} d={SHELL} fill="none" stroke="var(--border-strong)" />
          {animate ? (
            <circle r="3" fill="var(--accent-lime)">
              <animateMotion dur={`${2.4 + i * 0.8}s`} begin={`-${i * 0.7}s`} repeatCount="indefinite">
                <mpath href={`#${uid}-shell-${i}`} />
              </animateMotion>
            </circle>
          ) : (
            <circle r="3" cx={i % 2 ? 38 : 162} cy="100" fill="var(--accent-lime)" />
          )}
        </g>
      ))}

      <g data-nucleus>
        <circle cx="100" cy="100" r="29" fill="var(--accent-lime)" />
        <text
          x="100"
          y="101"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="25"
          fill="#0a0a0b"
          style={{ fontFamily: "var(--font-heading)", fontVariationSettings: "'wght' 760" }}
        >
          {element.symbol}
        </text>
      </g>
    </svg>
  );
}
