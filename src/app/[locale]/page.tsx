import type { Metadata } from "next";
import HomePage from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "c7xai — The Truth About Your Money",
  description:
    "Old rules of money are broken. Here are the real ones. Inflation-adjusted, tax-aware financial clarity for India.",
};

export default function LocaleHomePage() {
  return <HomePage />;
}