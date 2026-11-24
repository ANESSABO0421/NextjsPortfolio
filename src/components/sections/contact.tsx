"use client";

import { useRef, useState } from "react";
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

/**
 * The closing section is the hero's bookend: same slate, same white type.
 * A huge headline, a magnetic round call to action, and the details.
 */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion()) return;

      gsap.fromTo(
        "[data-line] > span",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.4,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-headline]", start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        "[data-cta]",
        { scale: 0, rotate: -90 },
        {
          scale: 1,
          rotate: 0,
          duration: 1.4,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: "[data-headline]", start: "top 70%", once: true },
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
          scrollTrigger: { trigger: "[data-details]", start: "top 88%", once: true },
        }
      );
      // The closing word drifts sideways with the scroll, like the hero's ribbon.
      gsap.fromTo(
        "[data-drift]",
        { xPercent: 6 },
        {
          xPercent: -22,
          ease: "none",
          scrollTrigger: { trigger: "[data-drift]", start: "top bottom", end: "bottom top", scrub: true },
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

  const pill =
    "inline-flex items-center gap-2 rounded-full border border-white/35 px-4 py-2 text-sm transition-colors duration-300 hover:border-transparent hover:bg-white hover:text-pal-ink";

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-title"
      className="relative z-40 -mt-[var(--lap)] overflow-hidden rounded-t-[var(--lap)] bg-pal-slate pt-28 text-white sm:pt-36"
    >
      <div className="px-gutter">
        <div className="flex items-center justify-between mono uppercase text-white/70">
          <span>Contact</span>
          <span className="flex items-center gap-2">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white" />
            <LocalTime /> IST
          </span>
        </div>

        <div data-headline className="relative mt-14 sm:mt-20">
          <h2
            id="contact-title"
            className="text-[clamp(2.6rem,7.6vw,8rem)] font-medium leading-[0.9] tracking-[-0.055em]"
          >
            <span data-line className="block overflow-hidden pb-[0.08em]">
              <span className="block">Let&apos;s work</span>
            </span>
            <span data-line className="block overflow-hidden pb-[0.08em]">
              <span className="block">together.</span>
            </span>
          </h2>

          <div data-cta className="absolute -top-6 right-0 sm:top-auto sm:bottom-[0.4em]">
            <Magnetic strength={0.4}>
              <TransitionLink
                href="/contact"
                label="Contact"
                className="roll-trigger group flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full bg-pal-ink text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.14em] text-white transition-transform duration-500 ease-expo hover:scale-105 sm:h-32 sm:w-32 lg:h-36 lg:w-36"
              >
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 ease-expo group-hover:rotate-45" />
                <RollingText text="Start a" />
                <RollingText text="conversation" />
              </TransitionLink>
            </Magnetic>
          </div>
        </div>

        <div
          data-details
          className="mt-20 grid gap-12 border-t border-white/30 pt-10 sm:mt-28 lg:grid-cols-12 lg:gap-10"
        >
          <div data-rise className="flex flex-col items-start gap-5 lg:col-span-7">
            <span className="mono uppercase text-white/65">Write</span>
            <a
              href={`mailto:${site.email}`}
              className="roll-trigger text-[clamp(1.2rem,2.4vw,2.4rem)] font-medium leading-none tracking-[-0.04em]"
            >
              <RollingText text={site.email} />
            </a>
            <button type="button" onClick={copyEmail} className={pill}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
            </button>
          </div>

          <dl className="grid grid-cols-[6.5rem_1fr] gap-x-6 gap-y-5 text-[15px] lg:col-span-5">
            <dt data-rise className="mono pt-0.5 uppercase text-white/65">Call</dt>
            <dd data-rise>
              <a href={site.phoneHref} className="transition-opacity hover:opacity-70">
                {site.phone}
              </a>
            </dd>

            <dt data-rise className="mono pt-0.5 uppercase text-white/65">Elsewhere</dt>
            <dd data-rise className="flex flex-wrap gap-2">
              <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className={pill}>
                <FaLinkedinIn className="h-3.5 w-3.5" /> LinkedIn
              </a>
              <a href={site.socials.github} target="_blank" rel="noopener noreferrer" className={pill}>
                <SiGithub className="h-3.5 w-3.5" /> GitHub
              </a>
              <a href={site.resume} download={site.resumeFileName} className={pill}>
                Résumé <Download className="h-3.5 w-3.5" />
              </a>
            </dd>

            <dt data-rise className="mono pt-0.5 uppercase text-white/65">Studio</dt>
            <dd data-rise>
              {site.studio.name} <span className="text-white/65">— est. {site.studio.founded}</span>
            </dd>

            <dt data-rise className="mono pt-0.5 uppercase text-white/65">Based</dt>
            <dd data-rise>{site.region}</dd>
          </dl>
        </div>
      </div>

      {/* Closing word — drifts sideways as you reach the end */}
      <div aria-hidden className="mt-24 overflow-hidden sm:mt-32">
        <div
          data-drift
          className="w-max whitespace-nowrap text-[min(17vw,28svh)] font-medium leading-[0.8] tracking-[-0.06em] text-white/90"
        >
          {site.firstName} — {site.firstName} — {site.firstName}
        </div>
      </div>

      <div className="flex flex-col gap-4 px-gutter pb-28 pt-10 mono uppercase text-white/70 sm:flex-row sm:items-center sm:justify-between sm:pb-32">
        <span>© 2026 {site.name}</span>
        <span className="hidden md:inline">Designed &amp; built in {site.region}</span>
        <button
          type="button"
          onClick={backToTop}
          className="group inline-flex items-center gap-2 self-start uppercase transition-opacity hover:opacity-70 sm:self-auto"
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5" />
        </button>
      </div>
    </section>
  );
}
