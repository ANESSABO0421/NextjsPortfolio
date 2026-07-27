import type { Metadata } from "next";
import { projectDetails, projectIds } from "@/lib/projects";

export function generateStaticParams() {
  return projectIds.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projectDetails[id] || projectDetails["devpulse"];

  const title = `${project.title} — ${project.category}`;
  const description = project.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/work/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/work/${id}`,
      images: [
        {
          url: project.src,
          width: 1024,
          height: 1024,
          alt: project.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.src],
    },
  };
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
