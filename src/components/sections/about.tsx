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
    "I partner with forward-thinking designers, startups, and agencies to engineer digital experiences that are not only visual masterpieces but also highly functional. By blending smooth motion design, rich graphics, and bleeding-edge front-end optimization, I build websites that set new standards in performance, accessibility, and interactive storytelling.";

  useGSAP(
    () => {
      const textElement = textRef.current;
      if (!textElement) return;

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
      className="relative min-h-screen w-full bg-[#111112] py-24 sm:py-32 flex flex-col justify-center text-white overflow-hidden"
    >
      <div className="px-6 sm:px-12 md:px-24 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 z-10">
        
        {/* Left Column: Interactive Paragraph */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9fd34]" />
            What I Do
          </span>
          <p
            ref={textRef}
            className="font-sans text-2xl sm:text-4xl font-light leading-relaxed text-zinc-200 tracking-tight"
          >
            {paragraphText}
          </p>
        </div>

        {/* Right Column: Statistics & Action Links */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-12 lg:border-l lg:border-zinc-800 lg:pl-16">
          <div className="about-stats-container flex flex-col gap-10">
            <div className="about-stat-card flex flex-col gap-2">
              <h3 className="font-heading text-5xl font-extrabold text-[#c9fd34]">15+</h3>
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Design & Tech Awards
              </span>
            </div>
            <div className="about-stat-card flex flex-col gap-2">
              <h3 className="font-heading text-5xl font-extrabold text-white">100%</h3>
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Core Web Vitals Standard
              </span>
            </div>
            <div className="about-stat-card flex flex-col gap-2">
              <h3 className="font-heading text-5xl font-extrabold text-zinc-400">8+ Yrs</h3>
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Interactive Engineering Experience
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
