"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/components/ui/magnetic";
import { MoveRight } from "lucide-react";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const paragraphText =
    "Junior MERN Stack Developer with 1 year of production experience building scalable web and mobile applications. Delivered end-to-end ERP modules, reusable React components, RESTful APIs, and third-party API integrations across two professional roles. Proficient in JavaScript (ES6+), clean architecture, JWT authentication, RBAC, MongoDB query optimization, and responsive UI development.";

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
          <div className="flex flex-col gap-4 border-t border-zinc-800/60 pt-8 mt-4">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              Tech Stack & Expertise
            </span>
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                "MongoDB",
                "Express.js",
                "React.js",
                "Node.js",
                "Next.js",
                "React Native",
                "Tailwind CSS",
                "TypeScript",
                "Socket.io",
              ].map((stack, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2.5 rounded-full bg-[#1c1c1f] border border-zinc-800 text-xs font-semibold text-zinc-400 hover:border-zinc-300 hover:text-white transition-all duration-300 cursor-default"
                >
                  {stack}
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
              <h3 className="font-heading text-5xl font-extrabold text-white">2</h3>
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Professional Roles
              </span>
            </div>
            <div className="about-stat-card flex flex-col gap-2">
              <h3 className="font-heading text-5xl font-extrabold text-zinc-400">4</h3>
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Full Stack Projects
              </span>
            </div>
          </div>

          <div className="about-stat-card">
            <Magnetic actionStrength={0.25} hoverAreaPadding="p-0">
              <a
                href="#works"
                className="group inline-flex items-center gap-3 text-sm font-semibold tracking-wider uppercase border border-zinc-700 rounded-full px-8 py-4 hover:bg-[#c9fd34] hover:text-black hover:border-transparent transition-all duration-300"
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
