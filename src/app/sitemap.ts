import type { MetadataRoute } from "next";
import { projectIds } from "@/lib/projects";
import { site } from "@/lib/site";

const BASE_URL = site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  const workRoutes: MetadataRoute.Sitemap = projectIds.map((id) => ({
    url: `${BASE_URL}/work/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes];
}
