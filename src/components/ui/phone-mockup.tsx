"use client";

import React from "react";
import { Mic, TrendingUp, TrendingDown, Home, PieChart, Plus, User } from "lucide-react";

const transactions = [
  { label: "Groceries", note: "Added by voice", amount: "-₹1,240", tone: "out" },
  { label: "Salary", note: "Monthly credit", amount: "+₹42,000", tone: "in" },
  { label: "Fuel", note: "Auto-categorised", amount: "-₹2,100", tone: "out" },
  { label: "Freelance", note: "SkiaFlow invoice", amount: "+₹18,500", tone: "in" },
  { label: "Subscriptions", note: "Recurring", amount: "-₹899", tone: "out" },
  { label: "Dining", note: "Added by voice", amount: "-₹640", tone: "out" },
] as const;

interface PhoneMockupProps {
  appName: string;
  /** Short line under the app name — usually the project category. */
  tagline: string;
  /** Optional screen-recording (e.g. /video/Spendova.mp4) that plays inside the handset instead of the hand-rendered UI. */
  videoSrc?: string;
}

/**
 * Hand-rendered handset for mobile case studies. When a `videoSrc` is
 * provided, an actual screen recording of the app plays behind the hardware
 * chrome (dynamic island, home indicator). Otherwise the screen falls back to
 * a hand-drawn mirror of the Spendova expense-tracker UI (balance, voice
 * entry, transaction feed), so it stays crisp at any viewport size.
 */
export default function PhoneMockup({ appName, tagline, videoSrc }: PhoneMockupProps) {
  return (
    <div className="device-mockup-container relative flex items-center justify-center z-10">
      <style>{`
        @keyframes phoneFeedScroll {
          0%, 12% { transform: translateY(0); }
          52%, 64% { transform: translateY(-42%); }
          96%, 100% { transform: translateY(0); }
        }
        @keyframes phoneMicPulse {
          0% { transform: scale(1); opacity: 0.55; }
          70%, 100% { transform: scale(1.9); opacity: 0; }
        }
        .animate-phone-feed { animation: phoneFeedScroll 16s ease-in-out infinite; }
        .animate-phone-mic { animation: phoneMicPulse 2.6s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-phone-feed, .animate-phone-mic { animation: none; }
        }
      `}</style>

      {/* Handset shell */}
      <div className="relative w-[260px] sm:w-[300px] aspect-[9/19.5] rounded-[3rem] bg-zinc-900 p-[10px] shadow-[0_30px_70px_rgba(0,0,0,0.28)] ring-1 ring-black/10">
        {/* Side buttons */}
        <span className="absolute -left-[3px] top-[22%] h-12 w-[3px] rounded-l bg-zinc-800" />
        <span className="absolute -left-[3px] top-[34%] h-12 w-[3px] rounded-l bg-zinc-800" />
        <span className="absolute -right-[3px] top-[26%] h-20 w-[3px] rounded-r bg-zinc-800" />

        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-[#0c0c0d] text-white flex flex-col">
          {/* Dynamic island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-[86px] rounded-full bg-black z-30" />

          {videoSrc ? (
            <>
              {/* App screen recording fills the handset behind the hardware chrome */}
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Home indicator, kept above the video */}
              <div className="absolute bottom-1.5 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full bg-white/70" />
            </>
          ) : (
          <>
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[9px] font-semibold text-zinc-400 z-20">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-500" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-500" />
              <span className="inline-block h-1.5 w-4 rounded-sm border border-zinc-600" />
            </span>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between px-5 pt-5">
            <div className="flex flex-col">
              <span className="font-heading text-base font-bold tracking-tight">
                {appName}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-500">
                {tagline}
              </span>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-[#c9fd34]">
              <User className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Balance card */}
          <div className="mx-5 mt-4 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#c9fd34]/15 via-white/[0.03] to-transparent p-4">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500">
              Total Balance
            </span>
            <p className="font-heading text-2xl font-bold tracking-tight text-white">
              ₹84,320
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-[#c9fd34]/15 px-2 py-1 text-[8px] font-semibold text-[#c9fd34]">
                <TrendingUp className="h-2.5 w-2.5" /> ₹60,500 in
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-1 text-[8px] font-semibold text-zinc-400">
                <TrendingDown className="h-2.5 w-2.5" /> ₹4,879 out
              </span>
            </div>
          </div>

          {/* Voice entry */}
          <div className="mx-5 mt-4 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c9fd34] text-black">
              <span className="animate-phone-mic absolute inset-0 rounded-full bg-[#c9fd34]" />
              <Mic className="relative h-4 w-4" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold text-white">
                &ldquo;Add 240 rupees for coffee&rdquo;
              </span>
              <span className="text-[8px] text-zinc-500">
                Listening — speech to transaction
              </span>
            </span>
          </div>

          {/* Transaction feed */}
          <div className="mt-4 flex-1 overflow-hidden px-5">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500">
              Recent Activity
            </span>
            <div className="animate-phone-feed mt-2 flex flex-col gap-2">
              {[...transactions, ...transactions].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5"
                >
                  <span className="flex flex-col leading-tight">
                    <span className="text-[10px] font-semibold text-zinc-200">
                      {item.label}
                    </span>
                    <span className="text-[8px] text-zinc-500">{item.note}</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      item.tone === "in" ? "text-[#c9fd34]" : "text-zinc-400"
                    }`}
                  >
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fade so the looping feed does not hard-cut at the tab bar */}
          <div className="pointer-events-none absolute bottom-14 left-0 h-16 w-full bg-gradient-to-t from-[#0c0c0d] to-transparent" />

          {/* Tab bar */}
          <div className="relative z-20 mx-4 mb-4 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-[#141416] px-5 py-3">
            <Home className="h-4 w-4 text-[#c9fd34]" />
            <PieChart className="h-4 w-4 text-zinc-600" />
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c9fd34] text-black">
              <Plus className="h-3.5 w-3.5" />
            </span>
            <User className="h-4 w-4 text-zinc-600" />
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-zinc-700" />
          </>
          )}
        </div>
      </div>
    </div>
  );
}
