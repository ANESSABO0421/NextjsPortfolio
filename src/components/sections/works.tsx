"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/components/ui/magnetic";
import { useTransition } from "@/components/providers/transition-provider";
import { MoveUpRight } from "lucide-react";

const projects = [
  {
    id: "aura-luxury",
    title: "Aura Luxury",
    category: "Design / E-Commerce",
    src: "/project-1.png",
  },
  {
    id: "apex-chronograph",
    title: "Apex Chronograph",
    category: "Motion / 3D Display",
    src: "/project-2.png",
  },
  {
    id: "structura-brutalist",
    title: "Structura Brutalist",
    category: "Brutalist Agency",
    src: "/project-3.png",
  },
];

export default function Works() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { transitionTo } = useTransition();

  const handleProjectTransition = useCallback((e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    transitionTo(`/work/${id}`, title);
  }, [transitionTo]);

  // 1. Core cursor tracking for the floating preview card
  useGSAP(
    () => {
      const container = containerRef.current;
      const hoverContainer = hoverContainerRef.current;
      if (!container || !hoverContainer) return;

      // Interpolated translation for high performance
      const xTo = gsap.quickTo(hoverContainer, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(hoverContainer, "y", { duration: 0.45, ease: "power3.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        // Offset coords so cursor centers on the 320x240 image card
        const x = e.clientX - rect.left - 160;
        const y = e.clientY - rect.top - 120;
        xTo(x);
        yTo(y);
      };

      container.addEventListener("mousemove", handleMouseMove);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: containerRef }
  );

  // 2. Animate floating preview appearance
  useGSAP(
    () => {
      const hoverContainer = hoverContainerRef.current;
      if (!hoverContainer) return;

      if (activeIndex !== null) {
        gsap.to(hoverContainer, {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
        });
        
        // Vertically slide the active image into frame
        gsap.to(".works-image-stack", {
          yPercent: -activeIndex * 100,
          duration: 0.45,
          ease: "power3.out",
        });
      } else {
        gsap.to(hoverContainer, {
          scale: 0.6,
          opacity: 0,
          duration: 0.35,
          ease: "power2.inOut",
        });
      }
    },
    { dependencies: [activeIndex] }
  );

  return (
    <section
      id="works"
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#0f0f10] py-24 sm:py-32 text-white overflow-hidden"
    >
      <div className="px-6 sm:px-12 md:px-24 max-w-7xl mx-auto w-full flex flex-col gap-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9fd34]" />
            Selected Works
          </span>
          <h2 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight">
            Crafting Premium Code.
          </h2>
        </div>

        {/* Project List */}
        <div className="flex flex-col border-t border-zinc-800">
          {projects.map((project, index) => (
            <a
              key={index}
              href={`/work/${project.id}`}
              onClick={(e) => handleProjectTransition(e, project.id, project.title)}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              data-cursor="view"
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between py-10 border-b border-zinc-800 transition-all duration-350 cursor-pointer animate-[opacity_0.5s_ease-out_forwards]"
            >
              {/* Backlit highlight bar that expands on hover */}
              <div className="absolute inset-0 w-0 bg-white/2 transition-all duration-500 ease-out group-hover:w-full" />

              <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12 z-10 pl-4 transition-transform duration-350 group-hover:translate-x-4">
                <span className="text-zinc-600 font-heading text-lg font-medium tracking-tight">
                  0{index + 1}
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-light tracking-tight transition-colors duration-300 group-hover:text-[#c9fd34]">
                  {project.title}
                </h3>
              </div>

              <div className="relative flex items-center justify-between sm:justify-end gap-12 z-10 pr-4 mt-4 sm:mt-0 pl-4 sm:pl-0 transition-transform duration-350 group-hover:-translate-x-4">
                <span className="text-zinc-400 font-light text-sm">
                  {project.category}
                </span>
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 transition-all duration-300 group-hover:bg-[#c9fd34] group-hover:text-black group-hover:border-transparent">
                  <MoveUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Floating Project Image Hover Follow Card (Hardware accelerated, scaled out initially) */}
      <div
        ref={hoverContainerRef}
        className="absolute top-0 left-0 w-[320px] h-[240px] z-20 pointer-events-none rounded-2xl overflow-hidden shadow-2xl opacity-0 scale-50 border border-white/10 select-none hidden sm:block bg-[#1f1f21]"
      >
        <div className="works-image-stack w-full h-full flex flex-col">
          {projects.map((project, index) => (
            <div key={index} className="w-full h-full relative flex-shrink-0">
              <Image
                src={project.src}
                alt={project.title}
                fill
                sizes="320px"
                className="object-cover object-center filter grayscale-[30%] brightness-[90%]"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
