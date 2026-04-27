import type { Metadata } from "next";
import HomePage from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "c7xai — The Truth About Your Money",
  description: "Your 12% SIP returns become 3.8%. Here's why. Inflation-adjusted, tax-aware financial clarity for India.",
  openGraph: {
    title: "c7xai — The Truth About Your Money",
    description: "Your 12% SIP returns become 3.8%. Here's why. Inflation-adjusted, tax-aware financial clarity for India.",
    url: "https://c7xai.in",
    siteName: "c7xai",
    type: "website",
  },
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomePage />;
}