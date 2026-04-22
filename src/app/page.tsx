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
  { id: "accum", name: "Accumulator", slug: "accumulation-calculator", description: "Lump sum vs SIP — see which accumulation strategy wins after costs." },
  { id: "fd", name: "FD Comparator", slug: "fd-comparator", description: "Your FD's real return after tax and inflation. Usually lower than you think." },
  { id: "swp", name: "SWP Stress Test", slug: "swp-stress-test", description: "Will your corpus survive a market crash? Simulate worst-case withdrawals." },
  { id: "fire", name: "FIRE Matrix", slug: "fire-matrix", description: "Find out when you can actually retire. Month-by-month freedom timeline." },
  { id: "ctc", name: "CTC Optimizer", slug: "ctc-optimizer", description: "Maximize your in-hand salary. See where every rupee of your CTC goes." },
  { id: "nps", name: "NPS Modeler", slug: "nps-modeler", description: "Project your pension and corpus. See what 80C savings really build." },
  { id: "goal", name: "Goal Planner", slug: "goal-planner", description: "Monthly SIP needed per goal. Know exactly what to invest and when." },
];

export const metadata: Metadata = {
  title: "Financial Simulators — Real Returns, No Marketing",
  description: "Inflation-adjusted, tax-aware financial calculators for Indian investors. Zero PII, zero tracking, all math runs in your browser.",
  openGraph: {
    title: "Financial Simulators — Real Returns, No Marketing",
    description: "Inflation-adjusted, tax-aware financial calculators for Indian investors. Zero PII, zero tracking, all math runs in your browser.",
    url: "https://financialsimulators.in",
    siteName: "Financial Simulators",
    type: "website",
  },
  alternates: { canonical: "/" },
};

