"use client";

import { useIstClock } from "@/lib/stores";

interface LocalTimeProps {
  /** Hide the seconds — for tight spaces like the header. */
  short?: boolean;
  className?: string;
}

/** Live India Standard Time. Renders a neutral placeholder on the server. */
export default function LocalTime({ short = false, className }: LocalTimeProps) {
  const time = useIstClock();
  const value = time ? (short ? time.slice(0, 5) : time) : short ? "--:--" : "--:--:--";
  return (
    <time className={className} suppressHydrationWarning>
      {value}
    </time>
  );
}
