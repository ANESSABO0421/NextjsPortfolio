"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="relative bg-transparent py-24 md:py-32 overflow-hidden border-t border-stroke/40"
    >
      {/* Cosmic Nebula Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#4e85bf]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#89aacc]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Biography & Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
                The Narrative
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-text-primary mb-8 tracking-tight leading-[1.1]">
              Navigating the <span className="font-display italic font-semibold">cosmos</span> of design and technology.
            </h2>

            {/* Paragraphs */}
            <div className="flex flex-col gap-6 text-sm md:text-base text-muted leading-relaxed max-w-2xl">
              <p>
                To me, a website is a living, breathing system suspended in a digital universe. I focus on establishing core structures that align with logical systems, while overlaying the micro-interactions, responsive weights, and smooth transitions that give projects their soul.
              </p>
              <p>
                My work balances creative research with high-performance code, ensuring that every asset, animation, and line of typescript works in harmony. I help brands build customized orbits that stand out and pull users in.
              </p>
            </div>
          </div>

          {/* Right Column: Animated Cosmic Orbit System */}
          <div className="lg:col-span-5 flex justify-center items-center py-8">
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center select-none pointer-events-none">
              
              {/* Planetary Nebula Cloud */}
              <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-[#4E85BF] to-[#89AACC] opacity-[0.08] blur-[45px]" />
              
              {/* Solar Core */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#89AACC] to-[#4E85BF] shadow-[0_0_50px_rgba(137,170,204,0.4)] flex items-center justify-center border border-white/10">
                <span className="font-display italic text-lg text-white font-semibold">Core</span>
              </div>
              
              {/* Inner Orbit Ring */}
              <div
                className="absolute w-44 h-44 rounded-full border border-stroke/40 border-t-[#89AACC]/60 animate-spin"
                style={{ animationDuration: "12s" }}
              />
              
              {/* Outer Orbit Ring */}
              <div
                className="absolute w-60 h-60 rounded-full border border-stroke/20 border-r-[#4E85BF]/40 rotate-[35deg] animate-spin"
                style={{ animationDuration: "20s", animationDirection: "reverse" }}
              />
              
              {/* Orbiting Tiny Satellites */}
              <div className="absolute w-full h-full animate-spin" style={{ animationDuration: "16s" }}>
                <div className="absolute top-10 left-12 w-2 h-2 rounded-full bg-[#89AACC] shadow-[0_0_8px_rgba(137,170,204,0.8)]" />
              </div>
              
              <div className="absolute w-full h-full rotate-[120deg] animate-spin" style={{ animationDuration: "28s", animationDirection: "reverse" }}>
                <div className="absolute top-6 left-6 w-1.5 h-1.5 rounded-full bg-[#4E85BF] shadow-[0_0_6px_rgba(78,133,191,0.8)]" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
