"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Download } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useIntroDone, useLenis, usePageRevealed } from "@/lib/stores";
import { playTick, setSoundEnabled, useSoundEnabled } from "@/lib/sound";
import { pad2, sections, site } from "@/lib/site";
import { getProject } from "@/lib/projects";
import { scrollToHash } from "@/components/providers/transition-provider";
import TransitionLink from "@/components/ui/transition-link";
import RollingText from "@/components/ui/rolling-text";
import LocalTime from "@/components/ui/local-time";

const BAR_HEIGHT = 56;
const COLLAPSED_WIDTH = 268;
const RING_RADIUS = 11;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

// Unknown case-study ids are 404s. The 404 page is prerendered once (as
// /_not-found), so every unmatched path must resolve to the same label the
// server rendered — otherwise hydration fails.
function routeLabel(pathname: string) {
  if (pathname.startsWith("/work/")) {
    const project = getProject(pathname.split("/")[2] ?? "");
    if (project) return { index: pad2(project.index), label: project.listTitle };
  }
  if (pathname === "/contact") return { index: "→", label: "Contact" };
  return { index: "—", label: "Off route" };
}

export default function Header() {
  const introDone = useIntroDone();
  const revealed = usePageRevealed();
  const ready = introDone && revealed;

  return (
    <>
      <TopBar ready={ready} />
      <Island ready={ready} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Top bar — blends with whatever it sits on, so it reads on dark and light
   pages alike. It scrolls away with the page; the island stays.
   ───────────────────────────────────────────────────────────────────────── */

function TopBar({ ready }: { ready: boolean }) {
  const barRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      gsap.fromTo(
        "[data-topbar-item]",
        { yPercent: -120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.25 }
      );
    },
    { scope: barRef, dependencies: [ready] }
  );

  return (
    <header
      ref={barRef}
      className="pointer-events-none absolute inset-x-0 top-0 z-40 text-white mix-blend-difference"
    >
      <div className="flex items-start justify-between gap-6 px-gutter pt-5 sm:pt-7">
        <TransitionLink
          href="/"
          label="Index"
          data-topbar-item
          className="roll-trigger pointer-events-auto flex items-baseline gap-1.5 font-heading text-[15px] font-bold uppercase leading-none tracking-[-0.01em] opacity-0"
        >
          <RollingText text={site.name} />
          <span className="mono text-[10px] font-normal">©26</span>
        </TransitionLink>

        <div
          data-topbar-item
          className="hidden items-start gap-16 mono uppercase leading-relaxed opacity-0 lg:flex"
        >
          <p>
            Full Stack
            <br />
            MERN Developer
          </p>
          <p>
            {site.region}
            <br />
            <LocalTime short /> IST
          </p>
        </div>

        <TransitionLink
          href="/contact"
          label="Contact"
          data-topbar-item
          className="roll-trigger pointer-events-auto flex items-center gap-2.5 text-[13px] font-medium uppercase leading-none tracking-[0.12em] opacity-0"
        >
          <span className="pulse-dot h-2 w-2 rounded-full bg-lime" />
          <RollingText text="Let's talk" />
        </TransitionLink>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Island — a persistent pill at the bottom of the screen (thumb reach on
   phones). Collapsed it shows where you are and how far down the page you
   have scrolled; opened, it morphs upward into the navigation panel.
   ───────────────────────────────────────────────────────────────────────── */

function Island({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const lenis = useLenis();
  const sound = useSoundEnabled();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(sections[0].id);
  // On the home page the island waits until the hero is behind you — the
  // name owns the first screen.
  const [pastHero, setPastHero] = useState(false);
  const visible = ready && (!isHome || pastHero || open);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const panelId = useId();

  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === activeId));
  const current = isHome
    ? { index: pad2(activeIndex + 1), label: sections[activeIndex].label }
    : routeLabel(pathname);

  // Which home section is crossing the middle of the viewport. After a jump,
  // a pinned section (position: fixed) can still report as intersecting in
  // the same batch as the one actually there, so track everything in view
  // and let the lowest section on the page win.
  useEffect(() => {
    if (!isHome) return;
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target.id);
          else inView.delete(entry.target.id);
        }
        const lowest = sections.filter(({ id }) => inView.has(id)).pop();
        if (lowest) setActiveId(lowest.id);
      },
      { rootMargin: "-49% 0px -50% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  // Scroll progress ring — written straight to the SVG, never through state.
  // The only state it touches is the boolean "past the hero" flag.
  useEffect(() => {
    const circle = ringRef.current;
    if (!circle) return;
    const update = () => {
      const scroll = lenis ? lenis.scroll : window.scrollY;
      const limit = lenis ? lenis.limit : document.documentElement.scrollHeight - window.innerHeight;
      const progress = limit > 0 ? scroll / limit : 0;
      const clamped = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
      circle.style.strokeDashoffset = String(RING_LENGTH * (1 - clamped));
      setPastHero(scroll > window.innerHeight * 0.55);
    };
    const frame = requestAnimationFrame(update);
    if (lenis) {
      const off = lenis.on("scroll", update);
      return () => {
        cancelAnimationFrame(frame);
        off();
      };
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [lenis, pathname]);

  // Entrance once the intro / route curtain is out of the way.
  useGSAP(
    () => {
      gsap.to(rootRef.current, {
        yPercent: visible ? 0 : 180,
        opacity: visible ? 1 : 0,
        duration: visible ? 1 : 0.45,
        delay: visible && !isHome ? 0.9 : 0,
        ease: visible ? "expo.out" : "power2.in",
        overwrite: "auto",
      });
    },
    { dependencies: [visible] }
  );

  // Label swap whenever the section changes.
  useGSAP(
    () => {
      if (!labelRef.current || prefersReducedMotion()) return;
      gsap.fromTo(labelRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "expo.out" });
    },
    { dependencies: [current.label, open] }
  );

  // Morph between pill and panel.
  useGSAP(
    () => {
      const root = rootRef.current;
      const panel = panelRef.current;
      if (!root || !panel) return;
      const reduce = prefersReducedMotion();
      const items = panel.querySelectorAll("[data-stagger]");

      if (open) {
        gsap.set(panel, { display: "flex" });
        const width = Math.min(440, window.innerWidth - 24);
        const height = panel.scrollHeight + BAR_HEIGHT;
        gsap.to(root, { width, height, borderRadius: 24, duration: reduce ? 0 : 0.8, ease: "expo.out", overwrite: "auto" });
        gsap.fromTo(
          items,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: reduce ? 0 : 0.7, stagger: 0.035, delay: reduce ? 0 : 0.12, ease: "expo.out" }
        );
      } else {
        gsap.to(items, { opacity: 0, duration: 0.15, overwrite: true });
        gsap.to(root, {
          width: COLLAPSED_WIDTH,
          height: BAR_HEIGHT,
          borderRadius: BAR_HEIGHT / 2,
          duration: reduce ? 0 : 0.65,
          ease: "expo.inOut",
          overwrite: "auto",
          onComplete: () => {
            gsap.set(panel, { display: "none" });
          },
        });
      }
    },
    { dependencies: [open], scope: rootRef }
  );

  // Escape / outside click close, focus management.
  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (root && !root.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    const focusTimer = window.setTimeout(() => {
      root?.querySelector<HTMLElement>("[data-nav-link]")?.focus({ preventScroll: true });
    }, 120);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const goToSection = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToHash(`#${id}`), 260);
  };

  return (
    <div
      ref={rootRef}
      style={{ width: COLLAPSED_WIDTH, height: BAR_HEIGHT, borderRadius: BAR_HEIGHT / 2, opacity: 0 }}
      // Centred with auto margins rather than a translate: GSAP owns this
      // element's transform (yPercent) and would otherwise fold the CSS
      // translate into it, which it doesn't do reliably on every path.
      className="fixed inset-x-0 bottom-4 z-50 mx-auto overflow-hidden border border-line-2 bg-[#141416] text-fg shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] sm:bottom-6"
    >
      {/* Panel — grows upward from the pill */}
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-label="Site navigation"
        className="absolute inset-x-0 top-0 hidden flex-col gap-6 px-5 pb-3 pt-5 sm:px-6"
      >
        <div data-stagger className="flex items-center justify-between mono uppercase text-fg-3">
          <span>Navigation</span>
          <span>
            <LocalTime short /> IST
          </span>
        </div>

        <nav aria-label="Sections">
          <ul className="flex flex-col">
            {sections.map((section, i) => {
              const isActive = isHome && section.id === activeId;
              const content = (
                <>
                  <span className="mono w-7 text-fg-3">{pad2(i + 1)}</span>
                  <span
                    className="font-heading text-[1.65rem] leading-[1.25] tracking-[-0.02em] transition-[font-variation-settings] duration-500 ease-expo [font-variation-settings:'wght'_560] group-hover:[font-variation-settings:'wght'_800] group-focus-visible:[font-variation-settings:'wght'_800]"
                  >
                    {section.label}
                  </span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-lime" />}
                </>
              );
              const className =
                "backlit group flex items-center gap-3 rounded-lg px-2 py-1 -mx-2 outline-none";
              return (
                <li key={section.id} data-stagger>
                  {isHome ? (
                    <a
                      href={`#${section.id}`}
                      data-nav-link
                      data-active={isActive}
                      aria-current={isActive ? "location" : undefined}
                      onClick={(event) => goToSection(event, section.id)}
                      onPointerEnter={() => playTick()}
                      className={className}
                    >
                      {content}
                    </a>
                  ) : (
                    <TransitionLink
                      href={`/#${section.id}`}
                      label={section.label}
                      data-nav-link
                      onClick={() => setOpen(false)}
                      onPointerEnter={() => playTick()}
                      className={className}
                    >
                      {content}
                    </TransitionLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div data-stagger className="flex flex-wrap items-center gap-2 border-t border-line-2 pt-4">
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-2 text-fg-2 transition-colors hover:border-transparent hover:bg-lime hover:text-void"
          >
            <FaLinkedinIn className="h-3.5 w-3.5" />
          </a>
          <a
            href={site.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-2 text-fg-2 transition-colors hover:border-transparent hover:bg-lime hover:text-void"
          >
            <SiGithub className="h-3.5 w-3.5" />
          </a>
          <a
            href={site.resume}
            download={site.resumeFileName}
            className="flex h-9 items-center gap-1.5 rounded-full border border-line-2 px-3.5 text-xs font-medium text-fg-2 transition-colors hover:border-transparent hover:bg-fg hover:text-void"
          >
            Résumé <Download className="h-3 w-3" />
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex h-9 items-center gap-1.5 rounded-full border border-line-2 px-3.5 text-xs font-medium text-fg-2 transition-colors hover:border-transparent hover:bg-fg hover:text-void"
          >
            Email <ArrowUpRight className="h-3 w-3" />
          </a>
          <button
            type="button"
            aria-pressed={sound}
            onClick={() => setSoundEnabled(!sound)}
            className="ml-auto flex h-9 items-center gap-2 rounded-full px-2 text-xs font-medium text-fg-3 transition-colors hover:text-fg"
          >
            <span data-on={sound} className="equalizer flex h-3 items-end gap-[2px]">
              <span />
              <span />
              <span />
            </span>
            Sound {sound ? "on" : "off"}
          </button>
        </div>
      </div>

      {/* The pill itself — always the toggle */}
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close navigation" : `Open navigation — currently at ${current.label}`}
        onClick={() => {
          playTick(open ? 0.8 : 1);
          setOpen((value) => !value);
        }}
        className="absolute inset-x-0 bottom-0 flex items-center gap-3 pl-2 pr-5 text-left"
        style={{ height: BAR_HEIGHT - 2 }}
      >
        <span aria-hidden className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          <svg viewBox="0 0 28 28" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="14" cy="14" r={RING_RADIUS} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1.5" />
            <circle
              ref={ringRef}
              cx="14"
              cy="14"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--accent-lime)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH}
            />
          </svg>
          <span className="mono text-[10px] text-fg-2">{current.index}</span>
        </span>

        <span aria-hidden className="block min-w-0 flex-1 overflow-hidden">
          <span
            ref={labelRef}
            className="block truncate font-heading text-[13px] font-semibold uppercase tracking-[0.06em]"
          >
            {open ? "Close" : current.label}
          </span>
        </span>

        <span aria-hidden className="flex items-center gap-2.5 mono uppercase text-fg-3">
          {open ? "Esc" : "Menu"}
          <span className="relative h-2.5 w-4">
            <span
              className={`absolute left-0 h-px w-full bg-fg transition-transform duration-500 ease-expo ${
                open ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-fg transition-transform duration-500 ease-expo ${
                open ? "top-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </span>
      </button>
    </div>
  );
}
