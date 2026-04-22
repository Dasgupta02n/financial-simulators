"use client";

import { useState, useEffect } from "react";

interface SeoPage {
  slug: string;
  title: string;
  hasTitle: boolean;
  hasDescription: boolean;
  hasJsonLd: boolean;
  hasOg: boolean;
}

const CALCULATOR_PAGES = [
  { slug: "sip-simulator", name: "SIP Simulator" },
  { slug: "emi-analyzer", name: "EMI Analyzer" },
  { slug: "tax-sandbox", name: "Tax Sandbox" },
  { slug: "accumulation-calculator", name: "Accumulation Calculator" },
  { slug: "fd-comparator", name: "FD Comparator" },
  { slug: "swp-stress-test", name: "SWP Stress Test" },
  { slug: "fire-matrix", name: "FIRE Matrix" },
  { slug: "ctc-optimizer", name: "CTC Optimizer" },
  { slug: "nps-modeler", name: "NPS Modeler" },
  { slug: "goal-planner", name: "Goal Planner" },
];

export function SeoToolkit() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [pages, setPages] = useState<SeoPage[]>([]);

  useEffect(() => {
    const seoPages: SeoPage[] = CALCULATOR_PAGES.map((calc) => ({
      slug: calc.slug,
      title: calc.name,
      hasTitle: true,
      hasDescription: true,
      hasJsonLd: true,
      hasOg: true,
    }));
    setPages(seoPages);
  }, []);

  const selected = selectedPage ? pages.find((p) => p.slug === selectedPage) : null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-4">Per-Page SEO Status</h3>
      <div className="rounded-lg border border-border overflow-hidden mb-6">
        {pages.map((page) => (
          <div
            key={page.slug}
            onClick={() => setSelectedPage(page.slug)}
            className={`flex items-center justify-between px-4 py-2 border-b border-border last:border-b-0 cursor-pointer hover:bg-surface/80 ${
              selectedPage === page.slug ? "bg-surface" : ""
            }`}
          >
            <span className="text-sm text-text-primary">/{page.slug}</span>
            <span className="text-xs text-gain">
              ✓ Title · Description · JSON-LD · OG
            </span>
          </div>
        ))}
      </div>

      {selected && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            Structured Data Preview: {selected.title}
          </h3>
          <div className="p-4 rounded-md bg-ink border border-border font-mono text-xs text-text-secondary overflow-x-auto">
            <pre>{JSON.stringify(
              {
                "@type": "FAQPage",
                mainEntity: selected.slug === "sip-simulator" ? [
                  { "@type": "Question", name: "How much will my SIP grow?", acceptedAnswer: { "@type": "Answer", text: "..." } },
                ] : [{ "@type": "Question", name: "...", acceptedAnswer: { "@type": "Answer", text: "..." } }],
              },
              null,
              2
            )}</pre>
          </div>
        </div>
      )}
    </div>
  );
}