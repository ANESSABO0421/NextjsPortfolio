"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/stores";

type CursorState = "default" | "link" | "view" | "drag" | "text" | "hide";

interface Shape {
  width: number;
  height: number;
  radius: number;
  fill: string;
  border: string;
}

const INTERACTIVE = "[data-cursor], a, button, [role='button'], input, textarea, select, summary, label[for]";
const TEXT_ENTRY = "input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

/**
 * Context-aware cursor. A lagging ring morphs between shapes (circle for
 * links, a filled lime disc for "view", a pill for "drag", an I-beam bar
 * over text fields) while a crisp dot and a short trail follow the pointer.
 * Everything is driven by GSAP quickTo setters — no React state per move.
 */
export default function CustomCursor() {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = finePointer && !reduceMotion;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const ring = root.querySelector<HTMLElement>("[data-ring]")!;
    const label = root.querySelector<HTMLElement>("[data-label]")!;
    const dot = root.querySelector<HTMLElement>("[data-dot]")!;
    const trail = Array.from(root.querySelectorAll<HTMLElement>("[data-trail]"));
    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    gsap.set([ring, dot, ...trail], { xPercent: -50, yPercent: -50, x: -200, y: -200 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "expo.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "expo.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const trailTo = trail.map((el, i) => ({
      x: gsap.quickTo(el, "x", { duration: 0.28 + i * 0.16, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.28 + i * 0.16, ease: "power3.out" }),
    }));

    let state: CursorState = "default";
    let light = false;
    let labelText = "";
    let visible = false;
    let breathing: gsap.core.Tween | null = null;
    let idleTimer = 0;

    const ink = () => (light ? "#0f0f10" : "#f3f3f3");

    const shapeFor = (next: CursorState): Shape => {
      switch (next) {
        case "link":
          return { width: 68, height: 68, radius: 34, fill: light ? "rgba(15,15,16,0.06)" : "rgba(243,243,243,0.08)", border: ink() };
        case "view":
          return { width: 108, height: 108, radius: 54, fill: "#c9fd34", border: "#c9fd34" };
        case "drag":
          return { width: 128, height: 64, radius: 32, fill: light ? "#0f0f10" : "#f3f3f3", border: light ? "#0f0f10" : "#f3f3f3" };
        case "text":
          return { width: 3, height: 30, radius: 2, fill: ink(), border: ink() };
        default:
          return { width: 42, height: 42, radius: 21, fill: "rgba(0,0,0,0)", border: ink() };
      }
    };

    const applyState = (next: CursorState, text: string, nextLight: boolean) => {
      if (next === state && text === labelText && nextLight === light) return;
      state = next;
      labelText = text;
      light = nextLight;

      const shape = shapeFor(next);
      gsap.to(ring, {
        width: shape.width,
        height: shape.height,
        borderRadius: shape.radius,
        backgroundColor: shape.fill,
        borderColor: shape.border,
        opacity: next === "hide" ? 0 : 1,
        duration: 0.5,
        ease: "expo.out",
        overwrite: "auto",
      });

      label.textContent = text;
      label.style.color = next === "drag" && !light ? "#0a0a0b" : next === "drag" ? "#f3f3f3" : "#0a0a0b";
      gsap.to(label, { opacity: text ? 1 : 0, scale: text ? 1 : 0.6, duration: 0.35, ease: "expo.out", overwrite: "auto" });

      const quiet = next === "view" || next === "drag" || next === "text" || next === "hide";
      gsap.to(dot, { opacity: quiet ? 0 : 1, backgroundColor: ink(), duration: 0.25, overwrite: "auto" });
      gsap.to(trail, { opacity: quiet ? 0 : (i: number) => 0.42 - i * 0.12, backgroundColor: ink(), duration: 0.25, overwrite: "auto" });
    };

    const resolveTarget = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      const nextLight = !!el?.closest("[data-theme='light']");
      const interactive = el?.closest<HTMLElement>(INTERACTIVE);
      if (!interactive) return applyState("default", "", nextLight);

      const declared = interactive.dataset.cursor as CursorState | undefined;
      if (declared) {
        const fallback = declared === "view" ? "View" : declared === "drag" ? "Drag" : "";
        return applyState(declared, interactive.dataset.cursorLabel ?? fallback, nextLight);
      }
      if (interactive.matches(TEXT_ENTRY)) return applyState("text", "", nextLight);
      applyState("link", "", nextLight);
    };

    const stopBreathing = () => {
      breathing?.kill();
      breathing = null;
      gsap.to(ring, { scale: 1, duration: 0.3, overwrite: "auto" });
    };

    const startBreathing = () => {
      if (state !== "default") return;
      breathing = gsap.to(ring, { scale: 1.18, duration: 1.4, ease: "sine.inOut", repeat: -1, yoyo: true });
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const { clientX: x, clientY: y } = event;
      if (!visible) {
        visible = true;
        gsap.set([ring, dot], { x, y });
        trail.forEach((el) => gsap.set(el, { x, y }));
        gsap.to(root, { opacity: 1, duration: 0.3 });
      }
      ringX(x);
      ringY(y);
      dotX(x);
      dotY(y);
      trailTo.forEach((t) => {
        t.x(x);
        t.y(y);
      });

      if (breathing) stopBreathing();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(startBreathing, 2400);
    };

    const onOver = (event: PointerEvent) => resolveTarget(event.target);
    const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
    const onLeave = () => {
      visible = false;
      gsap.to(root, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.clearTimeout(idleTimer);
      breathing?.kill();
      gsap.killTweensOf([ring, dot, label, root, ...trail]);
      html.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-0 z-[100] opacity-0">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          data-trail
          className="absolute left-0 top-0 rounded-full bg-fg will-change-transform"
          style={{ width: 5 - i, height: 5 - i, opacity: 0.42 - i * 0.12 }}
        />
      ))}
      <div
        data-ring
        className="absolute left-0 top-0 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-fg will-change-transform"
      >
        <span
          data-label
          className="whitespace-nowrap font-heading text-[11px] font-bold uppercase tracking-[0.18em] opacity-0"
        />
      </div>
      <span data-dot className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-fg will-change-transform" />
    </div>
  );
}
