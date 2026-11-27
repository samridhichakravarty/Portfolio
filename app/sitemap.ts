import type { MetadataRoute } from "next";
import { SITE, SERVICES } from "@/lib/site";
import { PROJECTS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly") => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("", 1, "weekly"),
    page("/services", 0.9, "monthly"),
    ...SERVICES.map((service) => page(`/services/${service.slug}`, 0.8, "monthly")),
    ...PROJECTS.map((project) => page(`/work/${project.slug}`, 0.7, "monthly")),
    page("/hire", 0.9, "monthly"),
    page("/about", 0.6, "monthly"),
    page("/play", 0.5, "monthly"),
  ];
}
