"use client";

import React, { useEffect, useRef, useState } from "react";

interface PreviewVideoProps {
  src: string;
  /** Described for screen readers — these previews are decorative. */
  label: string;
  className?: string;
  /**
   * Drives playback explicitly (e.g. the hovered row in the works list).
   * Left undefined, the clip plays whenever it scrolls into view.
   */
  active?: boolean;
}

/**
 * Project screen-recording player. The captures are tens of megabytes, so the
 * source is only attached once the clip is actually needed — on hover, or when
 * it scrolls into view — and playback pauses again when it is not. Once loaded
 * the source stays put so re-hovering resumes instantly.
 */
export default function PreviewVideo({ src, label, className = "", active }: PreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const isHoverDriven = active !== undefined;

  // Hover-driven: the parent tells us when this clip is the visible one.
  useEffect(() => {
    if (!isHoverDriven) return;
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      setShouldLoad(true);
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, isHoverDriven]);

  // Viewport-driven: play while on screen, pause once it leaves.
  useEffect(() => {
    if (isHoverDriven) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isHoverDriven]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      aria-label={label}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}
