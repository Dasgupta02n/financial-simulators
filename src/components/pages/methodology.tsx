import Link from "next/link";
import { ShareBar } from "@/components/shared/share-bar";

const ASSUMPTIONS = [
  { label: "Inflation Rate", value: "6%", source: "RBI 10-year average (2014–2024)" },
  { label: "LTCG Tax Rate", value: "12.5%", source: "Finance Act 2024 (above ₹1.25L exemption)" },
  { label: "Tax Regime", value: "FY 2025-26", source: "Income Tax Act, new regime default slabs" },
  { label: "PPF Rate", value: "7.1%", source: "Govt of India, quarterly revision" },
  { label: "EPF Rate", value: "8.25%", source: "EPFO, revised annually" },
  { label: "NPS Equity Return", value: "12%", source: "NIFTY 50 long-term CAGR (20-year)" },
  { label: "NPS Debt Return", value: "7%", source: "10-yr Govt bond average" },
  { label: "FD Rate", value: "7%", source: "SBI/HDFC 1-yr FD, indicative" },
];

const FORMULAS = [
  {
    name: "SIP / Step-Up SIP",
    formula: "FV = PMT × [(1+r)^n - 1] / r",
    notes: "Future value of monthly SIP at expected return rate. Step-up increases PMT yearly.",
  },
  {
    name: "Compound Interest",
    formula: "A = P(1 + r/n)^(nt)",
    notes: "Standard compound interest with configurable compounding frequency.",
  },
  {
    name: "FD",
    formula: "Maturity = Principal × (1 + r × t) for simple FD; taxed at slab rate",
    notes: "Post-tax maturity = maturity - tax on interest. Real value = post-tax / (1 + inflation)^t.",
  },
  {
    name: "SWP (Systematic Withdrawal Plan)",
    formula: "Recursive monthly: corpus × (1 + r/12) - withdrawal",
    notes: "Inflation-adjusted withdrawal increases yearly. Stress test injects a crash scenario.",
  },
  {
    name: "FIRE",
    formula: "FIRE Number = 25 × annual expenses at retirement",
    notes: "Corpus projected with pre/post-retirement returns and inflation. Glide path shifts equity allocation.",
  },
  {
    name: "EMI",
    formula: "EMI = P × r × (1+r)^n / [(1+r)^n - 1]",
    notes: "Amortization splits each payment into interest vs principal. Crossover = month when SIP corpus exceeds prepayment savings.",
  },
  {
    name: "Tax (Old vs New Regime)",
    formula: "Tax = Σ(slab income × slab rate) + cess",
    notes: "Both regimes computed side-by-side. Old allows 80C, 80D, HRA, NPS. New has wider slabs but fewer deductions.",
  },
  {
    name: "Real Value Adjustment",
    formula: "Real Value = Nominal / (1 + inflation)^years",
    notes: "All calculators adjust nominal values to today's purchasing power using this formula.",
  },
];

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-ink text-text-primary">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-xs text-text-secondary font-mono mb-8">
          <Link href="/" className="hover:text-gain transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Methodology</span>
        </nav>

        <h1 className="text-3xl font-serif font-bold tracking-tight mb-4">
          How We Calculate <span className="text-truth">the Truth</span>
        </h1>
        <p className="text-text-secondary mb-8">
          Every number on c7xai is computed in your browser. No data is sent anywhere.
          Our assumptions are conservative, transparent, and based on official sources.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-serif font-bold mb-4 text-truth">Core Assumptions</h2>
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-border bg-border/30">
                  <th className="text-left p-3 text-text-secondary">Assumption</th>
                  <th className="text-left p-3 text-text-secondary">Value</th>
                  <th className="text-left p-3 text-text-secondary">Source</th>
                </tr>
              </thead>
              <tbody>
                {ASSUMPTIONS.map((a) => (
                  <tr key={a.label} className="border-b border-border/50 hover:bg-border/10">
                    <td className="p-3 text-text-primary">{a.label}</td>
                    <td className="p-3 text-gain font-semibold">{a.value}</td>
                    <td className="p-3 text-text-secondary text-xs">{a.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-muted mt-2">
            All calculators let you override these defaults with your own values. The above are starting points.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-serif font-bold mb-4 text-truth">Formulas Used</h2>
          <div className="space-y-4">
            {FORMULAS.map((f) => (
              <div key={f.name} className="bg-surface rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-1">{f.name}</h3>
                <code className="text-xs font-mono text-gain bg-border/30 px-2 py-1 rounded">{f.formula}</code>
                <p className="text-xs text-text-secondary mt-2">{f.notes}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-serif font-bold mb-4 text-truth">What We Don&apos;t Do</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2"><span className="text-loss font-bold">✕</span> We don&apos;t sell financial products or earn commissions.</li>
            <li className="flex gap-2"><span className="text-loss font-bold">✕</span> We don&apos;t store your data — all calculations run in your browser.</li>
            <li className="flex gap-2"><span className="text-loss font-bold">✕</span> We don&apos;t use inflated return estimates to make products look better.</li>
            <li className="flex gap-2"><span className="text-loss font-bold">✕</span> We don&apos;t ignore inflation, tax, or fees in our projections.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-serif font-bold mb-4 text-truth">Limitations</h2>
          <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5">
            <li>Market returns are assumed constant — actual returns vary year to year.</li>
            <li>Tax calculations use current-year slabs; future changes are not predicted.</li>
            <li>Inflation is assumed uniform — in reality, education and healthcare inflate faster.</li>
            <li>SWP stress test uses a single crash scenario — real crashes may be deeper or shallower.</li>
            <li>PPF and EPF interest rates are set by the government and can change quarterly.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-serif font-bold mb-4 text-truth">Open Source</h2>
          <p className="text-sm text-text-secondary mb-4">
            All our math runs in your browser. Zero data sent anywhere. The source code for every calculator is
            open and auditable on GitHub.
          </p>
          <div className="flex gap-3">
            <Link href="/" className="px-4 py-2 text-sm rounded-md bg-gain/20 text-gain border border-gain/40 font-mono hover:bg-gain/30 transition-colors">
              Try the calculators
            </Link>
            <Link href="/truth-index" className="px-4 py-2 text-sm rounded-md bg-surface text-text-primary border border-border font-mono hover:bg-border/30 transition-colors">
              Truth Index
            </Link>
          </div>
        </section>
      </div>

      <div className="flex items-center gap-2 mt-8">
        <span className="text-xs text-text-muted font-mono">Share:</span>
        <ShareBar title="Methodology — c7xai" />
      </div>
    </main>
  );
}