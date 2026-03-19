import type { MetadataRoute } from "next";
import { features } from "@/data/marketing/features";
import { solutions } from "@/data/marketing/solutions";
import { useCases } from "@/data/marketing/use-cases";

const BASE_URL = "https://claudia.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/tarifs",
    "/fonctionnalites",
    "/integrations",
    "/solutions",
    "/cas-utilisation",
  ];

  const featurePages = features.map((f) => `/fonctionnalites/${f.slug}`);
  const solutionPages = solutions.map((s) => `/solutions/${s.slug}`);
  const useCasePages = useCases.map((u) => `/cas-utilisation/${u.slug}`);

  const allPages = [...staticPages, ...featurePages, ...solutionPages, ...useCasePages];

  return allPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path.includes("/") && path.split("/").length > 2 ? 0.7 : 0.8,
  }));
}
