import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.name,
    description: site.shortSummary,
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f10",
    theme_color: "#0f0f10",
    icons: [
      {
        src: "/anees-aboo3.png",
        sizes: "1792x2390",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
