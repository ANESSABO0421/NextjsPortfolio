import { useCallback, useSyncExternalStore } from "react";
import type Lenis from "lenis";

// Small external stores shared across client components. They exist so
// browser-only state (the Lenis instance, intro progress, media queries, the
// IST clock) can be read during render without setState-in-effect cascades
// or hydration mismatches — every store has an explicit server snapshot.

type Listener = () => void;

function createSignal<T>(initial: T) {
  let value = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => value,
    set(next: T) {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/* ── Intro (preloader) ─────────────────────────────────────────────── */

const intro = createSignal(false);

export const markIntroDone = () => intro.set(true);
export const isIntroDone = () => intro.get();

/** Runs `callback` once the intro has finished (immediately if it already has). */
export function onIntroDone(callback: () => void) {
  if (intro.get()) {
    callback();
    return () => {};
  }
  const unsubscribe = intro.subscribe(() => {
    if (!intro.get()) return;
    unsubscribe();
    callback();
  });
  return unsubscribe;
}

export function useIntroDone() {
  return useSyncExternalStore(intro.subscribe, intro.get, () => false);
}

/* ── Page reveal (route transitions) ───────────────────────────────── */

// False while the transition curtain covers the screen, so a freshly mounted
// page can hold its entrance animation until the curtain starts to lift.
const revealed = createSignal(true);

export const setPageRevealed = (value: boolean) => revealed.set(value);

export function usePageRevealed() {
  return useSyncExternalStore(revealed.subscribe, revealed.get, () => true);
}

/* ── Lenis ─────────────────────────────────────────────────────────── */

const lenis = createSignal<Lenis | null>(null);

export const setLenis = (instance: Lenis | null) => lenis.set(instance);
export const getLenis = () => lenis.get();

export function useLenis() {
  return useSyncExternalStore(lenis.subscribe, lenis.get, () => null);
}

/* ── Media queries ─────────────────────────────────────────────────── */

export function useMediaQuery(query: string, serverFallback = false) {
  const subscribe = useCallback(
    (listener: Listener) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", listener);
      return () => mql.removeEventListener("change", listener);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

/* ── IST clock ─────────────────────────────────────────────────────── */

const clockFormatter =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      })
    : null;

const clock = createSignal("");
let clockTimer: number | undefined;
let clockSubscribers = 0;

function tickClock() {
  clock.set(clockFormatter ? clockFormatter.format(new Date()) : "");
}

function subscribeClock(listener: Listener) {
  const unsubscribe = clock.subscribe(listener);
  clockSubscribers += 1;
  if (clockSubscribers === 1) {
    tickClock();
    clockTimer = window.setInterval(tickClock, 1000);
  }
  return () => {
    unsubscribe();
    clockSubscribers -= 1;
    if (clockSubscribers === 0) window.clearInterval(clockTimer);
  };
}

/** "HH:MM:SS" in India Standard Time, or "" during server render. */
export function useIstClock() {
  return useSyncExternalStore(subscribeClock, clock.get, () => "");
}
