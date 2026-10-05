import { useSyncExternalStore } from "react";

// Optional UI sound, synthesised with Web Audio so there are no audio files
// to download. Off by default; the preference persists in localStorage.

const STORAGE_KEY = "anees-sound";

type AudioContextCtor = typeof AudioContext;

let context: AudioContext | null = null;
let enabled: boolean | null = null;
let noise: AudioBuffer | null = null;
const listeners = new Set<() => void>();

function readPreference() {
  if (enabled !== null) return enabled;
  try {
    enabled = window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    enabled = false;
  }
  return enabled;
}

function getContext() {
  if (typeof window === "undefined") return null;
  if (!context) {
    const Ctor: AudioContextCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

export function isSoundEnabled() {
  return typeof window === "undefined" ? false : readPreference();
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // Private mode: the toggle still works for this visit.
  }
  listeners.forEach((listener) => listener());
  if (next) playTick(1.2);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSoundEnabled() {
  return useSyncExternalStore(subscribe, isSoundEnabled, () => false);
}

/** A short, soft tick — hover and toggle feedback. */
export function playTick(pitch = 1) {
  if (!isSoundEnabled()) return;
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(2200 * pitch, t);
  osc.frequency.exponentialRampToValueAtTime(1100 * pitch, t + 0.035);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.045, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.07);
}

/** Filtered noise sweep — accompanies page transitions. */
export function playWhoosh() {
  if (!isSoundEnabled()) return;
  const ctx = getContext();
  if (!ctx) return;
  if (!noise) {
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.8), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const t = ctx.currentTime;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = noise;
  filter.type = "bandpass";
  filter.Q.value = 0.8;
  filter.frequency.setValueAtTime(320, t);
  filter.frequency.exponentialRampToValueAtTime(2800, t + 0.45);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.07, t + 0.18);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(t);
  source.stop(t + 0.7);
}
