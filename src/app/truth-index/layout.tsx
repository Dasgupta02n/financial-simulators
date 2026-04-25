import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Truth Index — Financial Lies Exposed | c7xai",
  description: "The most common financial lies told to Indians, and the real numbers behind them. Every claim backed by data, not marketing.",
  openGraph: {
    title: "Truth Index — Financial Lies Exposed",
    description: "The most common financial lies told to Indians, and the real numbers behind them.",
    url: "https://c7xai.in/truth-index",
  },
  alternates: { canonical: "/truth-index" },
};

export default function TruthIndexLayout({ children }: { children: React.ReactNode }) {
  return children;
}