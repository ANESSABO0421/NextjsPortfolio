"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/stores";
import { site } from "@/lib/site";
import { playTick } from "@/lib/sound";
import Magnetic from "@/components/ui/magnetic";
import TransitionLink from "@/components/ui/transition-link";
import RollingText from "@/components/ui/rolling-text";
import LocalTime from "@/components/ui/local-time";

const WORDMARK = site.name.toUpperCase();

/**
 * The closing section doubles as the footer. The headline answers the route
 * map's last stop, swelling from thin to heavy as it scrolls in; the name at
 * the very bottom is fitted to the full measure, a bookend to the hero.
 */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);

  // Fit the wordmark to the column at rest weight; letters may swell past it on hover.
  useEffect(() => {
    const mark = wordmarkRef.current;
    const frame = mark?.parentElement;
    if (!mark || !frame) return;
    const fit = () => {
      mark.style.fontSize = "100px";
      const natural = mark.scrollWidth;
      if (natural > 0) mark.style.fontSize = `${(100 * frame.clientWidth) / natural}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion()) return;

      // Syne's weight axis also drives its width, so the line physically grows.
      gsap.fromTo(
        "[data-kinetic]",
        { "--wght": 400 },
        {
          "--wght": 800,
          ease: "none",
          scrollTrigger: { trigger: "[data-kinetic]", start: "top 92%", end: "top 38%", scrub: true },
        }
      );

      gsap.fromTo(
        "[data-rise]",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-details]", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        "[data-mark-letter]",
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.03,
          scrollTrigger: { trigger: wordmarkRef.current, start: "top 95%", once: true },
        }
      );
    },
    { scope: sectionRef }
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      playTick(1.3);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const backToTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 2.2, force: true });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-surface pt-28 sm:pt-36"
    >
      <div className="px-gutter">
        <div className="flex items-center justify-between mono uppercase text-fg-3">
          <span>(06) — Contact</span>
          <span className="flex items-center gap-2">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" />
            <LocalTime /> IST
          </span>
        </div>

        {/* Headline + call to action */}
        <div className="relative mt-14 sm:mt-20">
          <h2 id="contact-title" className="font-heading uppercase text-fg">
            <span className="block text-[clamp(1.5rem,4.2vw,4.5rem)] leading-none tracking-[-0.02em] text-fg-3 [font-variation-settings:'wght'_560]">
              Next stop —
            </span>
            <span
              data-kinetic
              className="wght block text-[12.2vw] leading-[0.84] tracking-[-0.05em]"
              style={{ "--wght": 800 } as React.CSSProperties}
            >
              Yours<span className="text-lime">?</span>
            </span>
          </h2>

        </div>

        {/* Call to action — sits on the rule, like a seal on a fold */}
        <div className="relative mt-14 flex justify-end sm:mt-24 sm:h-px sm:bg-line-2">
          <div className="sm:absolute sm:right-[4%] sm:top-0 sm:-translate-y-1/2">
            <Magnetic strength={0.4}>
              <TransitionLink
                href="/contact"
                label="Contact"
                className="roll-trigger group relative flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-full bg-cobalt text-center text-[11px] font-bold uppercase leading-tight tracking-[0.16em] text-white transition-transform duration-500 ease-expo hover:scale-105 sm:h-44 sm:w-44 lg:h-52 lg:w-52"
              >
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 ease-expo group-hover:rotate-45" />
                <RollingText text="Start a" />
                <RollingText text="conversation" />
              </TransitionLink>
            </Magnetic>
          </div>
        </div>

        {/* Details */}
        <div
          data-details
          className="mt-10 grid gap-12 border-t border-line-2 pt-10 sm:mt-0 sm:border-t-0 sm:pt-28 lg:grid-cols-12 lg:gap-10 lg:pt-32"
        >
          <div data-rise className="flex flex-col items-start gap-5 lg:col-span-7">
            <span className="mono uppercase text-fg-4">Write</span>
            <a
              href={`mailto:${site.email}`}
              className="roll-trigger font-heading text-[clamp(1.4rem,3.6vw,3.6rem)] leading-none tracking-[-0.03em] text-fg transition-colors hover:text-lime [font-variation-settings:'wght'_600]"
            >
              <RollingText text={site.email} />
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-fg-2 transition-colors hover:border-line-3 hover:text-fg"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-lime" /> : <Copy className="h-3.5 w-3.5" />}
              <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
            </button>
          </div>

          <dl className="grid grid-cols-[6.5rem_1fr] gap-x-6 gap-y-5 text-[15px] lg:col-span-5">
            <dt data-rise className="mono pt-0.5 uppercase text-fg-4">
              Call
            </dt>
            <dd data-rise>
              <a href={site.phoneHref} className="text-fg-2 transition-colors hover:text-fg">
                {site.phone}
              </a>
            </dd>

            <dt data-rise className="mono pt-0.5 uppercase text-fg-4">
              Elsewhere
            </dt>
            <dd data-rise className="flex flex-wrap gap-2">
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-2 px-3.5 py-1.5 text-sm text-fg-2 transition-colors hover:border-transparent hover:bg-lime hover:text-void"
              >
                <FaLinkedinIn className="h-3.5 w-3.5" /> LinkedIn
              </a>
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-2 px-3.5 py-1.5 text-sm text-fg-2 transition-colors hover:border-transparent hover:bg-lime hover:text-void"
              >
                <SiGithub className="h-3.5 w-3.5" /> GitHub
              </a>
              <a
                href={site.resume}
                download={site.resumeFileName}
                className="inline-flex items-center gap-2 rounded-full border border-line-2 px-3.5 py-1.5 text-sm text-fg-2 transition-colors hover:border-transparent hover:bg-fg hover:text-void"
              >
                Résumé <Download className="h-3.5 w-3.5" />
              </a>
            </dd>

            <dt data-rise className="mono pt-0.5 uppercase text-fg-4">
              Studio
            </dt>
            <dd data-rise className="text-fg-2">
              {site.studio.name} <span className="text-fg-4">— est. {site.studio.founded}</span>
            </dd>

            <dt data-rise className="mono pt-0.5 uppercase text-fg-4">
              Based
            </dt>
            <dd data-rise className="text-fg-2">
              {site.region} <span className="mono text-fg-4">· {site.coordinates}</span>
            </dd>
          </dl>
        </div>
      </div>

      {/* Wordmark — fitted to the unpadded inner frame */}
      <div className="mt-24 px-gutter sm:mt-32">
        <div className="overflow-hidden">
          <span
            ref={wordmarkRef}
            aria-hidden
            className="group/mark inline-block whitespace-nowrap font-heading uppercase leading-[0.8] tracking-[-0.045em] text-fg [font-size:7.6vw]"
          >
            {Array.from(WORDMARK).map((char, i) => (
              <span
                key={i}
                className="-mb-[0.06em] inline-block overflow-hidden pb-[0.06em] align-top [&:has(+span:hover)>span]:[--wght:700] [span:hover+&>span]:[--wght:700]"
              >
                <span
                  data-mark-letter
                  className="wght inline-block transition-[font-variation-settings,color] duration-700 ease-expo [--wght:560] hover:text-lime hover:[--wght:800]"
                >
                  {char === " " ? " " : char}
                </span>
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Bottom bar — clear of the floating navigation island */}
      <div className="flex flex-col gap-4 px-gutter pb-28 pt-8 mono uppercase text-fg-4 sm:flex-row sm:items-center sm:justify-between sm:pb-32">
        <span>© 2026 {site.name} · Portfolio ’26</span>
        <span className="hidden md:inline">Designed &amp; built in {site.region}</span>
        <button
          type="button"
          onClick={backToTop}
          className="group inline-flex items-center gap-2 self-start uppercase text-fg-3 transition-colors hover:text-fg sm:self-auto"
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5" />
        </button>
      </div>
    </section>
  );
}
