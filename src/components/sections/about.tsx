"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/components/ui/magnetic";
import { MoveRight, Download } from "lucide-react";
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

const techStack = [
  { name: "MongoDB", Icon: SiMongodb, color: "#00ED64" },
  { name: "Express.js", Icon: SiExpress, color: "#ffffff" },
  { name: "React.js", Icon: SiReact, color: "#61DAFB" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
  { name: "React Native", Icon: TbBrandReactNative, color: "#61DAFB" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38BDF8" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Socket.io", Icon: SiSocketdotio, color: "#c9fd34" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  { name: "Redux Toolkit", Icon: SiRedux, color: "#764ABC" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const paragraphText =
    "Full Stack (MERN) Developer building production ERP, HRMS, and real-time platforms. Currently developing a multi-tenant HRMS serving 6 role-based dashboards, where I own the Leave Management module and lead frontend and backend architecture refactoring. Skilled in REST API design, JWT authentication, RBAC, Socket.io, and MongoDB query optimization.";

  useGSAP(
    () => {
      const textElement = textRef.current;
      if (!textElement) return;
      const shouldReduceTextAnimation =
        window.matchMedia("(max-width: 767px)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (shouldReduceTextAnimation) {
        textElement.textContent = paragraphText;
        gsap.fromTo(
          textElement,
          { opacity: 0.35, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: textElement,
              start: "top 85%",
            },
          }
        );
      } else {

        // 1. Split text into individual word tags manually
        const words = paragraphText.split(" ");
        textElement.innerHTML = words
          .map((word) => `<span class="inline-block opacity-[0.15] mr-[0.25em] transition-opacity duration-300">${word}</span>`)
          .join("");

        const spans = textElement.querySelectorAll("span");

        // 2. Animate opacity on scroll
        gsap.to(spans, {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: textElement,
            start: "top 80%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        });
      }

      // 3. Stagger reveal info blocks
      gsap.fromTo(
        ".about-stat-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-stats-container",
            start: "top 85%",
          },
        }
      );

      // 4. Stagger reveal tech stack chips
      gsap.fromTo(
        ".tech-chip",
        { opacity: 0, y: 16, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".tech-chip-container",
            start: "top 88%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#111112] py-20 sm:py-28 lg:py-32 flex flex-col justify-center text-white overflow-hidden"
    >
      <div className="px-6 sm:px-10 md:px-16 lg:px-24 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-14 md:gap-16 lg:gap-24 z-10">
        
        {/* Left Column: Interactive Paragraph & Tech Stack */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          <div className="flex flex-col gap-12">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9fd34]" />
              What I Do
            </span>
            <p
              ref={textRef}
              className="font-sans text-2xl sm:text-3xl lg:text-4xl font-light leading-relaxed text-zinc-200 tracking-tight"
            >
              {paragraphText}
            </p>
          </div>

          {/* Interactive Tech Stack */}
          <div className="flex flex-col gap-5 border-t border-zinc-800/60 pt-8 mt-4">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9fd34]" />
              Tech Stack &amp; Expertise
            </span>
            <div className="tech-chip-container grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
              {techStack.map(({ name, Icon, color }, idx) => (
                <div
                  key={idx}
                  style={{ "--accent": color } as React.CSSProperties}
                  className="tech-chip group relative flex flex-col items-center justify-center gap-3 rounded-2xl px-3 py-5 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] cursor-default overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--accent)]/50 hover:shadow-[0_8px_30px_-8px_var(--accent)]"
                >
                  {/* Animated top-edge accent line */}
                  <span
                    className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-4/5 transition-all duration-500 ease-out"
                    style={{ background: `linear-gradient(90deg, transparent, var(--accent), transparent)` }}
                  />
                  {/* Ambient wash, always faintly present */}
                  <span
                    className="pointer-events-none absolute inset-0 opacity-[0.06] group-hover:opacity-25 transition-opacity duration-500"
                    style={{ background: "radial-gradient(circle at 50% 0%, var(--accent), transparent 65%)" }}
                  />
                  {/* Icon badge */}
                  <span
                    className="relative flex items-center justify-center w-11 h-11 rounded-xl border border-white/[0.06] transition-all duration-500 group-hover:scale-110 group-hover:border-[color:var(--accent)]/40"
                    style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                  >
                    <Icon
                      className="w-5 h-5 shrink-0 text-zinc-400 transition-all duration-500 group-hover:text-[color:var(--accent)] group-hover:drop-shadow-[0_0_8px_var(--accent)]"
                    />
                  </span>
                  <span className="relative text-[11px] font-semibold uppercase tracking-wide text-zinc-500 group-hover:text-white transition-colors duration-500 text-center leading-tight">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Statistics & Action Links */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-12 lg:border-l lg:border-zinc-800 lg:pl-16">
          <div className="about-stats-container flex flex-col gap-10">
            <div className="about-stat-card flex flex-col gap-2">
              <h3 className="font-heading text-5xl font-extrabold text-[#c9fd34]">1+</h3>
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Years Experience
              </span>
            </div>
            <div className="about-stat-card flex flex-col gap-2">
              <h3 className="font-heading text-5xl font-extrabold text-white">3</h3>
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Professional Roles
              </span>
            </div>
            <div className="about-stat-card flex flex-col gap-2">
              <h3 className="font-heading text-5xl font-extrabold text-zinc-400">5</h3>
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Shipped Projects
              </span>
            </div>
          </div>

          <div className="about-stat-card flex flex-col items-start gap-4">
            <Magnetic actionStrength={0.25} hoverAreaPadding="p-0">
              <a
                href="/Anees_Resume.pdf"
                download="Anees-Aboobacker-Resume.pdf"
                className="group inline-flex items-center gap-3 text-sm font-semibold tracking-wider uppercase bg-[#c9fd34] text-black rounded-full px-8 py-4 hover:bg-white transition-all duration-300"
              >
                Download Resume
                <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>

            <Magnetic actionStrength={0.25} hoverAreaPadding="p-0">
              <a
                href="#works"
                className="group inline-flex items-center gap-3 text-sm font-semibold tracking-wider uppercase border border-zinc-700 rounded-full px-8 py-4 hover:bg-white hover:text-black hover:border-transparent transition-all duration-300"
              >
                Selected Works
                <MoveRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
              </a>
            </Magnetic>
          </div>

        </div>
      </div>
    </section>
  );
}
