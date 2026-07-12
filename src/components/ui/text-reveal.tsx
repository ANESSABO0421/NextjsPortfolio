"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

interface TextRevealProps {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  animationType?: "lines" | "words" | "chars";
  delay?: number;
}

export default function TextReveal({
  text,
  className = "",
  tag = "p",
  animationType = "lines",
  delay = 0,
}: TextRevealProps) {
  const textRef = useRef<any>(null);
  const Tag = tag;

  useGSAP(
    () => {
      const element = textRef.current;
      if (!element) return;

      // 1. Split text into spans using SplitType
      const split = new SplitType(element, {
        types: animationType,
        tagName: "span",
      });

      // Get target nodes
      const targets =
        animationType === "lines"
          ? split.lines
          : animationType === "words"
          ? split.words
          : split.chars;

      if (!targets || targets.length === 0) return;

      // 2. Wrap targets in overflow-hidden wrappers for clip mask reveal
      targets.forEach((target) => {
        const parent = target.parentNode;
        if (!parent) return;

        const wrapper = document.createElement("span");
        wrapper.className = "inline-block overflow-hidden vertical-align-bottom";
        wrapper.style.verticalAlign = "bottom";

        target.style.display = "inline-block";
        // Start in clip-masked position
        target.style.transform = "translate3d(0, 100%, 0)";

        parent.replaceChild(wrapper, target);
        wrapper.appendChild(target);
      });

      // 3. Animate lines/words/chars up to baseline
      gsap.to(targets, {
        y: "0%",
        duration: 0.8,
        delay,
        stagger: animationType === "lines" ? 0.08 : 0.02,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      // 4. Return cleanup to revert DOM changes on React re-render or unmount
      return () => {
        split.revert();
      };
    },
    { scope: textRef, dependencies: [text, animationType, delay] }
  );

  return (
    <Tag ref={textRef} className={`${className} opacity-100`}>
      {text}
    </Tag>
  );
}
