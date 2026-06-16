"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface JournalEntry {
  id: string;
  title: string;
  image: string;
  readTime: string;
  date: string;
  category: string;
}

const ENTRIES: JournalEntry[] = [
  {
    id: "minimalism-digital-architecture",
    title: "Minimalism in digital architectures",
    image: "/images/journal_minimalism.png",
    readTime: "4 min read",
    date: "June 12, 2026",
    category: "Architecture",
  },
  {
    id: "craft-motion-design",
    title: "The delicate craft of motion design",
    image: "/images/journal_motion.png",
    readTime: "6 min read",
    date: "June 08, 2026",
    category: "Motion",
  },
  {
    id: "human-interfaces",
    title: "Human interfaces & digital systems",
    image: "/images/human_perspective.png",
    readTime: "5 min read",
    date: "May 29, 2026",
    category: "Interfaces",
  },
  {
    id: "evolution-clean-aesthetics",
    title: "The slow evolution of clean aesthetics",
    image: "/images/brand_identity.png",
    readTime: "8 min read",
    date: "May 15, 2026",
    category: "Design",
  },
];

export default function Journal() {
  return (
    <section id="journal" className="bg-transparent py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
                Journal
              </span>
            </div>
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-text-primary mb-4 tracking-tight">
              Recent <span className="font-display italic font-semibold">thoughts</span>
            </h2>
            {/* Subtext */}
            <p className="text-sm md:text-base text-muted max-w-md">
              A collection of writings and thoughts on design, coding, and technology.
            </p>
          </div>

          {/* View All Writings Button */}
          <button className="hidden md:inline-flex group relative items-center gap-2 text-xs rounded-full px-5 py-3 border border-stroke bg-surface hover:text-text-primary text-muted transition-all duration-300 cursor-pointer overflow-hidden">
            <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" style={{ padding: "1px" }} />
            <span className="absolute inset-[1px] bg-surface rounded-full -z-10 group-hover:bg-bg transition-colors duration-300" />
            View all writings
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </motion.div>

        {/* Journal Entries List */}
        <div className="flex flex-col gap-4 md:gap-5">
          {ENTRIES.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 bg-surface/30 hover:bg-surface border border-stroke rounded-[2.5rem] sm:rounded-full transition-all duration-350 cursor-pointer"
            >
              {/* Left Side: Thumbnail & Title */}
              <div className="flex items-center gap-4 md:gap-6">
                {/* Thumbnail */}
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden relative flex-shrink-0 border border-stroke">
                  <Image
                    src={entry.image}
                    alt={entry.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 halftone-overlay opacity-10 pointer-events-none" />
                </div>

                {/* Title & Category */}
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-[#89AACC] uppercase tracking-widest font-semibold mb-1">
                    {entry.category}
                  </span>
                  <h3 className="text-base md:text-lg text-text-primary group-hover:text-white transition-colors duration-200 font-medium line-clamp-1">
                    {entry.title}
                  </h3>
                </div>
              </div>

              {/* Right Side: Date & Read Time */}
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-stroke/40 sm:border-0 pt-3 sm:pt-0 pl-16 sm:pl-0">
                <span className="text-xs text-muted font-light">{entry.date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted font-medium bg-stroke/40 px-3 py-1.5 rounded-full">
                    {entry.readTime}
                  </span>
                  {/* Arrow Indicator */}
                  <div className="hidden sm:flex w-8 h-8 rounded-full bg-stroke/20 items-center justify-center text-muted group-hover:text-text-primary group-hover:bg-stroke/60 transition-all duration-300">
                    <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 text-xs">
                      ↗
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
