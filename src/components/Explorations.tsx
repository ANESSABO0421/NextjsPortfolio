"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExplorationItem {
  id: string;
  title: string;
  image: string;
  rotation: string;
}

const ITEMS: ExplorationItem[] = [
  {
    id: "exp-1",
    title: "Velocity",
    image: "/images/automotive_motion.png",
    rotation: "hover:rotate-[-4deg]",
  },
  {
    id: "exp-2",
    title: "Monolith",
    image: "/images/urban_architecture.png",
    rotation: "hover:rotate-[3deg]",
  },
  {
    id: "exp-3",
    title: "Connection",
    image: "/images/human_perspective.png",
    rotation: "hover:rotate-[-3deg]",
  },
  {
    id: "exp-4",
    title: "Structure",
    image: "/images/brand_identity.png",
    rotation: "hover:rotate-[4deg]",
  },
  {
    id: "exp-5",
    title: "Geometry",
    image: "/images/journal_minimalism.png",
    rotation: "hover:rotate-[-2deg]",
  },
  {
    id: "exp-6",
    title: "Fluidity",
    image: "/images/journal_motion.png",
    rotation: "hover:rotate-[2deg]",
  },
];

export default function Explorations() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const pinEl = pinRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;

    if (!container || !pinEl) return;

    // Pin Layer 1 Center section
    const pinTrigger = ScrollTrigger.create({
      trigger: container,
      pin: pinEl,
      start: "top top",
      end: "bottom bottom",
      pinSpacing: false,
    });

    // Parallax columns
    let leftCtx: gsap.Context | null = null;
    let rightCtx: gsap.Context | null = null;

    if (leftCol) {
      leftCtx = gsap.context(() => {
        gsap.fromTo(
          leftCol,
          { y: "15vh" },
          {
            y: "-45vh",
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      });
    }

    if (rightCol) {
      rightCtx = gsap.context(() => {
        gsap.fromTo(
          rightCol,
          { y: "45vh" },
          {
            y: "-15vh",
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      });
    }

    return () => {
      pinTrigger.kill();
      if (leftCtx) leftCtx.revert();
      if (rightCtx) rightCtx.revert();
    };
  }, []);

  // Split items into 2 columns
  const leftItems = ITEMS.filter((_, idx) => idx % 2 === 0);
  const rightItems = ITEMS.filter((_, idx) => idx % 2 !== 0);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[220vh] md:min-h-[280vh] bg-transparent overflow-hidden py-20"
    >
      {/* Layer 1: Pinned Center Panel */}
      <div
        ref={pinRef}
        className="absolute inset-0 h-screen w-full flex flex-col justify-center items-center text-center z-10 pointer-events-none"
      >
        <div className="max-w-md px-6 py-8 rounded-3xl bg-bg/40 backdrop-blur-md border border-white/5 shadow-2xl pointer-events-auto flex flex-col items-center">
          {/* Eyebrow */}
          <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium mb-3">
            Explorations
          </span>
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-light text-text-primary mb-4 tracking-tight leading-none">
            Visual <span className="font-display italic font-semibold">playground</span>
          </h2>
          {/* Subtext */}
          <p className="text-xs md:text-sm text-muted mb-6 max-w-xs leading-relaxed">
            A sandbox of visual concepts, motion graphics, and photography.
          </p>
          {/* Dribbble Button */}
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 text-xs rounded-full px-5 py-2.5 border border-stroke bg-surface hover:text-text-primary text-muted transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" style={{ padding: "1px" }} />
            <span className="absolute inset-[1px] bg-surface rounded-full -z-10 group-hover:bg-bg transition-colors duration-300" />
            See more on Dribbble
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">↗</span>
          </a>
        </div>
      </div>

      {/* Layer 2: Parallax Columns */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-6 grid grid-cols-2 gap-8 md:gap-24 pt-[10vh] pb-[10vh] pointer-events-none">
        
        {/* Left Column */}
        <div
          ref={leftColRef}
          className="flex flex-col gap-16 md:gap-32 pointer-events-auto"
        >
          {leftItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item.image)}
              className={`relative aspect-square w-full max-w-[320px] mx-auto rounded-[2rem] overflow-hidden border border-stroke shadow-xl hover:scale-[1.03] transition-all duration-500 cursor-pointer ${item.rotation}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-w-768px) 150px, 320px"
                className="object-cover"
              />
              <div className="absolute inset-0 halftone-overlay opacity-10 pointer-events-none" />
              {/* Card Title Layer */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-xs font-semibold tracking-widest uppercase bg-bg/80 border border-stroke px-4 py-2 rounded-full">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div
          ref={rightColRef}
          className="flex flex-col gap-16 md:gap-32 pointer-events-auto"
        >
          {rightItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item.image)}
              className={`relative aspect-square w-full max-w-[320px] mx-auto rounded-[2rem] overflow-hidden border border-stroke shadow-xl hover:scale-[1.03] transition-all duration-500 cursor-pointer ${item.rotation}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-w-768px) 150px, 320px"
                className="object-cover"
              />
              <div className="absolute inset-0 halftone-overlay opacity-10 pointer-events-none" />
              {/* Card Title Layer */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-xs font-semibold tracking-widest uppercase bg-bg/80 border border-stroke px-4 py-2 rounded-full">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white text-xs tracking-[0.2em] uppercase bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm"
            >
              CLOSE ✕
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-4xl max-h-[85vh] aspect-square w-full rounded-2xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImage}
                alt="Exploration Full View"
                fill
                className="object-contain"
                priority
              />
              <div className="absolute inset-0 halftone-overlay opacity-5 pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
