"use client";

import { useRef } from "react";
import SplitType from "split-type";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type RevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface TextRevealProps {
  text: string;
  as?: RevealTag;
  className?: string;
  /** What slides up through its mask. */
  split?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  duration?: number;
  /**
   * When provided, the reveal waits for this to become true instead of a
   * scroll trigger — used for above-the-fold copy that follows the intro.
   */
  ready?: boolean;
  start?: string;
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Masked text reveal built on SplitType. The text is injected as HTML so
 * React never reconciles the nodes SplitType rewrites, and the split is
 * rebuilt when the element's width changes (line breaks move on resize).
 */
export default function TextReveal({
  text,
  as: Tag = "p",
  className,
  split = "lines",
  delay = 0,
  stagger,
  duration = 1.1,
  ready,
  start = "top 88%",
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const waitForReady = ready !== undefined;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // Releases the `.intro-hidden` pre-paint guard, if the caller used it.
      el.style.visibility = "visible";
      if (prefersReducedMotion()) return;

      let instance: SplitType | null = null;
      let revealed = false;
      let width = el.offsetWidth;

      const targetsOf = (s: SplitType) =>
        (split === "lines" ? s.lines : split === "words" ? s.words : s.chars) ?? [];

      const build = () => {
        instance?.revert();
        instance = new SplitType(el, {
          types: split === "lines" ? "lines" : split === "words" ? "lines,words" : "lines,words,chars",
          tagName: "span",
        });
        instance.lines?.forEach((line) => {
          const mask = document.createElement("span");
          mask.style.cssText = "display:block;overflow:hidden;padding-bottom:0.14em;margin-bottom:-0.14em;";
          line.style.display = "block";
          line.parentNode?.insertBefore(mask, line);
          mask.appendChild(line);
        });
        const targets = targetsOf(instance);
        gsap.set(targets, { yPercent: revealed ? 0 : 115, display: "inline-block" });
        if (split === "lines") gsap.set(targets, { display: "block" });
        return targets;
      };

      let targets = build();

      const play = () => {
        if (revealed) return;
        revealed = true;
        gsap.to(targets, {
          yPercent: 0,
          duration,
          delay,
          ease: "expo.out",
          stagger: stagger ?? (split === "lines" ? 0.09 : split === "words" ? 0.035 : 0.018),
        });
      };

      if (waitForReady) {
        if (ready) play();
      } else {
        gsap.timeline({
          scrollTrigger: { trigger: el, start, once: true, onEnter: play },
        });
      }

      let resizeTimer = 0;
      const observer = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (el.offsetWidth === width) return;
          width = el.offsetWidth;
          targets = build();
        }, 180);
      });
      observer.observe(el);

      return () => {
        window.clearTimeout(resizeTimer);
        observer.disconnect();
        instance?.revert();
      };
    },
    { scope: ref, dependencies: [text, split, ready], revertOnUpdate: true }
  );

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      dangerouslySetInnerHTML={{ __html: escapeHtml(text) }}
    />
  );
}
