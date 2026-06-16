"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  colSpan: string;
  aspect: string;
}

const PROJECTS: Project[] = [
  {
    id: "automotive-motion",
    title: "Automotive Motion",
    category: "CGI & Motion Design",
    image: "/images/automotive_motion.png",
    colSpan: "md:col-span-7",
    aspect: "aspect-[16/11]",
  },
  {
    id: "urban-architecture",
    title: "Urban Architecture",
    category: "Photography & Form",
    image: "/images/urban_architecture.png",
    colSpan: "md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    id: "human-perspective",
    title: "Human Perspective",
    category: "Digital Arts & Technology",
    image: "/images/human_perspective.png",
    colSpan: "md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    id: "brand-identity",
    title: "Brand Identity",
    category: "Design System & Print",
    image: "/images/brand_identity.png",
    colSpan: "md:col-span-7",
    aspect: "aspect-[16/11]",
  },
];

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-transparent py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16"
        >
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
                Selected Work
              </span>
            </div>
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-text-primary mb-4 tracking-tight">
              Featured <span className="font-display italic font-semibold">projects</span>
            </h2>
            {/* Subtext */}
            <p className="text-sm md:text-base text-muted max-w-md">
              A selection of projects I've worked on, from concept to launch.
            </p>
          </div>

          {/* View All Works Button */}
          <button className="hidden md:inline-flex group relative items-center gap-2 text-xs rounded-full px-5 py-3 border border-stroke bg-surface hover:text-text-primary text-muted transition-all duration-300 cursor-pointer overflow-hidden">
            {/* Hover border glow backdrop */}
            <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" style={{ padding: "1px" }} />
            <span className="absolute inset-[1px] bg-surface rounded-full -z-10 group-hover:bg-bg transition-colors duration-300" />
            View all work
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className={`${project.colSpan} group relative bg-surface border border-stroke rounded-[2rem] overflow-hidden cursor-pointer`}
            >
              {/* Aspect Ratio Container */}
              <div className={`relative w-full ${project.aspect} overflow-hidden`}>
                
                {/* Background Image */}
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-w-768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={index === 0}
                />

                {/* Halftone overlay */}
                <div className="absolute inset-0 halftone-overlay opacity-15 mix-blend-multiply pointer-events-none" />

                {/* Info Overlay (visible on Mobile as gradient footer, and transforms to hover overlay on desktop) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex items-end md:items-center md:justify-center p-6 md:p-8 md:backdrop-blur-md">
                  
                  {/* Desktop Hover Label */}
                  <div className="hidden md:flex relative items-center justify-center p-[1px] rounded-full overflow-hidden shadow-lg shadow-black/20 transform scale-95 group-hover:scale-100 transition-transform duration-300 animate-gradient-shift">
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 accent-gradient" />
                    
                    <div className="relative px-5 py-2.5 bg-white text-black rounded-full font-medium text-xs flex items-center gap-2">
                      View — <span className="font-display italic font-bold">{project.title}</span>
                    </div>
                  </div>

                  {/* Mobile Label */}
                  <div className="md:hidden w-full flex flex-col text-left">
                    <span className="text-[10px] text-muted uppercase tracking-wider">{project.category}</span>
                    <span className="text-lg font-semibold text-text-primary mt-1">{project.title}</span>
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
