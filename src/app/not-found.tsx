import type { Metadata } from "next";
import TransitionLink from "@/components/ui/transition-link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[100svh] flex-col justify-center bg-night px-gutter pb-32 pt-28">
      <div className="flex items-center justify-between mono uppercase text-fg-3">
        <span>Page not found</span>
      </div>

      {/* The line runs out */}
      <div aria-hidden className="mt-16 flex items-center">
        <span className="h-4 w-4 shrink-0 rounded-full border-[3px] border-lime bg-lime" />
        <span className="h-[3px] w-[24vw] bg-lime" />
        <span className="h-4 w-4 shrink-0 rounded-full border-[3px] border-fg-3 bg-night" />
        <span className="h-[3px] flex-1 bg-[repeating-linear-gradient(90deg,var(--border-strong)_0_12px,transparent_12px_22px)]" />
        <span className="ml-3 font-heading text-2xl text-fg-3">×</span>
      </div>

      <h1 className="mt-14 max-w-[16ch] font-heading text-[clamp(2.75rem,8vw,8rem)] leading-[0.9] tracking-[-0.04em] text-fg [font-variation-settings:'wght'_640]">
        This page doesn’t exist.
      </h1>
      <p className="mt-8 max-w-[34rem] text-lead font-light text-fg-2">
        The link may have changed. You can head home or browse my projects.
      </p>

      <div className="mt-12 flex flex-wrap gap-3">
        <TransitionLink
          href="/"
          label="Home"
          className="rounded-full bg-lime px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-void transition-colors hover:bg-fg"
        >
          Back to home
        </TransitionLink>
        <TransitionLink
          href="/#works"
          label="Work"
          className="rounded-full border border-line-3 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-fg transition-colors hover:border-transparent hover:bg-fg hover:text-void"
        >
          See the work
        </TransitionLink>
      </div>
    </main>
  );
}
