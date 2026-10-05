import type { Metadata } from "next";
import { getProject, projectIds } from "@/lib/projects";

// Every case study is known at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projectIds.map((id) => ({ id }));
}

// Social images come from the colocated opengraph-image.tsx.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return {};

  const title = `${project.listTitle} — ${project.category}`;
  const description = project.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/work/${id}`,
    },
    openGraph: {
      type: "article",
      url: `/work/${id}`,
      siteName: "Anees Aboobacker",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
