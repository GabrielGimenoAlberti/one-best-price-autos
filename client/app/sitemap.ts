import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/api";

const SITE = "https://onebestpriceautos.com";

// Rebuilt on request so new cars appear without a redeploy
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/inventory`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const { vehicles } = await getVehicles({ limit: "50" });
    return [
      ...pages,
      ...vehicles.map((v) => ({
        url: `${SITE}/inventory/${v._id}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return pages; // if the API is down, still serve the static pages
  }
}