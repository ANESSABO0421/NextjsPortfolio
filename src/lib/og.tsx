import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Shared by the generated Open Graph images. They render at build time on
// the Node.js runtime, so fonts and images are read straight from disk.

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  void: "#0a0a0b",
  surface: "#111112",
  fg: "#f3f3f3",
  muted: "#8a8a8a",
  ghost: "#4a4a4a",
  lime: "#c9fd34",
  cobalt: "#3c5df6",
};

export async function ogFonts() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [bold, extraBold, light] = await Promise.all([
    readFile(join(dir, "Syne-Bold.woff")),
    readFile(join(dir, "Syne-ExtraBold.woff")),
    readFile(join(dir, "Outfit-Light.woff")),
  ]);
  return [
    { name: "Syne", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Syne", data: extraBold, weight: 800 as const, style: "normal" as const },
    { name: "Outfit", data: light, weight: 300 as const, style: "normal" as const },
  ];
}

/** A file from /public as a data URI, for <img> inside ImageResponse. */
export async function publicImage(path: string) {
  const data = await readFile(join(process.cwd(), "public", path));
  const mime = path.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${data.toString("base64")}`;
}

interface PortraitCardOptions {
  eyebrow: string;
  /** Two display lines, set large then slightly smaller. */
  lines: [string, string];
  subtitle: string;
  detail: string;
}

/** The site card: display type on the left, the portrait standing on the right. */
export async function portraitCard({ eyebrow, lines, subtitle, detail }: PortraitCardOptions) {
  const [fonts, portrait] = await Promise.all([ogFonts(), publicImage("/anees-aboo3.png")]);
  const C = OG_COLORS;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: C.void,
          color: C.fg,
          fontFamily: "Outfit",
        }}
      >
        {/* Architectural hairlines, as in the hero */}
        {[56, 377, 698, 1019].map((left) => (
          <div
            key={left}
            style={{ position: "absolute", left, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.06)" }}
          />
        ))}

        {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element -- rendered to a PNG by ImageResponse; each route exports its alt */}
        <img
          src={portrait}
          width={452}
          height={603}
          style={{ position: "absolute", right: 64, bottom: 0, objectFit: "contain", objectPosition: "bottom" }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 56px",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 18, letterSpacing: 3, color: C.muted, textTransform: "uppercase" }}>
            {eyebrow}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {lines.map((line, i) => (
              <div
                key={line}
                style={{
                  display: "flex",
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: i === 0 ? 104 : 80,
                  lineHeight: i === 0 ? 0.86 : 0.95,
                  letterSpacing: i === 0 ? -4 : -3,
                  textTransform: "uppercase",
                }}
              >
                {line}
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", marginTop: 34, fontSize: 30, color: C.fg }}>
              <div style={{ width: 12, height: 12, borderRadius: 12, background: C.lime, marginRight: 16 }} />
              {subtitle}
            </div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 24, color: C.muted }}>{detail}</div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  );
}
