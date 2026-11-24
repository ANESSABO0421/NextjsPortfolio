"use client";

import { useState } from "react";
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
import { elements, elementUsage, type ElementGroup } from "@/lib/skills";
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

const categories: { value: ElementGroup | "all"; label: string }[] = [
  { value: "all", label: "All tools" },
  { value: "interface", label: "Frontend" },
  { value: "server", label: "Backend" },
  { value: "data", label: "Databases" },
  { value: "tooling", label: "Development tools" },
];

export default function Skills() {
  const [category, setCategory] = useState<ElementGroup | "all">("all");
  const [selected, setSelected] = useState(elements[0].symbol);
  const visible = elements.filter((element) => category === "all" || element.group === category);
  const focused = visible.find((element) => element.symbol === selected) ?? visible[0];
  const Icon = ICONS[focused.symbol];
  const usage = elementUsage[focused.symbol];

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative bg-surface py-28 sm:py-36">
      <div className="px-gutter">
        <p className="mono uppercase text-fg-3">Tech stack</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <TextReveal as="h2" text="Tools I work with." split="words" className="font-heading text-h1 text-fg [font-variation-settings:'wght'_620] lg:col-span-8" />
          <p className="max-w-[26rem] text-lead font-light text-fg-2 lg:col-span-4">
            The tools I use for web apps, APIs and mobile projects.
          </p>
        </div>
        <span id="skills-title" className="sr-only">Tech stack</span>

        <div role="group" aria-label="Filter tools" className="mt-12 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button key={item.value} type="button" aria-pressed={category === item.value} onClick={() => setCategory(item.value)}
              className={cn("rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime", category === item.value ? "border-lime bg-lime text-void" : "border-line-2 text-fg-2 hover:border-fg-3 hover:text-fg")}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div role="group" aria-label="Technologies" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-7">
            {visible.map((element) => {
              const ToolIcon = ICONS[element.symbol];
              return (
                <button key={element.symbol} type="button" aria-pressed={focused.symbol === element.symbol} aria-controls="skill-details" onClick={() => setSelected(element.symbol)}
                  className={cn("flex min-h-32 flex-col items-start justify-between gap-6 rounded-xl border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime", focused.symbol === element.symbol ? "border-lime/60 bg-raised text-fg" : "border-line-2 text-fg-2 hover:border-fg-3 hover:bg-raised")}>
                  <ToolIcon aria-hidden className="h-7 w-7" style={{ color: element.color }} />
                  <span className="text-base sm:text-lg">{element.name}</span>
                </button>
              );
            })}
          </div>

          <div id="skill-details" className="rounded-xl border border-line-2 bg-night p-6 sm:p-8 lg:col-span-5">
            <div className="flex items-center gap-4">
              <Icon aria-hidden className="h-8 w-8 shrink-0" style={{ color: focused.color }} />
              <h3 className="font-heading text-3xl text-fg">{focused.name}</h3>
            </div>
            <p className="mt-5 text-base leading-relaxed text-fg-2">{focused.note}</p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-fg-3">
              {focused.usedFor.map((use) => <li key={use}>{use}</li>)}
            </ul>
            {usage.projects.length > 0 && (
              <div className="mt-8 border-t border-line-2 pt-6">
                <p className="mono uppercase text-fg-3">Projects using {focused.name}</p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                  {usage.projects.map((project) => (
                    <li key={project.id}>
                      <TransitionLink href={`/work/${project.id}`} label={project.title} className="text-sm text-fg underline decoration-line-3 underline-offset-4 hover:text-lime">{project.title}</TransitionLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
