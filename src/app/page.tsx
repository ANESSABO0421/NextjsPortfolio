"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Preloader from "@/components/ui/preloader";
import Header from "@/components/layout/header";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Experience from "@/components/sections/experience";
import Works from "@/components/sections/works";
import Contact from "@/components/sections/contact";
import { useLenis } from "@/components/providers/smooth-scroll-provider";

// Code-split off the initial bundle — it pulls in a dozen react-icons brand
// icons plus its own rAF loop, none of which are needed for first paint.
// Stays server-rendered (no ssr:false) so it's still there without JS and
// doesn't shift layout in; it just loads as its own parallel chunk instead
// of bloating the bundle every other section needs immediately.
const Skills = dynamic(() => import("@/components/sections/skills"), {
  loading: () => <div className="h-[640px] sm:h-[760px] w-full bg-[#111112]" />,
});

function hasShownPreloader() {
  try {
    return sessionStorage.getItem("preloader-shown") === "true";
  } catch {
    return false;
  }
}

function markPreloaderShown() {
  try {
    sessionStorage.setItem("preloader-shown", "true");
  } catch {
    // Storage can be unavailable in some browser modes; the loader should still exit.
  }
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !hasShownPreloader();
    }

    return true;
  });
  const { lenis } = useLenis();

  useEffect(() => {
    lenis?.start();

    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        const el = document.querySelector(hash) as HTMLElement;
        if (el) {
          lenis?.scrollTo(el, { duration: 1.5 });
        }
      }, 150);
    } else {
      lenis?.scrollTo(0, { immediate: true });
    }
  }, [lenis]);

  return (
    <main className="relative min-h-screen bg-[#0f0f10] text-white">
      {isLoading && (
        <Preloader
          onComplete={() => {
            markPreloaderShown();
            setIsLoading(false);
          }}
        />
      )}
      <Header />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Works />
      <Contact />
    </main>
  );
}
