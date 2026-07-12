"use client";

import React, { useState, useEffect } from "react";
import Preloader from "@/components/ui/preloader";
import Header from "@/components/layout/header";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Works from "@/components/sections/works";
import Contact from "@/components/sections/contact";
import { useLenis } from "@/components/providers/smooth-scroll-provider";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { lenis } = useLenis();

  // Scroll lock orchestration during preloading
  useEffect(() => {
    if (isLoading) {
      lenis?.stop();
    } else {
      lenis?.start();
      
      // If navigating with a hash (e.g., from subpages), scroll to the target section
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash;
        setTimeout(() => {
          const el = document.querySelector(hash) as HTMLElement;
          if (el) {
            lenis?.scrollTo(el, { duration: 1.5 });
          }
        }, 150);
      } else {
        // Otherwise reset to top
        lenis?.scrollTo(0, { immediate: true });
      }
    }
  }, [isLoading, lenis]);

  return (
    <main className="relative min-h-screen bg-[#0f0f10] text-white">
      {/* 1. Curved Liquid Preloader Overlay */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      {/* 2. Primary Page Components */}
      <Header />
      <Hero />
      <About />
      <Works />
      <Contact />
    </main>
  );
}
