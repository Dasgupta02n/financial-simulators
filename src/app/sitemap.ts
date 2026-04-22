import { MetadataRoute } from "next";
import sipConfig from "@/content/calculators/sip.json";
import emiConfig from "@/content/calculators/emi.json";
import taxConfig from "@/content/calculators/tax.json";
import accumConfig from "@/content/calculators/accum.json";
import fdConfig from "@/content/calculators/fd.json";
import swpConfig from "@/content/calculators/swp.json";
import fireConfig from "@/content/calculators/fire.json";
import ctcConfig from "@/content/calculators/ctc.json";
import npsConfig from "@/content/calculators/nps.json";
import goalConfig from "@/content/calculators/goal.json";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://financialsimulators.in";

const calculatorConfigs = [
  sipConfig,
  emiConfig,
  taxConfig,
  accumConfig,
  fdConfig,
  swpConfig,
  fireConfig,
  ctcConfig,
  npsConfig,
  goalConfig,
];

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorPages: MetadataRoute.Sitemap = calculatorConfigs.map(
    (config) => ({
      url: `${BASE_URL}/${config.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...calculatorPages,
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPages,
  ];
}