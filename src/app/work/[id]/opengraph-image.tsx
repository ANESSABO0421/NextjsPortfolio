import { ImageResponse } from "next/og";
import { OG_COLORS as C, OG_SIZE, ogFonts, publicImage } from "@/lib/og";
import { getProject, projectIds } from "@/lib/projects";
import { pad2, site } from "@/lib/site";

export const alt = `Case study by ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

const PANEL = 560;

// Rendered once per case study at build time rather than on each request.
export function generateStaticParams() {
  return projectIds.map((id) => ({ id }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  const fonts = await ogFonts();
  if (!project) return new ImageResponse(<div style={{ width: "100%", height: "100%", background: C.void }} />, size);

  const poster = project.poster ? await publicImage(project.poster) : null;
  const longest = Math.max(...project.title.split(" ").map((word) => word.length));
  // Syne Bold runs ≈0.86em per capital; fit the longest word to the panel.
  const titleSize = Math.min(112, Math.floor((PANEL - 112) / (longest * 0.86)));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.void, color: C.fg, fontFamily: "Outfit" }}>
        <div
          style={{
            width: PANEL,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 56px",
          }}
        >
          <div style={{ display: "flex", fontSize: 17, letterSpacing: 3, color: C.muted, textTransform: "uppercase" }}>
            Case {pad2(project.index)} / {pad2(project.total)}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {project.title.split(" ").map((word) => (
              <div
                key={word}
                style={{
                  display: "flex",
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: titleSize,
                  lineHeight: 0.9,
                  letterSpacing: -titleSize * 0.04,
                }}
              >
                {word}
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", marginTop: 26, fontSize: 22, color: C.muted }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: project.accent, marginRight: 14 }} />
              {project.category}
            </div>
            <div style={{ display: "flex", marginTop: 20, fontSize: 26, lineHeight: 1.3, color: C.fg }}>
              {project.tagline}
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 17, letterSpacing: 3, color: C.ghost, textTransform: "uppercase" }}>
            {site.name}
          </div>
        </div>

        <div style={{ flex: 1, height: "100%", display: "flex", position: "relative", background: C.surface, overflow: "hidden" }}>
          {poster ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- ImageResponse renders to a PNG; alt is exported above
            <img
              src={poster}
              width={OG_SIZE.width - PANEL}
              height={OG_SIZE.height}
              style={{ objectFit: "cover", objectPosition: project.device === "phone" ? "top" : "left top" }}
            />
          ) : (
            <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  display: "flex",
                  width: 220,
                  height: 220,
                  borderRadius: 220,
                  border: `2px solid ${C.lime}`,
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Syne",
                  fontWeight: 800,
                  fontSize: 72,
                  color: C.fg,
                }}
              >
                io
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
