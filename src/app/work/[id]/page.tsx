"use client";

import React, { use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@/components/providers/smooth-scroll-provider";
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
        ".project-header-image",
        { scale: 1.15, filter: "brightness(60%)" },
        {
          scale: 1,
          filter: "brightness(100%)",
          duration: 1.8,
          ease: "power3.out",
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
          delay: 0.5,
        }
      );

      // 2. Parallax effect on mockup image card scroll
      gsap.to(".project-header-image", {
        scrollTrigger: {
          trigger: ".project-image-wrapper",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
        yPercent: -8,
        ease: "none",
      });
    },
    { scope: pageContainerRef }
  );

  const handleNextCaseRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll cleanly back to top before sliding route
    lenis?.scrollTo(0, {
      immediate: true,
      onComplete: () => {
        router.push(`/work/${project.nextId}`);
      },
    });
  };

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
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs tracking-wider uppercase text-zinc-500 hover:text-black transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to works
        </Link>

        {/* Dynamic Project Title */}
        <div className="overflow-hidden h-16 sm:h-28 md:h-36 border-b border-zinc-300 pb-2 sm:pb-4">
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

      {/* 3. Full-Bleed Mockup Image Wrapper */}
      <div className="project-image-wrapper relative w-full h-[60vh] sm:h-[80vh] overflow-hidden bg-zinc-800 border-t border-b border-zinc-200">
        <div className="project-header-image absolute inset-0 w-full h-[120%] top-[-10%] relative">
          <Image
            src={project.src}
            alt={project.title}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Huge Magnetic Circular Live Link button floated on scroll seam */}
        <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 md:right-24 z-20">
          <Magnetic actionStrength={0.35} hoverAreaPadding="p-0">
            <a
              href={project.liveUrl}
              target="_blank"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#3c5df6] text-white flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-300 shadow-2xl font-heading tracking-widest text-[9px] font-extrabold uppercase"
            >
              <span>Live Site</span>
              <ArrowUpRight className="w-4 h-4 animate-pulse" />
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
        className="group relative bg-[#0c0c0d] text-white py-36 cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center select-none"
      >
        {/* Circular hover expansion background */}
        <div className="absolute inset-0 bg-white/2 transition-transform duration-500 scale-y-0 group-hover:scale-y-100 origin-bottom" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">
            Next Case
          </span>
          <h2 className="font-heading text-5xl sm:text-7xl font-bold uppercase tracking-tight text-zinc-300 group-hover:text-[#c9fd34] transition-colors duration-300">
            {project.nextTitle}
          </h2>
          <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-[#c9fd34] group-hover:text-black group-hover:border-transparent transition-all duration-300 mt-6">
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
}
