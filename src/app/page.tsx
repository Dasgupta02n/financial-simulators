import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";

const CALCULATORS: readonly {
  id: string;
  name: string;
  slug: string;
  description: string;
  tag?: string;
}[] = [
  {
    id: "sip",
    name: "SIP Simulator",
    slug: "sip-simulator",
    description: "See actual returns after inflation and tax",
    tag: "Popular",
  },
  {
    id: "emi",
    name: "EMI Analyzer",
    slug: "emi-analyzer",
    description: "Compare loan EMIs with real cost",
  },
  {
    id: "tax",
    name: "Tax Sandbox",
    slug: "tax-sandbox",
    description: "Old vs New regime, side by side",
  },
  {
    id: "accum",
    name: "Accumulator",
    slug: "accumulation-calculator",
    description: "Lump sum vs SIP comparison",
  },
  {
    id: "fd",
    name: "FD Comparator",
    slug: "fd-comparator",
    description: "Real FD returns after tax and inflation",
  },
  {
    id: "swp",
    name: "SWP Stress Test",
    slug: "swp-stress-test",
    description: "Will your corpus survive a crash?",
  },
  {
    id: "fire",
    name: "FIRE Matrix",
    slug: "fire-matrix",
    description: "When can you retire?",
  },
  {
    id: "ctc",
    name: "CTC Optimizer",
    slug: "ctc-optimizer",
    description: "Maximize your in-hand salary",
  },
  {
    id: "nps",
    name: "NPS Modeler",
    slug: "nps-modeler",
    description: "Project your pension and corpus",
  },
  {
    id: "goal",
    name: "Goal Planner",
    slug: "goal-planner",
    description: "Monthly SIP needed per goal",
  },
];

export const metadata: Metadata = {
  title: "Financial Simulators — Real Returns, No Marketing",
  description:
    "Inflation-adjusted, tax-aware financial calculators for Indian investors. Zero PII, zero tracking, all math runs in your browser.",
  openGraph: {
    title: "Financial Simulators — Real Returns, No Marketing",
    description:
      "Inflation-adjusted, tax-aware financial calculators for Indian investors. Zero PII, zero tracking, all math runs in your browser.",
    url: "https://financialsimulators.in",
    siteName: "Financial Simulators",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const posts = getAllPosts().filter((p) => p.featured).slice(0, 3);

  return (
    <main className="flex-1 flex flex-col items-center">
      <header className="w-full max-w-7xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Financial Simulators
        </h1>
        <p className="text-lg text-text-secondary mt-2">
          Real returns. No marketing.
        </p>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl">
          Inflation-adjusted, tax-aware calculators for Indian investors. No
          signups, no tracking, no product pushing. All math runs in your
          browser.
        </p>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.id}
              href={`/${calc.slug}`}
              className="group flex flex-col gap-2 p-5 bg-surface rounded-lg border border-border hover:border-gain/40 hover:bg-surface/80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold group-hover:text-gain transition-colors">
                  {calc.name}
                </h2>
                {calc.tag && (
                  <span className="text-[10px] uppercase tracking-wider bg-gain/20 text-gain px-2 py-0.5 rounded font-mono">
                    {calc.tag}
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary">
                {calc.description}
              </p>
              <span className="text-xs font-mono text-gain opacity-0 group-hover:opacity-100 transition-opacity">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {posts.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono text-gain">From the Blog</h2>
            <Link
              href="/blog"
              className="text-xs font-mono text-text-secondary hover:text-gain transition-colors"
            >
              All posts →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-4 rounded-lg border border-border bg-surface/50 hover:border-gain/30 transition-colors"
              >
                <div className="text-xs uppercase font-mono text-text-secondary mb-1">
                  {post.category} · {post.readTime} min
                </div>
                <h3 className="text-sm font-semibold group-hover:text-gain transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-xs text-text-secondary border-t border-border mt-auto">
        Zero PII. Zero tracking. Computed entirely client-side. Macro defaults:
        NIFTY 12% μ / 18% σ, 6% inflation, LTCG 12.5% above ₹1.25L.
      </footer>
    </main>
  );
}