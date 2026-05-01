import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "c7xai — The Truth About Your Money",
  description: "Old rules of money are broken. Here are the real ones. Inflation-adjusted, tax-aware financial clarity for India.",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return <>{children}</>;
}