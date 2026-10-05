import Image from "next/image";
import PreviewVideo from "@/components/ui/preview-video";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  /** Screen recording that plays inside the handset. */
  video?: string;
  /** A real frame from the recording — shown before playback, or on its own. */
  poster?: string;
  /** Describes what's on screen, for assistive tech. */
  label: string;
  className?: string;
}

/**
 * A handset drawn entirely in CSS around a screen recording: graphite frame,
 * side keys and a punch-hole camera (the recordings come from an Android
 * phone, so its own status and gesture bars are already on screen). Stays
 * crisp at any size and adds no image weight.
 */
export default function PhoneMockup({ video, poster, label, className }: PhoneMockupProps) {
  return (
    <div className={cn("relative aspect-[9/19.5] w-[clamp(14.5rem,22vw,19rem)]", className)}>
      <span aria-hidden className="absolute -left-[3px] top-[21%] h-[9%] w-[3px] rounded-l-sm bg-[#2c2c30]" />
      <span aria-hidden className="absolute -left-[3px] top-[33%] h-[9%] w-[3px] rounded-l-sm bg-[#2c2c30]" />
      <span aria-hidden className="absolute -right-[3px] top-[27%] h-[13%] w-[3px] rounded-r-sm bg-[#2c2c30]" />

      <div className="relative h-full w-full rounded-[clamp(2.1rem,3.3vw,2.9rem)] bg-[#0c0c0e] p-[3%] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.75),inset_0_0_0_1px_rgba(255,255,255,0.09)]">
        <div className="relative h-full w-full overflow-hidden rounded-[clamp(1.8rem,2.85vw,2.5rem)] bg-black">
          {video ? (
            <PreviewVideo src={video} poster={poster} label={label} className="absolute inset-0 h-full w-full object-cover" />
          ) : poster ? (
            <Image src={poster} alt={label} fill sizes="19rem" className="object-cover" />
          ) : null}
          <span
            aria-hidden
            className="absolute left-1/2 top-[1.9%] z-10 aspect-square w-[5.2%] -translate-x-1/2 rounded-full bg-black shadow-[0_0_0_1.5px_rgba(255,255,255,0.05)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
          />
        </div>
      </div>
    </div>
  );
}
