import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { calculatorRegistry } from "@/lib/calculator-registry";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";

// Non-calculator page components (lazy-ish imports to keep bundle reasonable)
import MethodologyPage from "../../methodology/page";
import ComparePage from "../../compare/page";
import TruthIndexPage from "../../truth-index/page";
import EulaPage from "../../eula/page";
import PrivacyPage from "../../privacy/page";
import TermsPage from "../../terms/page";

// Non-calculator page metadata
const NON_CALC_META: Record<string, Metadata> = {
  methodology: {
    title: "Methodology — How c7xai Calculates Truth | c7xai",
    description:
      "Our formulas, data sources, and assumptions. Every number on c7xai is transparent, verifiable, and runs entirely in your browser.",
  },
  compare: {
    title: "Compare Returns — SIP vs FD vs PPF vs Gold vs Real Estate | c7xai",
    description:
      "Side-by-side comparison of ₹10,000/month across SIP, FD, PPF, Gold, and Real Estate. Real returns after inflation and tax.",
  },
  "truth-index": {
    title: "Truth Index — Financial Lies Exposed | c7xai",
    description:
      "The real numbers behind common financial claims. Every calculator on c7xai shows the truth after inflation and tax.",
  },
  eula: {
    title: "End User License Agreement — c7xai",
    description: "End User License Agreement for c7xai financial calculators.",
  },
  privacy: {
    title: "Privacy Policy — c7xai",
    description:
      "Privacy policy for c7xai financial calculators. No PII collected, all computation client-side.",
  },
  terms: {
    title: "Terms of Service — c7xai",
    description: "Terms of Service for c7xai financial calculators.",
  },
};

// Non-calculator page components (slug → component)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NON_CALC_PAGES: Record<string, React.ComponentType<any>> = {
  methodology: MethodologyPage,
  compare: ComparePage,
  "truth-index": TruthIndexPage,
  eula: EulaPage,
  privacy: PrivacyPage,
  terms: TermsPage,
};

export function generateStaticParams() {
  const locales = routing.locales.filter((l) => l !== routing.defaultLocale);
  const calcSlugs = Object.keys(calculatorRegistry);
  const nonCalcSlugs = Object.keys(NON_CALC_PAGES);
  const allSlugs = [...calcSlugs, ...nonCalcSlugs];
  const params: { locale: string; slug: string[] }[] = [];
  for (const locale of locales) {
    for (const slug of allSlugs) {
      params.push({ locale, slug: [slug] });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");

  // Calculator pages (match full path like "sip-simulator")
  const calc = calculatorRegistry[path];
  if (calc) {
    return generateCalculatorMetadata(calc.config);
  }

  // Non-calculator pages (match first segment for multi-segment paths too)
  const firstSegment = slug[0];
  const meta = NON_CALC_META[firstSegment];
  if (meta) return meta;

  return {};
}

export default async function LocaleSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const path = slug.join("/");

  // Calculator pages
  const calc = calculatorRegistry[path];
  if (calc) {
    const { config, Component } = calc;
    return (
      <CalculatorPageShell config={config}>
        <Component />
      </CalculatorPageShell>
    );
  }

  // Non-calculator pages (single-segment)
  const firstSegment = slug[0];
  const NonCalcPage = NON_CALC_PAGES[firstSegment];
  if (NonCalcPage) {
    return <NonCalcPage />;
  }

  // Multi-segment paths that don't match calculators or non-calc pages
  notFound();
}