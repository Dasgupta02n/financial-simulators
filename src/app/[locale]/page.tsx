import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";
import HomePage from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "c7xai — The Truth About Your Money",
  description:
    "Old rules of money are broken. Here are the real ones. Inflation-adjusted, tax-aware financial clarity for India.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = getAllPosts().filter((p) => p.featured).slice(0, 3);
  return <HomePage posts={posts} />;
}