import { OG_SIZE, portraitCard } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return portraitCard({
    eyebrow: `${site.name} — Portfolio ’26`,
    lines: ["Anees", "Aboobacker"],
    subtitle: site.role,
    detail: `ERP · HRMS · Real-time platforms — ${site.region}`,
  });
}
