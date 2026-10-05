"use client";

import { useEffect, useRef, useState } from "react";

interface PreviewVideoProps {
  src: string;
  /** A real frame from the recording — shown until (or instead of) playback. */
  poster?: string;
  /** Described for screen readers — these previews are decorative. */
  label: string;
  className?: string;
  /**
   * Drives playback explicitly (e.g. a hovered item). Left undefined, the clip
   * plays whenever it scrolls into view.
   */
  active?: boolean;
}

function shouldStayStill() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData === true
  );
}

/**
 * Project screen-recording player. The source is only attached once the clip
 * is actually needed — on activation, or when it nears the viewport — and
 * playback pauses again when it is not. Reduced-motion and Save-Data users
 * get the poster frame and nothing is downloaded.
 */
export default function PreviewVideo({ src, poster, label, className = "", active }: PreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const controlled = active !== undefined;

  useEffect(() => {
    if (!controlled) return;
    const video = videoRef.current;
    if (!video || shouldStayStill()) return;
    if (active) {
      if (video.getAttribute("src")) void video.play().catch(() => {});
      else setShouldLoad(true);
    } else {
      video.pause();
    }
  }, [active, controlled]);

  useEffect(() => {
    if (controlled) return;
    const video = videoRef.current;
    if (!video || shouldStayStill()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.getAttribute("src")) void video.play().catch(() => {});
          else setShouldLoad(true);
        } else {
          video.pause();
        }
      },
      { rootMargin: "240px 0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [controlled]);

  // The src attribute only exists after the re-render that shouldLoad
  // triggers, so playback has to start here rather than in the effects above.
  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;
    if (controlled ? active : true) void video.play().catch(() => {});
  }, [shouldLoad, active, controlled]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload={shouldLoad ? "auto" : "none"}
      className={className}
    />
  );
}
