"use client";

import { useRef } from "react";

interface OrbitTool {
  name: string;
  short: string;
  color: string;
}

const RING_1: OrbitTool[] = [
  { name: "Next.js", short: "NX", color: "from-[#fff] to-[#aaa]" },
  { name: "React", short: "RE", color: "from-[#4E85BF] to-[#89AACC]" },
  { name: "TypeScript", short: "TS", color: "from-[#89AACC] to-[#4E85BF]" },
];

const RING_2: OrbitTool[] = [
  { name: "GSAP", short: "GS", color: "from-[#89AACC] to-[#4E85BF]" },
  { name: "Framer Motion", short: "FM", color: "from-[#fff] to-[#89AACC]" },
  { name: "Tailwind CSS", short: "TW", color: "from-[#4E85BF] to-[#89AACC]" },
  { name: "WebGL / Three", short: "3D", color: "from-[#89AACC] to-[#fff]" },
];

const RING_3: OrbitTool[] = [
  { name: "Figma", short: "FG", color: "from-[#EB5B3C] to-[#4E85BF]" },
  { name: "After Effects", short: "AE", color: "from-[#89AACC] to-[#4E85BF]" },
  { name: "Cinema 4D", short: "C4", color: "from-[#4E85BF] to-[#aaa]" },
  { name: "Node.js", short: "JS", color: "from-[#89AACC] to-[#aaa]" },
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      ref={containerRef}
      id="skills"
      className="relative bg-transparent py-24 md:py-32 overflow-hidden border-t border-stroke/40 flex flex-col items-center justify-center min-h-[90vh] md:min-h-screen"
    >
      {/* Nebula Backdrop */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#89aacc]/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col items-center text-center">
        
        {/* Headings */}
        <div className="mb-16 md:mb-20 max-w-xl">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
              Stellar Stack
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-text-primary mb-4 tracking-tight">
            My <span className="font-display italic font-semibold">constellation</span> of tools
          </h2>
          <p className="text-sm md:text-base text-muted">
            The core elements, frameworks, and visual platforms I leverage to construct dynamic digital realities.
          </p>
        </div>

        {/* Orbit System Container */}
        <div className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] flex items-center justify-center select-none">
          
          {/* Central Core Circle */}
          <div className="relative z-30 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#89AACC]/80 to-[#4E85BF]/80 flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(137,170,204,0.45)] backdrop-blur-md">
            <span className="font-display italic text-base sm:text-lg text-white font-bold tracking-tight">Core</span>
          </div>

          {/* Orbit Ring 1 (Inner) - Radius 70px (mobile) to 110px (desktop) */}
          <div
            className="absolute z-20 w-[140px] h-[140px] sm:w-[220px] sm:h-[220px] rounded-full border border-stroke/40 border-t-[#89AACC]/40 animate-spin [--r:70px] sm:[--r:110px]"
            style={{ animationDuration: "18s" }}
          >
            {RING_1.map((tool, idx) => {
              const angle = (idx / RING_1.length) * 360;
              return (
                <div
                  key={tool.name}
                  className="absolute w-10 h-10 sm:w-12 sm:h-12 -ml-5 -mt-5 sm:-ml-6 sm:-mt-6 flex items-center justify-center font-semibold text-[#89AACC]"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${angle}deg) translate(var(--r)) rotate(-${angle}deg)`, // initial pos
                  }}
                >
                  {/* Tool Badge */}
                  <div
                    className="relative w-full h-full rounded-full bg-surface border border-stroke flex items-center justify-center group cursor-pointer hover:scale-110 transition-transform duration-300 shadow-md shadow-black/40 animate-spin"
                    style={{ animationDuration: "18s", animationDirection: "reverse" }} // keeps it upright
                  >
                    <span className={`absolute inset-0 rounded-full bg-gradient-to-tr ${tool.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300`} />
                    <span className="text-[10px] sm:text-xs font-semibold text-[#89AACC] group-hover:text-text-primary transition-colors duration-250 font-mono">
                      {tool.short}
                    </span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-surface/90 border border-stroke px-2 py-1 rounded text-[10px] text-text-primary whitespace-nowrap backdrop-blur-sm">
                      {tool.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orbit Ring 2 (Middle) - Radius 110px (mobile) to 180px (desktop) */}
          <div
            className="absolute z-15 w-[220px] h-[220px] sm:w-[360px] sm:h-[360px] rounded-full border border-stroke/20 border-r-[#4E85BF]/30 animate-spin [--r:110px] sm:[--r:180px]"
            style={{ animationDuration: "28s", animationDirection: "reverse" }}
          >
            {RING_2.map((tool, idx) => {
              const angle = (idx / RING_2.length) * 360;
              return (
                <div
                  key={tool.name}
                  className="absolute w-10 h-10 sm:w-12 sm:h-12 -ml-5 -mt-5 sm:-ml-6 sm:-mt-6 flex items-center justify-center font-semibold text-[#89AACC]"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${angle}deg) translate(var(--r)) rotate(-${angle}deg)`,
                  }}
                >
                  <div
                    className="relative w-full h-full rounded-full bg-surface border border-stroke flex items-center justify-center group cursor-pointer hover:scale-110 transition-transform duration-300 shadow-md shadow-black/40 animate-spin"
                    style={{ animationDuration: "28s" }} // keeps it upright
                  >
                    <span className={`absolute inset-0 rounded-full bg-gradient-to-tr ${tool.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300`} />
                    <span className="text-[10px] sm:text-xs font-semibold text-[#89AACC] group-hover:text-text-primary transition-colors duration-250 font-mono">
                      {tool.short}
                    </span>
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-surface/90 border border-stroke px-2 py-1 rounded text-[10px] text-text-primary whitespace-nowrap backdrop-blur-sm">
                      {tool.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orbit Ring 3 (Outer) - Radius 150px (mobile) to 250px (desktop) */}
          <div
            className="absolute z-10 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-stroke/10 border-l-[#89AACC]/20 animate-spin [--r:150px] sm:[--r:250px]"
            style={{ animationDuration: "40s" }}
          >
            {RING_3.map((tool, idx) => {
              const angle = (idx / RING_3.length) * 360;
              return (
                <div
                  key={tool.name}
                  className="absolute w-10 h-10 sm:w-12 sm:h-12 -ml-5 -mt-5 sm:-ml-6 sm:-mt-6 flex items-center justify-center font-semibold text-[#89AACC]"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${angle}deg) translate(var(--r)) rotate(-${angle}deg)`,
                  }}
                >
                  <div
                    className="relative w-full h-full rounded-full bg-surface border border-stroke flex items-center justify-center group cursor-pointer hover:scale-110 transition-transform duration-300 shadow-md shadow-black/40 animate-spin"
                    style={{ animationDuration: "40s", animationDirection: "reverse" }} // keeps it upright
                  >
                    <span className={`absolute inset-0 rounded-full bg-gradient-to-tr ${tool.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300`} />
                    <span className="text-[10px] sm:text-xs font-semibold text-[#89AACC] group-hover:text-text-primary transition-colors duration-250 font-mono">
                      {tool.short}
                    </span>
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-surface/90 border border-stroke px-2 py-1 rounded text-[10px] text-text-primary whitespace-nowrap backdrop-blur-sm">
                      {tool.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
