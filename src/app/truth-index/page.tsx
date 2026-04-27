"use client";

import { useState } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ShareBar } from "@/components/shared/share-bar";

interface TruthCard {
  lie: string;
  truth: string;
  calculator: string;
  tag: string;
  category: "returns" | "tax" | "loans" | "planning";
  stat: string;
  detail: string;
}

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "returns", label: "Returns" },
  { key: "tax", label: "Tax" },
  { key: "loans", label: "Loans" },
  { key: "planning", label: "Planning" },
] as const;

const CARDS: TruthCard[] = [
  {
    lie: "Your mutual fund gives you 12% returns",
    truth: "After 6% inflation and 12.5% LTCG tax, your real return is ~4.1%",
    calculator: "/sip-simulator",
    tag: "SIP",
    category: "returns",
    stat: "4.1%",
    detail: "Mutual funds quote 12%, but inflation eats 6% and LTCG tax takes 12.5% of gains above ₹1.25L. Your real wealth grows far slower than the brochure suggests.",
  },
  {
    lie: "FD gives you 7% returns safely",
    truth: "After tax and inflation, FD yields are often negative in real terms",
    calculator: "/fd-comparator",
    tag: "FD",
    category: "returns",
    stat: "Negative",
    detail: "A 7% FD in the 30% tax bracket nets 4.9% after tax. Subtract 6% inflation, and you lose 1.1% purchasing power every year. Your \"safe\" investment is actually eroding your wealth.",
  },
  {
    lie: "Your CTC is what you take home",
    truth: "CTC minus PF, tax, and allowances can be 30-40% less than what they quote",
    calculator: "/ctc-optimizer",
    tag: "CTC",
    category: "tax",
    stat: "30-40%",
    detail: "A ₹20L CTC can mean ₹12-14L in-hand after PF, professional tax, income tax, and variable pay that may never materialize. Always negotiate on in-hand, not CTC.",
  },
  {
    lie: "PPF is the best tax-saving investment",
    truth: "PPF is tax-free but 7.1% minus 6% inflation = 1.1% real return over 15 years",
    calculator: "/ppf-calculator",
    tag: "PPF",
    category: "returns",
    stat: "1.1%",
    detail: "PPF's EEE (Exempt-Exempt-Exempt) status sounds great, but the 15-year lock-in and below-inflation returns mean your money barely grows in purchasing power. It's a savings account, not an investment.",
  },
  {
    lie: "EMI is just the monthly cost",
    truth: "On a 20-year ₹50L loan at 8.5%, you pay ₹54L+ in interest — more than the principal",
    calculator: "/emi-analyzer",
    tag: "EMI",
    category: "loans",
    stat: "₹54L+",
    detail: "EMI looks affordable at ₹43,000/month, but over 20 years you pay back ₹1.04 crore on a ₹50 lakh loan. The bank profits from your comfort with the monthly number.",
  },
  {
    lie: "NPS gives you a great pension",
    truth: "40% annuity income is fully taxable, and inflation erodes the monthly pension every year",
    calculator: "/nps-modeler",
    tag: "NPS",
    category: "planning",
    stat: "Taxable",
    detail: "NPS forces you to buy an annuity with 40% of your corpus, which generates taxable income. The monthly pension that looks adequate today will buy far less in 20 years due to inflation.",
  },
  {
    lie: "Your SWP will last 25 years",
    truth: "A market crash in the first 2 years of retirement can halve your corpus longevity",
    calculator: "/swp-stress-test",
    tag: "SWP",
    category: "planning",
    stat: "12 yrs",
    detail: "Sequence-of-returns risk means early crashes are devastating. A 40% drawdown in years 1-2 can reduce a 25-year SWP to just 12-15 years. This is why bucket strategies matter.",
  },
  {
    lie: "₹1 crore retirement fund is enough",
    truth: "₹1 crore in 25 years buys what ₹23L buys today at 6% inflation",
    calculator: "/fire-matrix",
    tag: "FIRE",
    category: "planning",
    stat: "₹23L",
    detail: "₹1 crore sounds like a lot, but inflation compounds too. At 6% inflation, you need ₹4.3 crore in 25 years just to maintain today's ₹1 crore purchasing power. Most retirement targets are dangerously low.",
  },
  {
    lie: "HRA saves you maximum tax",
    truth: "HRA exemption is the minimum of three formulas — the actual saving is often far less than expected",
    calculator: "/hra-calculator",
    tag: "HRA",
    category: "tax",
    stat: "Less than you think",
    detail: "HRA exemption = min(actual HRA, rent - 10% of basic, 50%/40% of basic). Most people calculate the full HRA amount, but the actual exemption is the minimum — often 40-60% less.",
  },
  {
    lie: "New tax regime is always better",
    truth: "Old regime wins if your deductions exceed ₹3.75L. Run the numbers for your salary.",
    calculator: "/tax-sandbox",
    tag: "Tax",
    category: "tax",
    stat: "₹3.75L",
    detail: "The new regime has wider slabs but no deductions. If you claim 80C (₹1.5L), 80D (₹25K+), HRA, and home loan interest, the old regime often saves more. The crossover is around ₹3.75L in deductions.",
  },
  {
    lie: "Real estate always appreciates",
    truth: "After stamp duty, maintenance, and inflation, real returns are often 2-4% — barely above FD",
    calculator: "/real-estate-calculator",
    tag: "Real Estate",
    category: "returns",
    stat: "2-4%",
    detail: "Brokers quote appreciation rates without deducting stamp duty (5-7%), registration (1%), maintenance (₹5K+/month), property tax, and capital gains tax. Real inflation-adjusted returns are modest.",
  },
  {
    lie: "Crypto gains are just like stock gains",
    truth: "Crypto is taxed at a flat 30% with no slab benefit, no loss offset, and 1% TDS on transfers above ₹10L",
    calculator: "/crypto-calculator",
    tag: "Crypto",
    category: "tax",
    stat: "30% flat",
    detail: "Section 115BBE taxes crypto at 30% flat — even if you're in the 5% slab. You cannot offset crypto losses against other gains. Section 194S adds 1% TDS on transfers above ₹10L.",
  },
  {
    lie: "Forex investments double your money abroad",
    truth: "After capital gains tax, TCS, bank spread, and inflation, net returns drop 4-6% from the headline rate",
    calculator: "/forex-calculator",
    tag: "Forex",
    category: "returns",
    stat: "-4-6%",
    detail: "Remitting money abroad attracts 20% TCS above ₹7L (LRS). Capital gains are taxed (20% with indexation if held 3+ years, else slab rate). Bank spreads add another 1-2%. The actual return is much lower.",
  },
  {
    lie: "A car is an asset",
    truth: "A car loses 15-20% per year in value — and that's before fuel, insurance, and maintenance",
    calculator: "/depreciation-calculator",
    tag: "Car",
    category: "loans",
    stat: "15-20%/yr",
    detail: "Cars depreciate 15-20% per year. A ₹10L car costs ₹2L+/year in fuel, insurance, and maintenance. After 5 years, it's worth ₹3-4L. Total cost of ownership often exceeds 2x the purchase price.",
  },
];

