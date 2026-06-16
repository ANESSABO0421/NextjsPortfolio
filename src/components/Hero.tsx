"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Hls from "hls.js";

interface HeroProps {
  isLoaded: boolean;
}

const ROLES = ["Creative", "Fullstack", "Founder", "Scholar"];

export default function Hero({ isLoaded }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  // Track scroll position for navbar style changes and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Simple active link detection
      const sections = ["home", "work", "resume"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle HLS video setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true,
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  // Cycle roles every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      );

      tl.fromTo(
        ".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 },
        "-=0.9"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // Smooth scroll handler
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-bg text-center px-4"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
        <div
          className={`inline-flex items-center rounded-full transition-all duration-350 ${
            scrollY > 100
              ? "glass-pill shadow-md shadow-black/30 px-3 py-2"
              : "bg-surface/60 border border-white/5 px-2 py-1.5 backdrop-blur-sm"
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => handleScrollTo("home")}
            className="group relative w-9 h-9 rounded-full p-[1.5px] overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          >
            {/* Ambient rotating gradient border wrapper */}
            <div className="absolute inset-0 accent-gradient transition-all duration-500 group-hover:rotate-180" />
            <div className="relative w-full h-full rounded-full bg-bg flex items-center justify-center">
              <span className="font-display italic font-semibold text-[13px] text-text-primary tracking-tighter">
                JA
              </span>
            </div>
          </button>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-stroke mx-2" />

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {[
              { label: "Home", id: "home" },
              { label: "Work", id: "work" },
              { label: "Journal", id: "journal" },
            ].map((link) => {
              const active = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleScrollTo(link.id)}
                  className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 cursor-pointer ${
                    active
                      ? "text-text-primary bg-stroke/60 font-medium"
                      : "text-muted hover:text-text-primary hover:bg-stroke/30"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-stroke mx-2" />

          {/* "Say hi" button */}
          <a
            href="mailto:hello@michaelsmith.com"
            className="group relative rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 text-text-primary overflow-hidden transition-all duration-300"
          >
            {/* Hover border glow backdrop */}
            <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" style={{ padding: "2px" }} />
            <span className="absolute inset-[1px] bg-surface rounded-full -z-10 transition-colors duration-300 group-hover:bg-bg" />
            Say hi <span className="inline-block transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
          </a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl pt-16">
        {/* Eyebrow */}
        <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8 font-medium">
          COLLECTION '26
        </p>

        {/* Name */}
        <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6 select-none">
          Michael Smith
        </h1>

        {/* Role line */}
        <div className="blur-in text-lg md:text-xl lg:text-2xl text-text-primary/90 mb-6 font-light">
          <span>A </span>
          <span
            key={roleIndex}
            className="font-display italic text-text-primary animate-role-fade-in inline-block font-semibold px-1"
          >
            {ROLES[roleIndex]}
          </span>
          <span> lives in Chicago.</span>
        </div>

        {/* Description */}
        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12 leading-relaxed">
          Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.
        </p>

        {/* CTA Buttons */}
        <div className="blur-in inline-flex items-center gap-4">
          {/* See Works */}
          <button
            onClick={() => handleScrollTo("work")}
            className="group relative rounded-full text-sm font-medium px-7 py-3.5 bg-text-primary text-bg transition-all duration-300 hover:scale-105 hover:bg-transparent hover:text-text-primary cursor-pointer overflow-hidden"
          >
            {/* Gradient background on hover */}
            <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            See Works
          </button>

          {/* Reach out */}
          <a
            href="mailto:hello@michaelsmith.com"
            className="group relative rounded-full text-sm font-medium px-7 py-3.5 border-2 border-stroke bg-bg text-text-primary transition-all duration-300 hover:scale-105 hover:border-transparent cursor-pointer overflow-hidden flex items-center justify-center"
          >
            {/* Gradient border ring on hover */}
            <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-20" />
            <span className="absolute inset-[1.5px] bg-bg rounded-full -z-10" />
            Reach out...
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none select-none">
        <span className="text-[10px] text-muted uppercase tracking-[0.25em] font-medium">
          SCROLL
        </span>
        <div className="w-[1px] h-10 bg-stroke/60 relative overflow-hidden rounded-full">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-text-primary/70 animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
