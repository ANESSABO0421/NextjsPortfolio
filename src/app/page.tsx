"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import SelectedWorks from "@/components/SelectedWorks";
import Journal from "@/components/Journal";
import Explorations from "@/components/Explorations";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import ThreeBackground from "@/components/ThreeBackground";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="relative min-h-screen bg-transparent text-text-primary selection:bg-text-primary/20 selection:text-text-primary overflow-x-hidden">
      <ThreeBackground />
      {/* Global Loading Overlay */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Main landing sections (mounted, but entry animations triggered upon loaded state) */}
      <div className={`transition-opacity duration-700 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <Hero isLoaded={!isLoading} />
        <About />
        <Skills />
        <SelectedWorks />
        <Journal />
        <Explorations />
        <Stats />
        <Footer />
      </div>
    </main>
  );
}
