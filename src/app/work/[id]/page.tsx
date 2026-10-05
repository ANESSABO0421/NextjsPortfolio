import { notFound } from "next/navigation";
import { getProject } from "@/lib/projects";
import { site } from "@/lib/site";
import CaseStudy from "./case-study";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.listTitle,
    headline: `${project.listTitle} — ${project.category}`,
    description: project.description,
    url: `${site.url}/work/${project.id}`,
    dateCreated: project.year,
    keywords: project.stack.join(", "),
    creator: { "@type": "Person", name: site.name, url: site.url },
    ...(project.poster ? { image: `${site.url}${project.poster}` } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <CaseStudy project={project} />
    </>
  );
}
