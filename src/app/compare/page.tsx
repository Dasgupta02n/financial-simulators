import type { Metadata } from "next";
import Link from "next/link";
import { ShareBar } from "@/components/shared/share-bar";

export const metadata: Metadata = {
  title: "Compare Returns — SIP vs FD vs PPF vs Gold vs Real Estate | c7xai",
  description: "Side-by-side comparison of ₹10,000/month across SIP, FD, PPF, Gold, and Real Estate. Real returns after inflation and tax.",
  openGraph: {
    title: "Compare Returns — SIP vs FD vs PPF vs Gold vs Real Estate",
    description: "Side-by-side comparison showing real returns after inflation and tax.",
    url: "https://c7xai.in/compare",
  },
  alternates: { canonical: "/compare" },
};

const ASSUMPTIONS = {
  monthly: 10000,
  years: 15,
  inflation: 6,
};

interface AssetClass {
  name: string;
  returnRate: number;
  taxOnGains: number;
  nominal: number;
  postTax: number;
  real: number;
  slug: string;
}

function computeAsset(name: string, annualReturn: number, taxRate: number, slug: string): AssetClass {
  const months = ASSUMPTIONS.years * 12;
  const monthlyRate = annualReturn / 100 / 12;
  const nominal = ASSUMPTIONS.monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const invested = ASSUMPTIONS.monthly * months;
  const gains = nominal - invested;
  const tax = gains * taxRate;
  const postTax = nominal - tax;
  const inflationFactor = Math.pow(1 + ASSUMPTIONS.inflation / 100, ASSUMPTIONS.years);
  const real = postTax / inflationFactor;
  return { name, returnRate: annualReturn, taxOnGains: taxRate * 100, nominal: Math.round(nominal), postTax: Math.round(postTax), real: Math.round(real), slug };
}

const assets = [
  computeAsset("SIP (Equity)", 12, 0.125, "/sip-simulator"),
  computeAsset("PPF", 7.1, 0, "/ppf-calculator"),
  computeAsset("FD", 7, 0.30, "/fd-comparator"),
  computeAsset("Gold", 10, 0.125, "/compound-interest-calculator"),
  computeAsset("Real Estate", 8, 0.20, "/compound-interest-calculator"),
];

const maxNominal = Math.max(...assets.map((a) => a.nominal));
const maxReal = Math.max(...assets.map((a) => a.real));

function formatLakh(n: number): string {
  return `₹${(n / 100000).toFixed(1)}L`;
}

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-ink text-text-primary">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-xs text-text-secondary font-mono mb-8">
          <Link href="/" className="hover:text-gain transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Compare</span>
        </nav>

        <h1 className="text-3xl font-serif font-bold tracking-tight mb-4">
          ₹10K/Month — <span className="text-truth">Where Does It Go?</span>
        </h1>
        <p className="text-text-secondary mb-2">
          Same investment. Same duration ({ASSUMPTIONS.years} years). Different outcomes after inflation and tax.
        </p>
        <p className="text-xs text-text-muted font-mono mb-8">
          Assumptions: ₹{ASSUMPTIONS.monthly.toLocaleString("en-IN")}/month for {ASSUMPTIONS.years} years. Inflation: {ASSUMPTIONS.inflation}%. Returns are annualized and assumed constant.
        </p>

        {/* Nominal comparison */}
        <section className="mb-8">
          <h2 className="text-lg font-serif font-bold mb-4">What They Show You (Nominal)</h2>
          <div className="space-y-3">
            {assets.map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <div className="w-28 text-xs font-mono text-text-secondary shrink-0">{a.name}</div>
                <div className="flex-1 bg-border/30 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full bg-gain/60 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(a.nominal / maxNominal) * 100}%` }}
                  >
                    <span className="text-[10px] font-mono text-gain">{formatLakh(a.nominal)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real comparison */}
        <section className="mb-8">
          <h2 className="text-lg font-serif font-bold mb-4 text-truth">What You Actually Keep (Real)</h2>
          <div className="space-y-3">
            {assets.map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <div className="w-28 text-xs font-mono text-text-secondary shrink-0">{a.name}</div>
                <div className="flex-1 bg-border/30 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full bg-truth/60 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(a.real / maxReal) * 100}%`, minWidth: "2rem" }}
                  >
                    <span className="text-[10px] font-mono text-truth">{formatLakh(a.real)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Details table */}
        <section className="mb-8">
          <h2 className="text-lg font-serif font-bold mb-4">Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-text-secondary">
                  <th className="text-left py-2 pr-3">Asset</th>
                  <th className="text-right py-2 px-3">Return</th>
                  <th className="text-right py-2 px-3">Tax on Gains</th>
                  <th className="text-right py-2 px-3">Nominal</th>
                  <th className="text-right py-2 px-3">Post-Tax</th>
                  <th className="text-right py-2 pl-3">Real Value</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.name} className="border-b border-border/50 hover:bg-border/10">
                    <td className="py-2 pr-3 text-text-primary">{a.name}</td>
                    <td className="py-2 px-3 text-right">{a.returnRate}%</td>
                    <td className="py-2 px-3 text-right">{a.taxOnGains}%</td>
                    <td className="py-2 px-3 text-right">{formatLakh(a.nominal)}</td>
                    <td className="py-2 px-3 text-right">{formatLakh(a.postTax)}</td>
                    <td className="py-2 pl-3 text-right text-truth font-semibold">{formatLakh(a.real)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8 p-4 bg-loss/5 border border-loss/30 rounded-lg">
          <h2 className="text-sm font-semibold text-loss mb-2">The gap is the lie</h2>
          <p className="text-xs text-text-secondary">
            SIP shows ₹{formatLakh(assets[0].nominal)} but after tax and inflation, you keep ₹{formatLakh(assets[0].real)}.
            FD shows ₹{formatLakh(assets[2].nominal)} but you keep only ₹{formatLakh(assets[2].real)}.
            PPF is tax-free but still loses to inflation. The real column is the only one that matters.
          </p>
        </section>

        <div className="flex gap-3">
          <Link href="/methodology" className="px-4 py-2 text-sm rounded-md bg-gain/20 text-gain border border-gain/40 font-mono hover:bg-gain/30 transition-colors">
            Methodology
          </Link>
          <Link href="/truth-index" className="px-4 py-2 text-sm rounded-md bg-surface text-text-primary border border-border font-mono hover:bg-border/30 transition-colors">
            Truth Index
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8">
        <span className="text-xs text-text-muted font-mono">Share:</span>
        <ShareBar title="Compare Returns — c7xai" />
      </div>
    </main>
  );
}