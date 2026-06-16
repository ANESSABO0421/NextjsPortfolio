"use client";

import { motion } from "framer-motion";

interface StatItem {
  value: string;
  label: string;
  description: string;
}

const STATS: StatItem[] = [
  {
    value: "20+",
    label: "Years Experience",
    description: "Refining visual design and interactive system architecture.",
  },
  {
    value: "95+",
    label: "Projects Done",
    description: "Successfully shipped web platforms, branding, and motion graphics.",
  },
  {
    value: "200%",
    label: "Satisfied Clients",
    description: "Dedicated to bringing value and elevated brand identity.",
  },
];

export default function Stats() {
  return (
    <section className="bg-transparent py-20 md:py-28 border-y border-stroke/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col text-left group"
            >
              {/* Value with gradient on hover */}
              <span className="text-6xl md:text-7xl lg:text-8xl font-display font-light text-text-primary tracking-tighter mb-4 transition-colors duration-300 group-hover:text-[#89AACC]">
                {stat.value}
              </span>
              
              {/* Divider */}
              <div className="w-12 h-[2px] bg-stroke/60 mb-4 group-hover:w-full transition-all duration-500 ease-out" />
              
              {/* Label */}
              <span className="text-sm uppercase tracking-[0.2em] font-semibold text-text-primary mb-2">
                {stat.label}
              </span>
              
              {/* Description */}
              <span className="text-xs md:text-sm text-muted leading-relaxed">
                {stat.description}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
