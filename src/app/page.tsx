import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { CalcCard } from "@/components/home/calc-card";

const CALCULATOR_QUESTIONS: readonly {
  question: string;
  calculators: readonly { id: string; name: string; slug: string; description: string; tag?: string }[];
}[] = [
  {
    question: "Will my money last?",
    calculators: [
      { id: "swp", name: "SWP Stress Test", slug: "swp-stress-test", description: "Will your corpus survive a market crash? Simulate worst-case withdrawals." },
      { id: "fire", name: "FIRE Matrix", slug: "fire-matrix", description: "When can you actually retire? Month-by-month freedom timeline." },
    ],
  },
  {
    question: "How much do I actually keep?",
    calculators: [
      { id: "tax", name: "Tax Sandbox", slug: "tax-sandbox", description: "Old vs New regime side by side. Find which one actually saves you more." },
      { id: "hra", name: "HRA Calculator", slug: "hra-calculator", description: "How much HRA is tax-free? Section 10(13A) exemption.", tag: "New" },
      { id: "ctc", name: "CTC Optimizer", slug: "ctc-optimizer", description: "Maximize in-hand salary. See where every rupee of your CTC goes." },
      { id: "salary", name: "Salary Calculator", slug: "salary-calculator", description: "CTC to in-hand. Full breakup — basic, HRA, PF, tax — old vs new." },
    ],
  },
  {
    question: "When can I retire?",
    calculators: [
      { id: "fire", name: "FIRE Matrix", slug: "fire-matrix", description: "When can you actually retire? Month-by-month freedom timeline." },
      { id: "nps", name: "NPS Modeler", slug: "nps-modeler", description: "Project your pension and corpus. See what 80C savings really build." },
      { id: "ppf", name: "PPF Calculator", slug: "ppf-calculator", description: "Real PPF maturity after inflation. EEE tax benefit included.", tag: "New" },
      { id: "epf", name: "EPF Calculator", slug: "epf-calculator", description: "Project your EPF corpus with employer split and interest compounding.", tag: "New" },
    ],
  },
  {
    question: "What's my real return?",
    calculators: [
      { id: "sip", name: "SIP Simulator", slug: "sip-simulator", description: "See actual returns after inflation and tax. Real numbers, not marketing.", tag: "Popular" },
      { id: "fd", name: "FD Comparator", slug: "fd-comparator", description: "Your FD's real return after tax and inflation. Usually lower than you think." },
      { id: "compound", name: "Compound Interest", slug: "compound-interest-calculator", description: "See how compound interest really grows your money after tax and inflation.", tag: "New" },
      { id: "step-up-sip", name: "Step-Up SIP", slug: "step-up-sip-calculator", description: "Annual SIP increase vs Regular compared. Step-Up wins every time.", tag: "New" },
      { id: "simple-interest", name: "Simple Interest", slug: "simple-interest-calculator", description: "Simple vs Compound side by side. See what compounding really costs you.", tag: "New" },
    ],
  },
  {
    question: "How much will I pay?",
    calculators: [
      { id: "emi", name: "EMI Analyzer", slug: "emi-analyzer", description: "Compare loan EMIs with the real total cost over the full tenure." },
      { id: "gst", name: "GST Calculator", slug: "gst-calculator", description: "Compute GST on any amount. CGST/SGST split for intra-state.", tag: "New" },
    ],
  },
  {
    question: "Am I on track?",
    calculators: [
      { id: "goal", name: "Goal Planner", slug: "goal-planner", description: "Monthly SIP needed per goal. Know exactly what to invest and when." },
      { id: "accum", name: "Accumulator", slug: "accumulation-calculator", description: "Lump sum vs SIP — see which strategy wins after costs." },
    ],
  },
];

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
  const posts = getAllPosts().filter((p) => p.featured).slice(0, 3);

  return (
    <main className="flex-1 flex flex-col">
      {/* ── 1. TRUTH BOMB HERO ── Animated counter showing 12% → 3.8% */}
      <section className="w-full bg-ink relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
          <p className="text-sm font-mono uppercase tracking-[0.25em] text-sienna mb-6">
            c7xai
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl font-serif-display">
            Your 12% SIP returns become{" "}
            <span className="text-sienna">3.8%</span>.
          </h1>
          <p className="text-xl md:text-2xl text-truth/80 font-serif-display mt-6 max-w-2xl">
            Here&apos;s why.
          </p>
          <p className="text-base text-text-secondary mt-4 max-w-xl leading-relaxed">
            Mutual funds show you 12%. After inflation (6%) and LTCG tax (12.5% above ₹1.25L), you keep 3.8%. Every calculator here shows the real number.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/sip-simulator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sienna text-white text-sm font-semibold hover:bg-sienna/90 transition-colors"
            >
              Try SIP Truth &rarr;
            </Link>
            <Link
              href="#calculators"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-medium hover:border-sienna/50 hover:text-sienna transition-colors"
            >
              All Calculators
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. THE REVEAL ── Interactive widget */}
      <section className="w-full bg-ink-light border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div className="truth-reveal">
            <div className="text-3xl font-bold font-serif-display text-sienna">3.8%</div>
            <div className="text-sm text-text-muted font-mono mt-1">Real SIP return</div>
            <div className="text-xs text-text-muted/60 font-mono line-through">12% advertised</div>
          </div>
          <div className="truth-reveal">
            <div className="text-3xl font-bold font-serif-display text-sienna">5.6%</div>
            <div className="text-sm text-text-muted font-mono mt-1">Post-tax FD yield</div>
            <div className="text-xs text-text-muted/60 font-mono line-through">7% advertised</div>
          </div>
          <div className="truth-reveal">
            <div className="text-3xl font-bold font-serif-display text-sienna">0%</div>
            <div className="text-sm text-text-muted font-mono mt-1">Data collected about you</div>
            <div className="text-xs text-text-muted/60 font-mono">No signups. No tracking. No PII.</div>
          </div>
        </div>
      </section>

      {/* ── 3. CALCULATOR GRID ── Recategorized by question */}
      <section id="calculators" className="w-full bg-ink">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 font-serif-display">
            What do you want to know?
          </h2>
          <p className="text-sm text-text-secondary mb-12 max-w-lg">
            Every number inflation-adjusted. Every tax accounted for. Zero marketing spin.
          </p>
          <div className="space-y-16">
            {CALCULATOR_QUESTIONS.map((group) => (
              <div key={group.question}>
                <h3 className="text-lg font-semibold text-truth/90 font-serif-display mb-6">
                  {group.question}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
                  {group.calculators.map((calc, i) => (
                    <CalcCard key={calc.id} {...calc} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. THE METHOD ── 3 pillars */}
      <section className="w-full bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink font-serif-display">
            The Method
          </h2>
          <p className="text-sm text-[#666] mt-2 mb-12 max-w-lg">
            Why our numbers are different — and more honest.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-[#ddd] rounded-lg">
              <div className="text-2xl font-bold font-serif-display text-sienna mb-3">Real Inflation Data</div>
              <p className="text-sm text-[#444] leading-relaxed">
                We use RBI&apos;s 10-year average inflation (6%), not the feel-good 4% headline number. Your money buys less every year — we account for that.
              </p>
            </div>
            <div className="p-6 border border-[#ddd] rounded-lg">
              <div className="text-2xl font-bold font-serif-display text-sienna mb-3">Current Tax Laws</div>
              <p className="text-sm text-[#444] leading-relaxed">
                LTCG at 12.5% above ₹1.25L. New vs Old regime. Section 80C limits. Every deduction that applies to you — we apply it.
              </p>
            </div>
            <div className="p-6 border border-[#ddd] rounded-lg">
              <div className="text-2xl font-bold font-serif-display text-sienna mb-3">No Product to Sell</div>
              <p className="text-sm text-[#444] leading-relaxed">
                We don&apos;t sell mutual funds, insurance, or FDs. No affiliate links. No commissions. The math just is what it is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TRUTH LIBRARY ── Blog posts as truth reports */}
      {posts.length > 0 && (
        <section className="w-full bg-ink">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-serif-display">
                Truth Reports
              </h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-sienna hover:text-sienna/80 transition-colors"
              >
                All reports &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] bg-ink-light border border-white/10 mb-4 overflow-hidden group-hover:border-sienna/30 transition-colors flex items-center justify-center">
                    <span className="text-sm font-mono text-text-muted/40 group-hover:text-sienna/60 transition-colors">
                      {post.category}
                    </span>
                  </div>
                  <div className="text-xs uppercase font-mono text-[#666] mb-2">
                    {post.category} &middot; {post.readTime} min read
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-sienna transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. OPEN SOURCE TRUST ── */}
      <section className="w-full bg-surface border-t border-[#ddd]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="text-4xl font-bold font-serif-display text-ink mb-6">
            All our math runs in your browser.
          </div>
          <p className="text-lg text-[#444] max-w-xl mx-auto leading-relaxed">
            Zero data sent anywhere. No server. No database. No tracking.
            Every computation happens client-side — you can verify it yourself.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm font-mono text-[#666]">
            <span>No signups</span>
            <span className="text-[#ddd]">&middot;</span>
            <span>No PII</span>
            <span className="text-[#ddd]">&middot;</span>
            <span>No cookies</span>
            <span className="text-[#ddd]">&middot;</span>
            <span>No server</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full bg-ink border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <span className="text-xl font-bold text-white">c7<span className="text-sienna">xai</span></span>
            <p className="text-xs text-text-muted mt-3 leading-relaxed">
              The truth about your money. Inflation-adjusted, tax-aware financial clarity for India.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase font-mono tracking-[0.15em] text-text-muted mb-4">Calculators</h4>
            <div className="flex flex-col gap-2">
              <Link href="/sip-simulator" className="text-sm text-text-secondary hover:text-sienna transition-colors">SIP Simulator</Link>
              <Link href="/emi-analyzer" className="text-sm text-text-secondary hover:text-sienna transition-colors">EMI Analyzer</Link>
              <Link href="/tax-sandbox" className="text-sm text-text-secondary hover:text-sienna transition-colors">Tax Sandbox</Link>
              <Link href="/fire-matrix" className="text-sm text-text-secondary hover:text-sienna transition-colors">FIRE Matrix</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase font-mono tracking-[0.15em] text-text-muted mb-4">More</h4>
            <div className="flex flex-col gap-2">
              <Link href="/methodology" className="text-sm text-text-secondary hover:text-sienna transition-colors">Methodology</Link>
              <Link href="/truth-index" className="text-sm text-text-secondary hover:text-sienna transition-colors">Truth Index</Link>
              <Link href="/compare" className="text-sm text-text-secondary hover:text-sienna transition-colors">Compare</Link>
              <Link href="/blog" className="text-sm text-text-secondary hover:text-sienna transition-colors">Blog</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase font-mono tracking-[0.15em] text-text-muted mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm text-text-secondary hover:text-sienna transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-text-secondary hover:text-sienna transition-colors">Terms & Conditions</Link>
              <Link href="/refund" className="text-sm text-text-secondary hover:text-sienna transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <span className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} by c7xai. Computed entirely client-side.
            </span>
            <span className="text-xs text-text-muted">
              NIFTY 12% &mu; / 18% &sigma; &middot; 6% inflation &middot; LTCG 12.5% above &rsquo;1.25L
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}