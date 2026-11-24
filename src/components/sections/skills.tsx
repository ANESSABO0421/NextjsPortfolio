"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { elements, groupLabels, projectTotal, roleTotal, type ElementGroup } from "@/lib/skills";
import { pad2 } from "@/lib/site";
import TextReveal from "@/components/ui/text-reveal";
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

// Brand marks, keyed by the same spelling the data uses.
const LOGOS: Record<string, IconType> = {
  MongoDB: SiMongodb,
  "Express.js": SiExpress,
  "React.js": SiReact,
  "Node.js": SiNodedotjs,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  "React Native": TbBrandReactNative,
  "Tailwind CSS": SiTailwindcss,
  "Socket.io": SiSocketdotio,
  PostgreSQL: SiPostgresql,
  "Redux Toolkit": SiRedux,
  Docker: SiDocker,
};
const colorOf = Object.fromEntries(elements.map((e) => [e.name, e.color]));

function Logo({ name, className }: { name: string; className?: string }) {
  const Icon = LOGOS[name];
  return Icon ? <Icon aria-hidden className={className} /> : null;
}

const names = elements.map((element) => element.name);
const half = Math.ceil(names.length / 2);
const rows = [names.slice(0, half), names.slice(half)];

const groups = (Object.keys(groupLabels) as ElementGroup[]).map((group) => ({
  group,
  label: groupLabels[group],
  items: elements.filter((element) => element.group === group).map((element) => element.name),
}));

const stats = [
  { value: projectTotal, label: "Products shipped" },
  { value: roleTotal, label: "Teams worked with" },
  { value: elements.length, label: "Tools in daily use" },
];

/** Two oversized tool ribbons running against each other, slowed by hover. */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>("[data-count]", section).forEach((el) => {
        const target = Number(el.dataset.count);
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 1.8,
          ease: "expo.out",
          onUpdate: () => {
            el.textContent = pad2(Math.round(state.value));
          },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.fromTo(
        "[data-group]",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-groups]", start: "top 88%", once: true },
        }
      );

      // The ribbons also respond to the scroll — they slide a little further.
      gsap.utils.toArray<HTMLElement>("[data-ribbon]", section).forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: i % 2 ? -8 : 8 },
          {
            xPercent: i % 2 ? 8 : -8,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-title"
      className="relative z-30 -mt-[var(--lap)] overflow-hidden rounded-t-[var(--lap)] bg-pal-ink py-28 text-white sm:py-40"
    >
      <div className="px-gutter">
        <div className="flex items-center justify-between mono uppercase text-white/50">
          <span>Stack</span>
          <span>(MERN +)</span>
        </div>
        <TextReveal
          as="h2"
          text="Tools I reach for."
          split="words"
          className="mt-10 max-w-[11ch] text-[clamp(2.4rem,5.6vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.05em]"
        />
        <span id="skills-title" className="sr-only">
          Stack
        </span>
      </div>

      <div className="mt-20 flex flex-col gap-2 sm:mt-28" aria-label={names.join(", ")}>
        {rows.map((row, r) => (
          <div key={r} data-ribbon aria-hidden className="group/ribbon flex overflow-hidden">
            <div
              className={`marquee-track flex w-max shrink-0 items-center whitespace-nowrap group-hover/ribbon:[animation-play-state:paused] ${
                r % 2 ? "[animation-direction:reverse]" : ""
              }`}
              style={{ ["--marquee-speed" as string]: `${48 + r * 14}s` }}
            >
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center">
                  {row.map((name) => (
                    <span key={name + copy} className="group/tool flex items-center">
                      {/* Logo badge — lights up in its brand colour on hover */}
                      <span
                        className="ml-[0.25em] flex h-[clamp(2.2rem,4.8vw,4.8rem)] w-[clamp(2.2rem,4.8vw,4.8rem)] shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] transition-all duration-500 ease-expo group-hover/tool:scale-110 group-hover/tool:border-transparent group-hover/tool:bg-[var(--brand)]"
                        style={{ ["--brand" as string]: colorOf[name] }}
                      >
                        <Logo
                          name={name}
                          className="h-1/2 w-1/2 text-[var(--brand)] transition-colors duration-500 group-hover/tool:text-pal-ink"
                        />
                      </span>
                      <span
                        className={`px-[0.3em] text-[clamp(2.4rem,7vw,7rem)] font-medium leading-[1.05] tracking-[-0.05em] transition-colors duration-500 hover:text-pal-glass ${
                          r % 2 ? "text-outline [--outline-color:rgba(255,255,255,0.55)] hover:!text-pal-glass" : ""
                        }`}
                      >
                        {name}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 px-gutter sm:mt-32">
        <dl className="grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="mono uppercase text-white/50">{stat.label}</dt>
              <dd
                data-count={stat.value}
                className="mt-3 text-[clamp(2rem,4.6vw,4.6rem)] font-medium leading-none tracking-[-0.05em]"
              >
                {pad2(stat.value)}
              </dd>
            </div>
          ))}
        </dl>

        <div data-groups className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div key={group.group} data-group>
              <h3 className="mono uppercase text-pal-glass">{group.label}</h3>
              <ul className="mt-4 flex flex-col gap-1.5 text-lg text-white/80">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06]"
                      style={{ color: colorOf[item] }}
                    >
                      <Logo name={item} className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
