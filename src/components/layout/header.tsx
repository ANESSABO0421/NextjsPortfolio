"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/components/ui/magnetic";
import { useLenis } from "@/components/providers/smooth-scroll-provider";
import { useTransition } from "@/components/providers/transition-provider";
import { Menu, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Selected Works", href: "#works" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuActive, setMenuActive] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [useLightMenuMotion, setUseLightMenuMotion] = useState(false);
  const { lenis } = useLenis();
  const pathname = usePathname();
  const { transitionTo } = useTransition();
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuPathRef = useRef<SVGPathElement>(null);
  const floatingButtonRef = useRef<HTMLDivElement>(null);

  // 1. Scroll-based display of the floating magnetic menu trigger button
  useEffect(() => {
    const lightMotionQuery = window.matchMedia(
      "(max-width: 767px), (pointer: coarse), (prefers-reduced-motion: reduce)"
    );
    const updateMotionMode = () => setUseLightMenuMotion(lightMotionQuery.matches);
    updateMotionMode();

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const shouldShow = window.scrollY > 300;
        setShowFloatingButton((current) => (current === shouldShow ? current : shouldShow));
        if (!shouldShow) {
          setMenuActive(false);
        }
        ticking = false;
      });
    };

    lightMotionQuery.addEventListener("change", updateMotionMode);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      lightMotionQuery.removeEventListener("change", updateMotionMode);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 2. Floating action button entrance/exit (Show on scroll OR when menu is open)
  useGSAP(() => {
    if (showFloatingButton || menuActive) {
      gsap.to(floatingButtonRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    } else {
      gsap.to(floatingButtonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [showFloatingButton, menuActive]);

  // 3. Liquid menu slide-out animation (Curved panel morphing)
  useGSAP(
    () => {
      const menu = menuContainerRef.current;
      const path = menuPathRef.current;
      if (!menu || !path) return;

      const width = 380; // Slideout panel width
      const height = window.innerHeight;

      // Curved initial states and straight target states for SVG
      const initialPath = `M100 0 L${width} 0 L${width} ${height} L100 ${height} Q-100 ${height / 2} 100 0 Z`;
      const targetPath = `M0 0 L${width} 0 L${width} ${height} L0 ${height} Q0 ${height / 2} 0 0 Z`;

      if (menuActive) {
        // Toggle scrolling locks
        lenis?.stop();

        // 1. Set panels initial slide-in coordinates
        gsap.set(menu, { xPercent: 100, x: 100, display: "block" });
        gsap.set(path, { attr: { d: initialPath } });

        const tl = gsap.timeline();

        if (useLightMenuMotion) {
          tl.to(menu, {
            xPercent: 0,
            x: 0,
            duration: 0.32,
            ease: "power2.out",
          });

          tl.fromTo(
            ".menu-link-item",
            { x: 28, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              stagger: 0.04,
              duration: 0.28,
              ease: "power2.out",
            },
            "-=0.16"
          );
          return;
        }

        // 2. Slide container in from right
        tl.to(menu, {
          xPercent: 0,
          x: 0,
          duration: 0.85,
          ease: "power4.inOut",
        });

        // 3. Morph liquid border path to flat straight edge
        tl.to(
          path,
          {
            attr: { d: targetPath },
            duration: 0.85,
            ease: "power3.inOut",
          },
          "-=0.85"
        );

        // 4. Stagger animate links entrance
        tl.fromTo(
          ".menu-link-item",
          { x: 120, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.4"
        );
      } else {
        lenis?.start();

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(menu, { display: "none" });
          },
        });

        if (useLightMenuMotion) {
          tl.to(".menu-link-item", {
            x: 28,
            opacity: 0,
            stagger: 0.025,
            duration: 0.18,
            ease: "power2.in",
          });

          tl.to(
            menu,
            {
              xPercent: 100,
              x: 100,
              duration: 0.28,
              ease: "power2.inOut",
            },
            "-=0.08"
          );
          return;
        }

        // Slide links out
        tl.to(".menu-link-item", {
          x: 80,
          opacity: 0,
          stagger: 0.04,
          duration: 0.4,
          ease: "power3.in",
        });

        // Morph border path back to curve
        tl.to(
          path,
          {
            attr: { d: initialPath },
            duration: 0.75,
            ease: "power3.inOut",
          },
          "-=0.2"
        );

        // Slide panel right off screen
        tl.to(
          menu,
          {
            xPercent: 100,
            x: 100,
            duration: 0.75,
            ease: "power4.inOut",
          },
          "-=0.75"
        );
      }
    },
    { dependencies: [menuActive, useLightMenuMotion], scope: menuContainerRef }
  );

  // Optimized dynamic navigation callback
  const handleNavigation = useCallback((label: string, href: string) => {
    const wasMenuOpen = menuActive;
    setMenuActive(false);

    // If Contact click, transition to contact page
    if (label === "Contact" || href === "#contact") {
      if (wasMenuOpen) {
        setTimeout(() => {
          transitionTo("/contact", "Contact");
        }, 600);
      } else {
        transitionTo("/contact", "Contact");
      }
      return;
    }

    // Scroll to section directly if already on home page
    if (pathname === "/") {
      const scrollTrigger = () => {
        const el = document.querySelector(href) as HTMLElement;
        if (el) {
          lenis?.scrollTo(el, {
            duration: 1.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      };

      if (wasMenuOpen) {
        setTimeout(scrollTrigger, 700);
      } else {
        scrollTrigger();
      }
    } else {
      // Transition to homepage with hash target
      const targetUrl = href === "#hero" ? "/" : `/${href}`;
      if (wasMenuOpen) {
        setTimeout(() => {
          transitionTo(targetUrl, label);
        }, 600);
      } else {
        transitionTo(targetUrl, label);
      }
    }
  }, [pathname, lenis, transitionTo, menuActive]);

  return (
    <>
      {/* Dynamic Static Header (Shown at scroll-top) */}
      <header className="absolute top-0 left-0 w-full z-40 flex items-center justify-between px-6 sm:px-12 py-8 mix-blend-difference text-white">
        {/* Kinetic rolling brand logo */}
        <div
          onClick={() => handleNavigation("Home", "#hero")}
          className="group flex cursor-pointer items-center gap-1 font-heading text-lg font-bold uppercase select-none"
        >
          <div className="relative overflow-hidden flex h-6">
            <span className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-full">
              Anees Aboobacker
            </span>
            <span className="absolute left-0 top-full inline-block transition-transform duration-500 ease-out group-hover:-translate-y-full text-[#c9fd34]">
              MERN Dev
            </span>
          </div>
        </div>

        {/* Desktop Navigation Link items */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item, i) => (
            <Magnetic key={i} actionStrength={0.25} hoverAreaPadding="px-4 py-2">
              <span
                onClick={() => handleNavigation(item.label, item.href)}
                className="relative text-sm font-light tracking-wide uppercase transition-colors duration-300 hover:text-[#c9fd34] cursor-pointer"
              >
                {item.label}
              </span>
            </Magnetic>
          ))}
        </nav>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setMenuActive(true)}
            className="flex items-center justify-center hover:text-[#c9fd34]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Floating Sticky Menu Action Trigger (Slides in on scroll down or when menu is active) */}
      <div
        ref={floatingButtonRef}
        className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 scale-0 opacity-0"
      >
        <Magnetic actionStrength={0.4} hoverAreaPadding="p-0">
          <button
            type="button"
            aria-label={menuActive ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuActive((prev) => !prev)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border border-white/10 transition-colors duration-300 cursor-pointer
              ${menuActive ? "bg-[#c9fd34] text-black" : "bg-[#1f1f21] text-white hover:bg-[#c9fd34] hover:text-black"}
            `}
          >
            {menuActive ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </Magnetic>
      </div>

      {/* Fullscreen Overlay Menu (Curved Morphing slide panel) */}
      <div
        ref={menuContainerRef}
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] md:w-[380px] max-w-full z-45 hidden bg-[#1c1c1f]"
      >
        {/* Curved boundary graphic using morphing SVG path */}
        <svg className="absolute top-0 left-[-99px] hidden md:block w-[100px] h-full fill-[#1c1c1f] pointer-events-none">
          <path ref={menuPathRef} />
        </svg>

        <div className="flex flex-col h-full justify-between p-8 sm:p-14 md:p-20 text-white font-sans">
          <div className="flex flex-col gap-10 sm:gap-12 mt-16 sm:mt-12">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-4">
              Navigation
            </span>
            <div className="flex flex-col gap-6">
              {navItems.map((item, i) => (
                <div key={i} className="menu-link-item overflow-hidden">
                  <span
                    onClick={() => handleNavigation(item.label, item.href)}
                    className="block font-heading text-3xl sm:text-5xl font-light hover:text-[#c9fd34] transition-colors duration-300 cursor-pointer"
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
              Socials
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/anees-aboobacker-4842b627a/"
                target="_blank"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-[#c9fd34] hover:border-transparent transition-all duration-300"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/ANESSABO0421"
                target="_blank"
                aria-label="GitHub"
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-[#c9fd34] hover:border-transparent transition-all duration-300"
              >
                <SiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
