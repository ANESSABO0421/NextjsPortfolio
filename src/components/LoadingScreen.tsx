"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const WORDS = ["Design", "Create", "Inspire"];
const DURATION = 2700; // total loading time in ms

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // Numerical counter animation using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const currentCount = Math.floor(progress * 100);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // When counter reaches 100, trigger onComplete with 400ms delay
        const timer = setTimeout(() => {
          onComplete();
        }, 400);
        return () => clearTimeout(timer);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  // Words carousel cycling every 900ms
  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 900);

    return () => clearInterval(wordTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-between bg-bg p-6 md:p-12 overflow-hidden select-none">
      {/* Top-left Portfolio Label */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-xs text-muted uppercase tracking-[0.3em] font-medium"
      >
        Portfolio
      </motion.div>

      {/* Center Word Rotator */}
      <div className="flex items-center justify-center flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary"
          >
            {WORDS[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Row: Counter & Progress */}
      <div className="w-full flex flex-col gap-6">
        <div className="flex justify-end">
          <span className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums tracking-tighter">
            {String(count).padStart(3, "0")}
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-full h-[3px] bg-stroke/50 overflow-hidden rounded-full">
          <div
            className="accent-gradient absolute top-0 left-0 h-full w-full origin-left transition-transform duration-75 ease-out"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
