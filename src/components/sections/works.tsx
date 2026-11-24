"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, hasFinePointer } from "@/lib/gsap";
import { allProjects } from "@/lib/projects";
import { pad2 } from "@/lib/site";
import TransitionLink from "@/components/ui/transition-link";
import TextReveal from "@/components/ui/text-reveal";

const PREVIEW_W = 380;
const PREVIEW_H = 260;

/**
 * Selected work as one oversized index. Each row is a doorway: hovering lifts
 * it out of the list (everything else dims) and a floating still follows the
 * cursor with a little weight — it leans into the direction of travel.
 */
export default function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const fine = useRef(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      fine.current = hasFinePointer();
      if (prefersReducedMotion()) return;

      /* Rows build themselves as they arrive */
      gsap.utils.toArray<HTMLElement>("[data-row]", section).forEach((row) => {
        const title = row.querySelector("[data-title]");
        const meta = row.querySelectorAll("[data-meta]");
        const line = row.querySelector("[data-line]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 92%", once: true } });
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "expo.inOut" }, 0)
          .fromTo(title, { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: "expo.out" }, 0.1)
          .fromTo(meta, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06, ease: "expo.out" }, 0.3);
      });

      /* Floating preview — follows the cursor, leans with its velocity */
      const preview = previewRef.current;
      if (!preview || !fine.current) return;
      gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0, rotate: 0 });
      const x = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3.out" });
      const y = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3.out" });
      const rotate = gsap.quickTo(preview, "rotate", { duration: 0.6, ease: "power3.out" });
      let lastX = 0;
      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        x(event.clientX + 60);
        y(event.clientY);
        rotate(gsap.utils.clamp(-9, 9, (event.clientX - lastX) * 0.35));
        lastX = event.clientX;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // Scrolling (not the pointer) can carry the list away — hide with it.
      const hideNow = () =>
        gsap.to(preview, { opacity: 0, scale: 0.6, duration: 0.4, ease: "expo.in", overwrite: "auto" });
      ScrollTrigger.create({
        trigger: "[data-list]",
        start: "top bottom",
        end: "bottom 40%",
        onLeave: hideNow,
        onLeaveBack: hideNow,
      });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: sectionRef }
  );

  const show = (index: number) => {
    if (!fine.current) return;
    const stack = stackRef.current;
    const preview = previewRef.current;
    if (!stack || !preview) return;
    Array.from(stack.children).forEach((child, i) => {
      gsap.to(child, {
        opacity: i === index ? 1 : 0,
        scale: i === index ? 1 : 1.12,
        duration: 0.6,
        ease: "expo.out",
        overwrite: "auto",
      });
    });
    gsap.to(preview, { opacity: 1, scale: 1, duration: 0.7, ease: "expo.out", overwrite: "auto" });
  };

  const hide = () => {
    if (!fine.current || !previewRef.current) return;
    gsap.to(previewRef.current, { opacity: 0, scale: 0.6, duration: 0.5, ease: "expo.in", overwrite: "auto" });
  };

  return (
    <section id="works" ref={sectionRef} aria-labelledby="works-title" className="relative bg-pal-ink py-28 text-white sm:py-40">
      <div className="px-gutter">
        <div className="flex items-center justify-between mono uppercase text-white/50">
          <span>Selected work</span>
          <span>({pad2(allProjects.length)})</span>
        </div>
        <TextReveal
          as="h2"
          text="Things I've shipped."
          split="words"
          className="mt-10 max-w-[12ch] text-[clamp(2.4rem,5.6vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.05em]"
        />
        <span id="works-title" className="sr-only">
          Selected work
        </span>
      </div>

      <ul data-list className="group/list mt-20 px-gutter sm:mt-28" onPointerLeave={hide}>
        {allProjects.map((project, i) => (
          <li key={project.id} data-row className="relative">
            <span data-line aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-white/20" />
            <TransitionLink
              href={`/work/${project.id}`}
              label={project.listTitle}
              onPointerEnter={() => show(i)}
              onFocus={() => show(i)}
              onBlur={hide}
              aria-label={`Open case study: ${project.listTitle}`}
              className="group/row grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-7 opacity-100 outline-none transition-opacity duration-500 group-hover/list:opacity-30 hover:opacity-100 focus-visible:opacity-100 sm:py-8 md:grid-cols-[4.5rem_1fr_17rem_5rem_3rem]"
            >
              <span data-meta className="mono text-white/45">
                {pad2(i + 1)}
              </span>

              <span className="min-w-0">
                <span className="block overflow-hidden pb-[0.08em]">
                  <span
                    data-title
                    className="block text-[clamp(1.7rem,4.2vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.045em] transition-transform duration-700 ease-expo group-hover/row:translate-x-[1.6vw]"
                  >
                    {project.listTitle}
                  </span>
                </span>
                <span data-meta className="mt-1 block text-sm text-white/55 md:hidden">
                  {project.category}
                </span>
              </span>

              <span data-meta className="hidden text-[0.95rem] leading-snug text-white/60 md:block">
                {project.category}
              </span>
              <span data-meta className="hidden mono text-white/45 md:block">
                {project.year}
              </span>

              <span
                data-meta
                className="flex h-10 w-10 items-center justify-center justify-self-end rounded-full border border-white/25 transition-all duration-500 ease-expo group-hover/row:border-transparent group-hover/row:bg-white group-hover/row:text-pal-ink md:h-12 md:w-12"
                style={{ ["--accent" as string]: project.accent }}
              >
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover/row:rotate-45" />
              </span>
            </TransitionLink>

            {/* Phones have no hover — show the still inline instead */}
            {project.poster && (
              <div className="relative -mt-2 mb-8 aspect-[16/10] overflow-hidden rounded-2xl md:hidden">
                <Image src={project.poster} alt="" fill sizes="90vw" className="object-cover" />
              </div>
            )}
          </li>
        ))}
        <li aria-hidden className="h-px bg-white/20" />
      </ul>

      {/* The cursor-following still */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden overflow-hidden rounded-[1.25rem] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] md:block"
        style={{ width: PREVIEW_W, height: PREVIEW_H, opacity: 0 }}
      >
        <div ref={stackRef} className="absolute inset-0">
          {allProjects.map((project) => (
            <div key={project.id} className="absolute inset-0 opacity-0">
              {project.poster ? (
                <Image src={project.poster} alt="" fill sizes={`${PREVIEW_W}px`} className="object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-end p-6"
                  style={{ background: `linear-gradient(135deg, ${project.accent}, #151a1c 85%)` }}
                >
                  <span className="text-3xl font-medium tracking-[-0.04em] text-white">{project.listTitle}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
