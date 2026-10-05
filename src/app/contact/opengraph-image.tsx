import { OG_SIZE, portraitCard } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `Contact ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return portraitCard({
    eyebrow: `${site.name} — Contact`,
    lines: ["Write to", "Anees."],
    subtitle: site.email,
    detail: `${site.phone} · ${site.region}`,
  });
}
