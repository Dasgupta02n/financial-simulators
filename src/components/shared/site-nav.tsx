"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";

const CALCULATOR_LINKS = [
  { href: "/sip-simulator", label: "SIP Simulator" },
  { href: "/emi-analyzer", label: "EMI Analyzer" },
  { href: "/tax-sandbox", label: "Tax Sandbox" },
  { href: "/fd-comparator", label: "FD Comparator" },
  { href: "/ppf-calculator", label: "PPF Calculator" },
  { href: "/swp-stress-test", label: "SWP Stress Test" },
  { href: "/fire-matrix", label: "FIRE Matrix" },
  { href: "/goal-planner", label: "Goal Planner" },
  { href: "/hra-calculator", label: "HRA Calculator" },
  { href: "/nps-modeler", label: "NPS Modeler" },
  { href: "/ctc-optimizer", label: "CTC Optimizer" },
  { href: "/salary-calculator", label: "Salary Calculator" },
  { href: "/compound-interest-calculator", label: "Compound Interest" },
  { href: "/accumulation-calculator", label: "Accumulation" },
  { href: "/epf-calculator", label: "EPF Calculator" },
  { href: "/gst-calculator", label: "GST Calculator" },
  { href: "/step-up-sip-calculator", label: "Step-Up SIP" },
  { href: "/term-insurance-calculator", label: "Term Insurance" },
  { href: "/crypto-calculator", label: "Crypto Tax" },
  { href: "/forex-calculator", label: "Forex Tax" },
  { href: "/depreciation-calculator", label: "Car / Depreciation" },
  { href: "/real-estate-calculator", label: "Real Estate" },
  { href: "/simple-interest-calculator", label: "Simple Interest" },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/planner", label: "Planner" },
  { href: "/compare", label: "Compare" },
  { href: "/truth-index", label: "Truth Index" },
  { href: "/methodology", label: "Methodology" },
  { href: "/blog", label: "Blog" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full sticky top-0 z-50">
      <nav className="w-full bg-white/95 backdrop-blur-md border-b border-border shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            <span className="text-xl font-bold tracking-tight text-text-primary font-serif-display">
              c7<span className="text-sienna">xai</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-mono text-text-muted mt-0.5 leading-tight">
              The Truth<br />About Money
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Calculators dropdown */}
            <div className="relative"
              onMouseEnter={() => setCalcDropdownOpen(true)}
              onMouseLeave={() => setCalcDropdownOpen(false)}
            >
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  CALCULATOR_LINKS.some(l => isActive(l.href))
                    ? "text-sienna"
                    : "text-text-secondary hover:text-sienna"
                }`}
              >
                Calculators
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {calcDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-border rounded-xl shadow-lg py-2 max-h-[70vh] overflow-y-auto">
                  {CALCULATOR_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`block px-4 py-1.5 text-sm transition-colors ${
                        isActive(href)
                          ? "text-sienna bg-sienna-dim font-medium"
                          : "text-text-secondary hover:text-sienna hover:bg-surface-hover"
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.filter(l => l.href !== "/").map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(href)
                    ? "text-sienna bg-sienna-dim"
                    : "text-text-secondary hover:text-sienna hover:bg-surface-hover"
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="border-l border-border pl-3 ml-1">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -mr-2 text-text-secondary hover:text-sienna transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-white/98 backdrop-blur-md max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              <div className="text-[10px] font-mono font-semibold text-text-muted uppercase tracking-wider px-3 py-1">
                Calculators
              </div>
              {CALCULATOR_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isActive(href)
                      ? "text-sienna bg-sienna-dim font-medium"
                      : "text-text-secondary hover:text-sienna hover:bg-surface-hover"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <div className="px-3 py-1.5">
                <span className="text-[10px] font-mono font-semibold text-text-muted uppercase tracking-wider">Language</span>
                <div className="mt-1">
                  <LanguageSwitcher />
                </div>
              </div>
              <div className="border-t border-border my-2" />
              {NAV_LINKS.filter(l => l.href !== "/").map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isActive(href)
                      ? "text-sienna bg-sienna-dim font-medium"
                      : "text-text-secondary hover:text-sienna hover:bg-surface-hover"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}