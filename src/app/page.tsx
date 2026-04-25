import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { CalcCard } from "@/components/home/calc-card";

const CALCULATORS: readonly {
  id: string;
  name: string;
  slug: string;
  description: string;
  tag?: string;
}[] = [
  { id: "sip", name: "SIP Simulator", slug: "sip-simulator", description: "See actual returns after inflation and tax. Real numbers, not marketing.", tag: "Popular" },
  { id: "emi", name: "EMI Analyzer", slug: "emi-analyzer", description: "Compare loan EMIs with the real total cost you'll pay over the full tenure." },
  { id: "tax", name: "Tax Sandbox", slug: "tax-sandbox", description: "Old vs New regime side by side. Find which one actually saves you more." },
  { id: "ppf", name: "PPF Calculator", slug: "ppf-calculator", description: "Real PPF maturity after inflation. EEE tax benefit included.", tag: "New" },
  { id: "compound", name: "Compound Interest", slug: "compound-interest-calculator", description: "See how compound interest really grows your money after tax and inflation.", tag: "New" },
  { id: "hra", name: "HRA Calculator", slug: "hra-calculator", description: "How much HRA is tax-free? Calculate Section 10(13A) exemption instantly.", tag: "New" },
  { id: "accum", name: "Accumulator", slug: "accumulation-calculator", description: "Lump sum vs SIP — see which accumulation strategy wins after costs." },
  { id: "fd", name: "FD Comparator", slug: "fd-comparator", description: "Your FD's real return after tax and inflation. Usually lower than you think." },
  { id: "swp", name: "SWP Stress Test", slug: "swp-stress-test", description: "Will your corpus survive a market crash? Simulate worst-case withdrawals." },
  { id: "fire", name: "FIRE Matrix", slug: "fire-matrix", description: "Find out when you can actually retire. Month-by-month freedom timeline." },
  { id: "ctc", name: "CTC Optimizer", slug: "ctc-optimizer", description: "Maximize your in-hand salary. See where every rupee of your CTC goes." },
  { id: "nps", name: "NPS Modeler", slug: "nps-modeler", description: "Project your pension and corpus. See what 80C savings really build." },
  { id: "goal", name: "Goal Planner", slug: "goal-planner", description: "Monthly SIP needed per goal. Know exactly what to invest and when." },
  { id: "step-up-sip", name: "Step-Up SIP", slug: "step-up-sip-calculator", description: "See how an annual SIP increase boosts your corpus. Step-Up vs Regular compared.", tag: "New" },
  { id: "gst", name: "GST Calculator", slug: "gst-calculator", description: "Compute GST on any amount. CGST/SGST split for intra-state, IGST for inter-state.", tag: "New" },
  { id: "simple-interest", name: "Simple Interest", slug: "simple-interest-calculator", description: "Simple vs Compound interest side by side. See what compounding really costs you.", tag: "New" },
  { id: "epf", name: "EPF Calculator", slug: "epf-calculator", description: "Project your EPF corpus with employer split and annual interest compounding.", tag: "New" },
  { id: "term-insurance", name: "Term Insurance", slug: "term-insurance-calculator", description: "How much life cover do you actually need? HLV method with inflation and loans.", tag: "New" },
  { id: "salary", name: "Salary Calculator", slug: "salary-calculator", description: "CTC to in-hand salary. Full breakup — basic, HRA, PF, tax — old vs new regime." },
];

