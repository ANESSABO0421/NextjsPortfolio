import { cn } from "@/lib/utils";

interface RollingTextProps {
  text: string;
  className?: string;
}

/**
 * Per-character roll: on hover of the nearest `.roll-trigger` ancestor each
 * character slides up and an identical twin rises in behind it, staggered
 * left to right. Pure CSS (see globals.css), so it costs nothing at rest.
 */
export default function RollingText({ text, className }: RollingTextProps) {
  return (
    <span className={cn("roll", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="roll">
        {Array.from(text).map((char, i) => (
          <span key={i} className="roll-char" style={{ "--i": i } as React.CSSProperties}>
            <span>{char === " " ? " " : char}</span>
            <span>{char === " " ? " " : char}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
