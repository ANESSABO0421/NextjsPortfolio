import { cn } from "@/lib/utils";

interface LaptopMockupProps {
  /** Whatever the screen shows — usually a screen recording. */
  children: React.ReactNode;
  className?: string;
}

/**
 * A notched laptop drawn in CSS: graphite lid with a hairline bezel, a 16:10
 * panel, and a base that overhangs the lid with a thumb scoop at the front.
 */
export default function LaptopMockup({ children, className }: LaptopMockupProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative rounded-t-[clamp(0.8rem,1.5vw,1.5rem)] rounded-b-[0.35rem] bg-[#0d0d0f] p-[1.5%] pb-[2.2%] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.3rem] bg-black">
          {children}
          <span
            aria-hidden
            className="absolute left-1/2 top-0 z-10 flex h-[3.4%] w-[10.5%] -translate-x-1/2 items-center justify-center rounded-b-[0.5rem] bg-[#0d0d0f]"
          >
            <span className="aspect-square h-[34%] rounded-full bg-[#1f2633]" />
          </span>
        </div>
      </div>
      <div
        aria-hidden
        className="relative -mx-[6.5%] h-[clamp(0.55rem,1.25vw,1.1rem)] rounded-b-[clamp(0.6rem,1.2vw,1.15rem)] rounded-t-[0.2rem] bg-[linear-gradient(180deg,#46464c_0%,#232327_38%,#111113_100%)] shadow-[0_34px_60px_-24px_rgba(0,0,0,0.8)]"
      >
        <span className="absolute left-1/2 top-0 h-[40%] w-[14%] -translate-x-1/2 rounded-b-[0.45rem] bg-[#141416]" />
      </div>
    </div>
  );
}
