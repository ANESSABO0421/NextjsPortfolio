import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anees Aboobacker - MERN Stack Developer",
    short_name: "Anees Aboobacker",
    description:
      "Portfolio of Anees Aboobacker, a Junior MERN Stack Developer building scalable web and mobile applications.",
    start_url: "/",
    display: "standalone",
    background_color: "#111112",
    theme_color: "#111112",
    icons: [
      {
        src: "/anees-aboo3.png",
        sizes: "1200x1200",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
