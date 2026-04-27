import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import HomePage from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "c7xai — The Truth About Your Money",
  description:
    "Old rules of money are broken. Here are the real ones. Inflation-adjusted, tax-aware financial clarity for India.",
};

export default async function LocaleHomePage() {
  const posts = getAllPosts().filter((p) => p.featured).slice(0, 3);
  return <HomePage posts={posts} />;
}