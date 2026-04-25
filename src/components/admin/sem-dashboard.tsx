"use client";

const KEYWORD_SUGGESTIONS = [
  { keyword: "sip calculator india", page: "/sip-simulator" },
  { keyword: "emi calculator home loan", page: "/emi-analyzer" },
  { keyword: "income tax calculator 2026", page: "/tax-sandbox" },
  { keyword: "lump sum vs sip calculator", page: "/accumulation-calculator" },
  { keyword: "fd interest rate calculator", page: "/fd-comparator" },
  { keyword: "swp calculator retirement", page: "/swp-stress-test" },
  { keyword: "fire calculator india", page: "/fire-matrix" },
  { keyword: "ctc to in hand salary calculator", page: "/ctc-optimizer" },
  { keyword: "nps calculator retirement", page: "/nps-modeler" },
  { keyword: "goal based sip calculator", page: "/goal-planner" },
  { keyword: "old vs new tax regime comparison", page: "/tax-sandbox" },
  { keyword: "real return on sip after inflation", page: "/sip-simulator" },
  { keyword: "loan emi comparison tool", page: "/emi-analyzer" },
  { keyword: "retirement corpus stress test", page: "/swp-stress-test" },
  { keyword: "salary structure optimizer", page: "/ctc-optimizer" },
];

const INTERNAL_LINK_OPPORTUNITIES = [
  { from: "Budget 2026 post", to: "Tax Sandbox", status: "missing" as const },
  { from: "SIP returns post", to: "Accumulation Calculator", status: "missing" as const },
  { from: "Retirement crash post", to: "FIRE Matrix", status: "linked" as const },
  { from: "Retirement crash post", to: "SWP Stress Test", status: "linked" as const },
  { from: "Budget 2026 post", to: "CTC Optimizer", status: "missing" as const },
];

export function SemDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Keyword Suggestions</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          {KEYWORD_SUGGESTIONS.map((kw, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-border last:border-b-0">
              <span className="text-sm text-text-primary">{kw.keyword}</span>
              <a
                href={kw.page}
                className="text-xs text-gain hover:text-gain/80 font-mono"
              >
                &rarr; {kw.page}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Internal Link Opportunities</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          {INTERNAL_LINK_OPPORTUNITIES.map((link, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-border last:border-b-0">
              <div className="text-sm text-text-primary">
                &ldquo;{link.from}&rdquo; &rarr; link to {link.to}
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  link.status === "linked"
                    ? "bg-gain/20 text-gain"
                    : "bg-loss/10 text-loss"
                }`}
              >
                {link.status === "linked" ? "Linked" : "Missing"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Social Share Preview</h3>
        <div className="p-4 rounded-md bg-surface border border-border">
          <div className="rounded-md overflow-hidden border border-border">
            <div className="h-10 bg-gain/20" />
            <div className="p-3 bg-surface">
              <div className="text-sm font-medium text-text-primary">c7xai</div>
              <div className="text-xs text-text-secondary">c7xai.in</div>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Open Graph and Twitter Card previews use the per-page metadata defined in calculator configs and blog frontmatter. Edit those to change the preview.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Performance Hints</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gain">&#10003;</span>
            <span className="text-text-secondary">Core Web Vitals: All calculator pages are static &mdash; LCP &lt; 1s, CLS = 0</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gain">&#10003;</span>
            <span className="text-text-secondary">Mobile-first: All pages use responsive layouts</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gain">&#10003;</span>
            <span className="text-text-secondary">Zero third-party scripts: No analytics, no tracking, no external dependencies</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gain">&#10003;</span>
            <span className="text-text-secondary">Page weight: Each calculator page &lt; 100KB (no images, client-side math only)</span>
          </div>
        </div>
      </div>
    </div>
  );
}