function formatStat(stat: string): string {
  return stat;
}

export default function TruthIndexPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const filteredCards = activeCategory === "all"
    ? CARDS
    : CARDS.filter((c) => c.category === activeCategory);

  const toggleReveal = (lie: string) => {
    setRevealedCards((prev) => {
      const next = new Set(prev);
      if (next.has(lie)) {
        next.delete(lie);
      } else {
        next.add(lie);
      }
      return next;
    });
  };

  const toggleExpand = (lie: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(lie)) {
        next.delete(lie);
      } else {
        next.add(lie);
      }
      return next;
    });
  };

  const revealAll = () => {
    setRevealedCards(new Set(CARDS.map((c) => c.lie)));
  };

  return (
    <main className="min-h-screen bg-ink text-text-primary">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-xs text-text-secondary font-mono mb-8">
          <Link href="/" className="hover:text-gain transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Truth Index</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-4">
          The <span className="text-truth">Truth Index</span>
        </h1>
        <p className="text-text-secondary mb-6 leading-relaxed">
          Financial products are sold with big numbers. We show you what they actually mean
          after inflation, tax, and fees. Click any card to reveal the truth.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={revealAll}
            className="px-3 py-1.5 text-xs font-mono rounded-md bg-sienna/10 text-sienna border border-sienna/30 hover:bg-sienna/20 transition-colors"
          >
            Reveal All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                activeCategory === cat.key
                  ? "bg-text-primary text-ink"
                  : "bg-surface-hover text-text-secondary border border-border hover:bg-border/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredCards.map((card) => {
            const isRevealed = revealedCards.has(card.lie);
            const isExpanded = expandedCards.has(card.lie);

            return (
              <div
                key={card.lie}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isRevealed
                    ? "border-gain/30 bg-gain/5"
                    : "border-border bg-surface hover:border-loss/30"
                }`}
              >
                {/* Lie header — always visible */}
                <button
                  onClick={() => toggleReveal(card.lie)}
                  className="w-full text-left p-4 sm:p-5 flex items-start gap-3 group"
                >
                  <span className="shrink-0 mt-0.5 px-2 py-0.5 text-[10px] rounded-md font-mono bg-loss/20 text-loss border border-loss/40">
                    {card.tag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-semibold text-text-primary leading-snug">
                      <span className="text-loss">Lie: </span>
                      {card.lie}
                    </p>
                  </div>
                  <span className={`shrink-0 text-text-muted transition-transform duration-300 ${isRevealed ? "rotate-180" : ""}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {/* Truth reveal — animated */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isRevealed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.5rem+0.5rem)]">
                      {/* Stat highlight */}
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="text-2xl sm:text-3xl font-serif font-bold text-sienna">
                          {formatStat(card.stat)}
                        </span>
                        <span className="text-xs font-mono text-text-muted">the real number</span>
                      </div>

                      <p className="text-sm sm:text-base text-text-primary leading-relaxed mb-3">
                        <span className="text-gain font-semibold">Truth: </span>
                        {card.truth}
                      </p>

                      {/* Expandable detail */}
                      {isExpanded && (
                        <p className="text-sm text-text-secondary leading-relaxed mb-3">
                          {card.detail}
                        </p>
                      )}

                      <div className="flex items-center gap-3">
                        <Link
                          href={card.calculator}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-md bg-gain/20 text-gain border border-gain/40 hover:bg-gain/30 transition-colors"
                        >
                          Verify it
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => toggleExpand(card.lie)}
                          className="text-xs font-mono text-text-muted hover:text-sienna transition-colors"
                        >
                          {isExpanded ? "Less" : "Why?"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 p-6 bg-surface rounded-xl border border-border text-center">
          <p className="text-sm text-text-secondary mb-4">
            Every number on this page uses RBI 10-year average inflation (6%), current tax slabs,
            and real market data. Don&apos;t trust marketing — verify.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/methodology" className="px-4 py-2 text-sm rounded-md bg-gain/20 text-gain border border-gain/40 font-mono hover:bg-gain/30 transition-colors">
              Our Methodology
            </Link>
            <Link href="/compare" className="px-4 py-2 text-sm rounded-md bg-surface text-text-primary border border-border font-mono hover:bg-border/30 transition-colors">
              Compare Returns
            </Link>
            <Link href="/planner" className="px-4 py-2 text-sm rounded-md bg-sienna/10 text-sienna border border-sienna/30 font-mono hover:bg-sienna/20 transition-colors">
              Financial Planner
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8">
        <span className="text-xs text-text-muted font-mono">Share:</span>
        <ShareBar title="Truth Index — c7xai" />
      </div>
    </main>
  );
}