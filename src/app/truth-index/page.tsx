import type { Metadata } from "next";
import Link from "next/link";

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

const LIES = [
  {
    lie: "Your mutual fund gives 12% returns",
    truth: "After 6% inflation and 12.5% LTCG tax, your real return is ~4.1%",
    calculator: "/sip-simulator",
    tag: "SIP",
  },
  {
    lie: "FD gives you 7% returns safely",
    truth: "After tax and inflation, FD yields are often negative in real terms",
    calculator: "/fd-comparator",
    tag: "FD",
  },
  {
    lie: "Your CTC is what you take home",
    truth: "CTC minus PF, tax, and allowances can be 30-40% less than what they quote",
    calculator: "/salary-calculator",
    tag: "CTC",
  },
  {
    lie: "PPF is the best tax-saving investment",
    truth: "PPF is tax-free but 7.1% minus 6% inflation = 1.1% real return over 15 years",
    calculator: "/ppf-calculator",
    tag: "PPF",
  },
  {
    lie: "EMI is just the monthly cost",
    truth: "On a 20-year ₹50L loan at 8.5%, you pay ₹54L+ in interest — more than the principal",
    calculator: "/emi-analyzer",
    tag: "EMI",
  },
  {
    lie: "NPS gives you a great pension",
    truth: "40% annuity income is fully taxable, and inflation erodes the monthly pension every year",
    calculator: "/nps-modeler",
    tag: "NPS",
  },
  {
    lie: "Your SWP will last 25 years",
    truth: "A market crash in the first 2 years of retirement can halve your corpus longevity",
    calculator: "/swp-stress-test",
    tag: "SWP",
  },
  {
    lie: "₹1 crore retirement fund is enough",
    truth: "₹1 crore in 25 years buys what ₹23L buys today at 6% inflation",
    calculator: "/fire-matrix",
    tag: "FIRE",
  },
  {
    lie: "HRA saves you maximum tax",
    truth: "HRA exemption is the minimum of three formulas — the actual saving is often far less than expected",
    calculator: "/hra-calculator",
    tag: "HRA",
  },
  {
    lie: "New tax regime is always better",
    truth: "Old regime wins if your deductions exceed ₹3.75L. Run the numbers for your salary.",
    calculator: "/tax-sandbox",
    tag: "Tax",
  },
];

export default function TruthIndexPage() {
  return (
    <main className="min-h-screen bg-ink text-text-primary">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-xs text-text-secondary font-mono mb-8">
          <Link href="/" className="hover:text-gain transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Truth Index</span>
        </nav>

        <h1 className="text-3xl font-serif font-bold tracking-tight mb-4">
          The <span className="text-truth">Truth Index</span>
        </h1>
        <p className="text-text-secondary mb-8">
          Financial products are sold with big numbers. We show you what they actually mean after inflation, tax, and fees. Every claim links to a calculator where you can verify it yourself.
        </p>

        <div className="space-y-4">
          {LIES.map((item) => (
            <div key={item.lie} className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5 px-2 py-0.5 text-[10px] rounded-md font-mono bg-loss/20 text-loss border border-loss/40">{item.tag}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary mb-1">
                    <span className="text-loss">Lie:</span> {item.lie}
                  </p>
                  <p className="text-sm text-text-primary">
                    <span className="text-gain">Truth:</span> {item.truth}
                  </p>
                  <Link href={item.calculator} className="inline-block mt-2 text-xs font-mono text-truth hover:text-gain transition-colors">
                    Verify it →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 bg-surface rounded-lg border border-border text-center">
          <p className="text-sm text-text-secondary mb-3">
            All numbers use RBI 10-year average inflation (6%), current tax slabs, and real market data.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/methodology" className="px-4 py-2 text-sm rounded-md bg-gain/20 text-gain border border-gain/40 font-mono hover:bg-gain/30 transition-colors">
              Our Methodology
            </Link>
            <Link href="/compare" className="px-4 py-2 text-sm rounded-md bg-surface text-text-primary border border-border font-mono hover:bg-border/30 transition-colors">
              Compare Returns
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}