export const metadata: Metadata = {
  title: "c7xai — The Truth About Your Money",
  description: "Old rules of money are broken. Here are the real ones. Inflation-adjusted, tax-aware financial clarity for India.",
  openGraph: {
    title: "c7xai — The Truth About Your Money",
    description: "Old rules of money are broken. Here are the real ones. Inflation-adjusted, tax-aware financial clarity for India.",
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
      {/* ── HERO ── Truth reveal on void background */}
      <section className="w-full bg-ink relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
          <p className="text-sm font-mono uppercase tracking-[0.25em] text-sienna mb-6">
            c7xai
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl font-serif-display">
            The Truth About{" "}
            <span className="text-sienna">Your Money</span>
          </h1>
          <div className="mt-10 max-w-2xl space-y-4">
            <p className="text-lg text-truth/90 font-serif-display leading-relaxed">
              Your SIP returns 12%? After inflation and tax, you keep <span className="text-sienna font-bold">3.8%</span>.
            </p>
            <p className="text-lg text-truth/90 font-serif-display leading-relaxed">
              Your FD &ldquo;guarantees&rdquo; 7%? After tax, you get <span className="text-sienna font-bold">5.6%</span>.
            </p>
            <p className="text-lg text-truth/90 font-serif-display leading-relaxed">
              Your PF is &ldquo;safe&rdquo;? It hasn&apos;t beaten inflation in 3 years.
            </p>
          </div>
          <p className="text-base text-text-secondary mt-8 max-w-xl leading-relaxed">
            We don&apos;t show you the marketing number. We show you what you actually keep.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/sip-simulator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sienna text-white text-sm font-semibold
                hover:bg-sienna/90 transition-colors"
            >
              Try SIP Truth &rarr;
            </Link>
            <Link
              href="#calculators"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-medium
                hover:border-sienna/50 hover:text-sienna transition-colors"
            >
              All Calculators
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUTH CALLS ── Short punch statements */}
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

      {/* ── ABOUT ── Honest, no SVG illustrations */}
      <section className="w-full bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink font-serif-display">
            What c7xai Actually Does
          </h2>
          <div className="mt-8 max-w-2xl space-y-4 text-base text-[#444] leading-relaxed">
            <p>
              Every calculator on this site uses NIFTY historical data (12% mean, 18% standard deviation),
              6% inflation, and current Indian tax laws including LTCG at 12.5% above ₹1.25L.
            </p>
            <p>
              The math is transparent. The assumptions are stated. Every computation runs in your browser.
              No PII collected. No tracking. No product pushing.
            </p>
            <p className="text-ink font-semibold">
              Just the truth about your money.
            </p>
          </div>
        </div>
      </section>

      {/* ── CALCULATORS ── Clean grid, no numbered cards */}
      <section id="calculators" className="w-full bg-ink">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 font-serif-display">
            Calculators
          </h2>
          <p className="text-sm text-text-secondary mb-12 max-w-lg">
            Every number inflation-adjusted. Every tax accounted for. Zero marketing spin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {CALCULATORS.map((calc, i) => (
              <CalcCard key={calc.id} {...calc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ── Clean, no grid-pattern placeholders */}
      {posts.length > 0 && (
        <section className="w-full bg-surface">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink font-serif-display">
                Financial Stories
              </h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-sienna hover:text-sienna/80 transition-colors"
              >
                All posts &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  {/* Blog card — data visualization, not stock photos */}
                  <div className="aspect-[4/3] bg-ink border border-white/10 mb-4 overflow-hidden group-hover:border-sienna/30 transition-colors flex items-center justify-center">
                    <span className="text-sm font-mono text-text-muted/40 group-hover:text-sienna/60 transition-colors">
                      {post.category}
                    </span>
                  </div>
                  <div className="text-xs uppercase font-mono text-[#666] mb-2">
                    {post.category} &middot; {post.readTime} min read
                  </div>
                  <h3 className="text-lg font-bold text-ink group-hover:text-sienna transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#666] mt-2 line-clamp-2">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── Clean, minimal */}
      <footer className="w-full bg-ink border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold text-white">c7<span className="text-sienna">xai</span></span>
            <p className="text-xs text-text-muted mt-3 leading-relaxed">
              The truth about your money. Inflation-adjusted, tax-aware financial clarity for India.
            </p>
          </div>
          {/* Menu */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-[0.15em] text-text-muted mb-4">Menu</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-text-secondary hover:text-sienna transition-colors">Calculators</Link>
              <Link href="/blog" className="text-sm text-text-secondary hover:text-sienna transition-colors">Blog</Link>
              <Link href="/sip-simulator" className="text-sm text-text-secondary hover:text-sienna transition-colors">SIP Simulator</Link>
              <Link href="/tax-sandbox" className="text-sm text-text-secondary hover:text-sienna transition-colors">Tax Sandbox</Link>
            </div>
          </div>
          {/* Legal */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-[0.15em] text-text-muted mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm text-text-secondary hover:text-sienna transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-text-secondary hover:text-sienna transition-colors">Terms & Conditions</Link>
              <Link href="/refund" className="text-sm text-text-secondary hover:text-sienna transition-colors">Refund Policy</Link>
            </div>
          </div>
          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-[0.15em] text-text-muted mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <span>hello@c7xai.in</span>
              <span>All math runs client-side</span>
              <span>Zero PII. Zero tracking.</span>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <span className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} by c7xai. Computed entirely client-side.
            </span>
            <span className="text-xs text-text-muted">
              NIFTY 12% &mu; / 18% &sigma; &middot; 6% inflation &middot; LTCG 12.5% above &rsquo;1.25L &middot; The truth about your money
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}