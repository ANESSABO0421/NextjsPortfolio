"use client";

import React, { use, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@/components/providers/smooth-scroll-provider";
import { useTransition } from "@/components/providers/transition-provider";
import Magnetic from "@/components/ui/magnetic";
import Header from "@/components/layout/header";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

// Project detail config dictionary
const projectDetails: Record<
  string,
  {
    title: string;
    category: string;
    src: string;
    role: string;
    credits: string;
    locationYear: string;
    liveUrl: string;
    nextId: string;
    nextTitle: string;
  }
> = {
  "aura-luxury": {
    title: "AURA LUXURY",
    category: "Design / E-Commerce",
    src: "/project-1.png",
    role: "Front-End Development & UX Design",
    credits: "Design: Aura Studio / Development: Anessa Bo",
    locationYear: "United Kingdom © 2026",
    liveUrl: "https://aura.studio",
    nextId: "apex-chronograph",
    nextTitle: "Apex Chronograph",
  },
  "apex-chronograph": {
    title: "APEX CHRONO",
    category: "Motion / 3D Display",
    src: "/project-2.png",
    role: "WebGL Integration & Motion Design",
    credits: "Design & Art: Apex Studio / Development: Anessa Bo",
    locationYear: "Switzerland © 2026",
    liveUrl: "https://apex.chrono",
    nextId: "structura-brutalist",
    nextTitle: "Structura Brutalist",
  },
  "structura-brutalist": {
    title: "STRUCTURA",
    category: "Brutalist Agency",
    src: "/project-3.png",
    role: "Creative Direction & Architecture Portal",
    credits: "Concept: Structura Agency / Development: Anessa Bo",
    locationYear: "United States © 2026",
    liveUrl: "https://structura.agency",
    nextId: "aura-luxury",
    nextTitle: "Aura Luxury",
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { lenis } = useLenis();
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const nextCaseRef = useRef<HTMLDivElement>(null);

  // Match URL params
  const project = projectDetails[id] || projectDetails["aura-luxury"];

  useGSAP(
    () => {
      // 1. Entrance transition: scale up main image & slide title text
      gsap.fromTo(
        ".project-header-title",
        { y: "100%" },
        {
          y: "0%",
          duration: 1.2,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        ".project-meta-col",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 1.0,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      // 2. Parallax scroll effect on the laptop mockup container
      gsap.fromTo(
        ".laptop-mockup-container",
        { y: 50 },
        {
          scrollTrigger: {
            trigger: ".laptop-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          y: -50,
          ease: "none",
        }
      );
    },
    { scope: pageContainerRef }
  );

  const { transitionTo } = useTransition();

  const handleNextCaseRedirect = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    transitionTo(`/work/${project.nextId}`, project.nextTitle);
  }, [transitionTo, project.nextId, project.nextTitle]);

  return (
    <div
      ref={pageContainerRef}
      className="relative min-h-screen bg-[#f3f3f3] text-black overflow-hidden font-sans"
    >
      {/* 1. Global Navigation header (mix-blend differences to blend dark link tags) */}
      <Header />

      {/* 2. Top Banner Details */}
      <div className="px-6 sm:px-12 md:px-24 pt-36 pb-16 max-w-7xl mx-auto w-full flex flex-col gap-12">
        
        {/* Return link */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            transitionTo("/", "Home");
          }}
          className="group inline-flex items-center gap-2 text-xs tracking-wider uppercase text-zinc-500 hover:text-black transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to works
        </a>

        {/* Dynamic Project Title */}
        <div className="overflow-hidden h-auto min-h-16 sm:min-h-28 md:min-h-36 border-b border-zinc-300 pb-2 sm:pb-4">
          <h1 className="project-header-title font-heading text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-tight leading-none text-zinc-900">
            {project.title}
          </h1>
        </div>

        {/* 3-Column Metadata Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pt-4">
          <div className="project-meta-col flex flex-col gap-2">
            <span className="text-[10px] uppercase text-zinc-400 tracking-wider">Role / Services</span>
            <p className="text-sm font-medium text-zinc-700 leading-relaxed">{project.role}</p>
          </div>
          <div className="project-meta-col flex flex-col gap-2">
            <span className="text-[10px] uppercase text-zinc-400 tracking-wider">Credits</span>
            <p className="text-sm font-medium text-zinc-700 leading-relaxed">{project.credits}</p>
          </div>
          <div className="project-meta-col flex flex-col gap-2">
            <span className="text-[10px] uppercase text-zinc-400 tracking-wider">Location & Year</span>
            <p className="text-sm font-medium text-zinc-700 leading-relaxed">{project.locationYear}</p>
          </div>
        </div>
      </div>

      {/* Editorial Content Section (About Project & Stack) */}
      <div className="px-6 sm:px-12 md:px-24 py-16 sm:py-24 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 border-t border-zinc-300">
        <div className="md:col-span-7 flex flex-col gap-6">
          <h3 className="text-xs uppercase text-zinc-400 tracking-wider font-bold">About the Project</h3>
          <p className="font-heading text-2xl sm:text-3xl font-light leading-snug tracking-tight text-zinc-800">
            Crafting a luxury experience using responsive vector components, custom physics, and motion frameworks. We designed this portal to handle fluid screen changes, immersive media playback, and high-contrast editorial structures.
          </p>
        </div>
        <div className="md:col-span-5 flex flex-col gap-6">
          <h3 className="text-xs uppercase text-zinc-400 tracking-wider font-bold">Stack & Services</h3>
          <div className="flex flex-wrap gap-2 pt-2">
            {["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "GSAP ScrollTrigger", "Lenis Scroll", "SVG Curved Morphing", "Chroma keying"].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-zinc-200 text-zinc-800 border border-zinc-300/40 hover:bg-black hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MacBook Laptop Mockup and Video-style Auto-Scroll Simulation with GSAP Parallax */}
      <div className="laptop-section px-6 sm:px-12 md:px-24 py-24 sm:py-32 bg-[#e8e8e8] border-t border-b border-zinc-300 flex items-center justify-center relative overflow-hidden">
        <style>{`
          @keyframes webMockupScroll {
            0%, 15% { transform: translateY(0); }
            50%, 65% { transform: translateY(-50%); }
            95%, 100% { transform: translateY(0); }
          }
          .animate-mockup-scroll {
            animation: webMockupScroll 18s ease-in-out infinite;
          }
        `}</style>
        
        {/* Mockup Outer Container */}
        <div className="laptop-mockup-container w-full max-w-[900px] flex flex-col items-center z-10 transition-transform duration-100 ease-out">
          {/* Laptop Screen */}
          <div className="w-full aspect-[16/10] bg-black border-[10px] sm:border-[14px] border-zinc-900 rounded-t-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden flex items-start">
            {/* Camera dot & sensor */}
            <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-zinc-800 z-30" />
            
            {/* Screen Content Wrapper */}
            <div className="w-full h-full relative overflow-hidden bg-zinc-950">
              <div className="w-full h-full relative">
                <img
                  src={project.src}
                  alt={project.title}
                  className="w-full h-auto absolute top-0 left-0 animate-mockup-scroll"
                />
              </div>
            </div>
          </div>
          
          {/* Sleek integrated laptop keyboard base */}
          <div className="w-[108%] h-[12px] sm:h-[14px] bg-gradient-to-b from-zinc-300 via-zinc-300 to-zinc-400 border-t border-zinc-100 rounded-b-xl relative z-10 shadow-2xl flex justify-center">
            {/* Hinge groove recess */}
            <div className="absolute top-0 w-full h-[3px] bg-zinc-950" />
            {/* Notch Recess for trackpad opening */}
            <div className="w-[14%] h-[5px] sm:h-[7px] bg-zinc-800 rounded-b-md relative z-20" />
          </div>
          
          {/* Rubber Foot Shadow */}
          <div className="w-[102%] h-[4px] bg-black/15 blur-[2px] rounded-full mt-[2px]" />
        </div>

        {/* Floating Circular Live Link button beside the laptop */}
        <div className="absolute bottom-12 right-6 sm:bottom-16 sm:right-12 md:right-24 z-20">
          <Magnetic actionStrength={0.35} hoverAreaPadding="p-0">
            <a
              href={project.liveUrl}
              target="_blank"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#3c5df6] text-white flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-300 shadow-2xl font-heading tracking-widest text-[9px] font-extrabold uppercase"
            >
              <span>Live Site</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Spacing gap */}
      <div className="h-24 sm:h-36" />

      {/* 4. Bottom case switcher ("Next Case" navigator) */}
      <div
        ref={nextCaseRef}
        onClick={handleNextCaseRedirect}
        className="group relative bg-[#0c0c0d] text-white pt-24 pb-16 cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center select-none"
      >
        {/* Circular hover background accent */}
        <div className="absolute inset-0 bg-white/[0.01] transition-transform duration-500 scale-y-0 group-hover:scale-y-100 origin-bottom" />

        <div className="relative z-10 flex flex-col items-center gap-4 w-full px-6">
          <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">
            Next Case
          </span>
          
          <h2 className="font-heading text-4xl sm:text-7xl font-bold uppercase tracking-tight text-zinc-200 group-hover:text-[#c9fd34] transition-colors duration-300 max-w-4xl leading-none">
            {project.nextTitle}
          </h2>

          {/* Centered Next Project Preview Card */}
          <div className="w-[280px] h-[160px] sm:w-[400px] sm:h-[240px] relative rounded-2xl overflow-hidden shadow-2xl mt-6 border border-zinc-800 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 bg-zinc-900">
            <Image
              src={projectDetails[project.nextId]?.src || "/project-1.png"}
              alt={project.nextTitle}
              fill
              sizes="(max-width: 640px) 280px, 400px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
            {/* Vignette mask overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Return pill button */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              transitionTo("/", "Home");
            }}
            className="mt-8 px-6 py-2.5 rounded-full border border-zinc-800 text-xs tracking-wider uppercase hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 text-zinc-400"
          >
            All work
          </a>
        </div>
      </div>
    </div>
  );
}