export default function Home() {
  const posts = getAllPosts().filter((p) => p.featured).slice(0, 3);

  return (
    <main className="flex-1 flex flex-col">
      {/* ── HERO ── Full-width black, large text, abstract grid bg */}
      <section className="w-full bg-ink bg-grid-pattern relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl">
            Innovative Financial Simulators for{" "}
            <span className="text-sienna">Indian Investors</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mt-6 max-w-2xl leading-relaxed">
            Inflation-adjusted, tax-aware calculators that show real returns.
            No signups, no tracking, no product pushing. All math runs in your browser.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/sip-simulator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sienna text-white text-sm font-semibold
                hover:bg-sienna/90 transition-colors"
            >
              Try SIP Simulator
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-medium
                hover:border-sienna/50 hover:text-sienna transition-colors"
            >
              All Calculators ↓
            </Link>
          </div>
        </div>
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroGrid)" />
          </svg>
        </div>
      </section>

      {/* ── ABOUT ── Wix template: "A Closer Look" section with grid bg image */}
      <section className="w-full bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
              A Closer Look at FinSim
            </h2>
            <p className="text-base text-[#444] mt-6 leading-relaxed max-w-lg">
              Every calculator on this site uses NIFTY historical data (12% mean, 18% standard deviation),
              6% inflation, and current Indian tax laws including LTCG at 12.5% above ₹1.25L.
              The math is transparent, the assumptions are stated, and every computation runs in your browser.
              Zero PII collected. Zero tracking. Zero product pushing.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-sienna hover:text-sienna/80 transition-colors"
            >
              Learn More →
            </Link>
          </div>
          <div className="relative aspect-square max-w-md mx-auto">
            {/* Abstract geometric illustration */}
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <rect x="0" y="0" width="400" height="400" fill="#050505" />
              {[...Array(7)].map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 60 + 20} x2="400" y2={i * 60 + 20} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              ))}
              {[...Array(7)].map((_, i) => (
                <line key={`v-${i}`} x1={i * 60 + 20} y1="0" x2={i * 60 + 20} y2="400" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              ))}
              {/* Accent rectangles */}
              <rect x="60" y="60" width="120" height="180" fill="#D8400E" opacity="0.08" />
              <rect x="200" y="120" width="140" height="100" fill="#D8400E" opacity="0.05" />
              <rect x="80" y="280" width="200" height="60" fill="#D8400E" opacity="0.04" />
              {/* Dots at intersections */}
              {[80, 200, 320].map((x) =>
                [80, 200, 320].map((y) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#D8400E" opacity="0.3" />
                ))
              )}
              {/* Rupee symbol */}
              <text x="140" y="170" fontSize="48" fill="#D8400E" opacity="0.15" fontFamily="var(--font-geist-mono)" fontWeight="bold">₹</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ── SERVICES (Calculators) ── Wix template: "Our Services" with numbered items */}
      <section id="services" className="w-full bg-ink">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-16">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {CALCULATORS.map((calc, i) => (
              <CalcCard key={calc.id} {...calc} index={i} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/sip-simulator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sienna text-white text-sm font-semibold
                hover:bg-sienna/90 transition-colors"
            >
              See More
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ── Wix template: "Why Choose Voor.IT" with numbered features */}
      <section className="w-full bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink mb-16">
            Why Choose FinSim
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            {[
              {
                num: "01",
                title: "CUTTING-EDGE ACCURACY",
                desc: "Every simulator uses NIFTY historical data with real standard deviation — not cherry-picked averages that make returns look better than they are."
              },
              {
                num: "02",
                title: "COST-EFFECTIVE INSIGHTS",
                desc: "Free forever. No premium tiers, no paywalled features. Every calculator gives you the full picture including tax drag and inflation erosion."
              },
              {
                num: "03",
                title: "24/7 PRIVATE COMPUTATION",
                desc: "All math runs in your browser. No data leaves your device. No accounts, no tracking, no PII collected. Your finances stay yours."
              }
            ].map((item) => (
              <div key={item.num} className="flex flex-col gap-3">
                <span className="text-sm font-mono text-sienna tracking-wider">{item.num}</span>
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ── Wix template: "Get the Latest from the Blog" */}
      {posts.length > 0 && (
        <section className="w-full bg-ink">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Get the Latest from the Blog
              </h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-sienna hover:text-sienna/80 transition-colors"
              >
                All posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  {/* Blog card image placeholder */}
                  <div className="aspect-[4/3] bg-white/5 border border-white/10 mb-4 overflow-hidden group-hover:border-sienna/30 transition-colors">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                      <rect width="400" height="300" fill="#050505" />
                      {[...Array(5)].map((_, i) => (
                        <line key={i} x1="0" y1={i * 60 + 20} x2="400" y2={i * 60 + 20} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      ))}
                      {[...Array(7)].map((_, i) => (
                        <line key={i} x1={i * 60 + 20} y1="0" x2={i * 60 + 20} y2="300" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      ))}
                      <text x="200" y="160" textAnchor="middle" fontSize="14" fill="#D8400E" opacity="0.4" fontFamily="var(--font-geist-mono)">
                        {post.category}
                      </text>
                    </svg>
                  </div>
                  <div className="text-xs uppercase font-mono text-text-muted mb-2">
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

      {/* ── RECOMMENDED BY / PARTNERS ── Wix template logo strip */}
      <section className="w-full bg-ink border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-center text-sm font-mono uppercase tracking-[0.2em] text-text-muted mb-10">
            Recommended By
          </h2>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {["Nifty 50", "BSE Sensex", "RBI", "SEBI", "AMFI"].map((name) => (
              <span key={name} className="text-text-muted/40 text-lg font-bold tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── Wix template: multi-column footer on black */}
      <footer className="w-full bg-ink border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold text-white">Fin<span className="text-sienna">Sim</span></span>
            <p className="text-xs text-text-muted mt-3 leading-relaxed">
              Real returns. No marketing. Inflation-adjusted, tax-aware financial calculators for Indian investors.
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
              <span>hello@financialsimulators.in</span>
              <span>All math runs client-side</span>
              <span>Zero PII. Zero tracking.</span>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <span className="text-xs text-text-muted">
              © {new Date().getFullYear()} by FinSim. Computed entirely client-side.
            </span>
            <span className="text-xs text-text-muted">
              NIFTY 12% μ / 18% σ · 6% inflation · LTCG 12.5% above ₹1.25L
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}