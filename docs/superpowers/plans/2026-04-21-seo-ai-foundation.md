# SEO/AI Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the site from a single-page tab-switcher to individual calculator pages with unique URLs, per-page SEO metadata, JSON-LD structured data, llms.txt/llms-full.txt for AI agent ingestion, sitemap, and robots.txt.

**Architecture:** Each calculator gets its own route (`/sip-simulator`, `/emi-analyzer`, etc.) with `generateMetadata` for unique title/description/OG tags and JSON-LD structured data (FAQPage + HowTo + WebApplication schemas). A shared `CalculatorPageShell` component wraps each calculator with breadcrumbs, metadata, and structured data. The homepage switches from tabs to a card grid. SEO infrastructure includes `llms.txt`, `llms-full.txt`, `sitemap.xml`, and `robots.txt` route handlers. Calculator config JSON files in `src/content/calculators/` store metadata and FAQ data separately from code.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript

**Build Order:** This is Sub-Project 1 of 3. Sub-Project 2 (Blog) and Sub-Project 3 (CMS) depend on this foundation.

---

## File Structure

### New files to create:

```
src/
├── content/
│   └── calculators/
│       ├── sip.json
│       ├── emi.json
│       ├── tax.json
│       ├── accum.json
│       ├── fd.json
│       ├── swp.json
│       ├── fire.json
│       ├── ctc.json
│       ├── nps.json
│       └── goal.json
├── lib/
│   └── seo.ts
├── components/
│   └── shared/
│       └── calculator-page-shell.tsx
├── app/
│   ├── sip-simulator/page.tsx
│   ├── emi-analyzer/page.tsx
│   ├── tax-sandbox/page.tsx
│   ├── accumulation-calculator/page.tsx
│   ├── fd-comparator/page.tsx
│   ├── swp-stress-test/page.tsx
│   ├── fire-matrix/page.tsx
│   ├── ctc-optimizer/page.tsx
│   ├── nps-modeler/page.tsx
│   ├── goal-planner/page.tsx
│   ├── llms.txt/route.ts
│   ├── llms-full.txt/route.ts
│   ├── sitemap.ts
│   └── robots.ts
```

### Existing files to modify:

- `src/app/page.tsx` — Replace tab-switcher with calculator card grid
- `src/app/layout.tsx` — Add site-wide WebApplication JSON-LD

---

### Task 1: Calculator Config JSON Files

**Files:**
- Create: `src/content/calculators/sip.json`
- Create: `src/content/calculators/emi.json`
- Create: `src/content/calculators/tax.json`
- Create: `src/content/calculators/accum.json`
- Create: `src/content/calculators/fd.json`
- Create: `src/content/calculators/swp.json`
- Create: `src/content/calculators/fire.json`
- Create: `src/content/calculators/ctc.json`
- Create: `src/content/calculators/nps.json`
- Create: `src/content/calculators/goal.json`

These JSON files store per-calculator metadata: route slug, display name, meta title, meta description, one-line description, FAQ entries, and HowTo steps. The `generateMetadata` function on each page reads from these files at build time.

- [ ] **Step 1: Create `src/content/calculators/sip.json`**

```json
{
  "id": "sip",
  "slug": "sip-simulator",
  "name": "SIP Simulator",
  "metaTitle": "SIP Simulator — Real Returns Calculator | Financial Simulators",
  "metaDescription": "See what your SIP actually earns after inflation and tax. Client-side, no PII, no signup.",
  "shortDescription": "See actual returns after inflation and tax",
  "faq": [
    {
      "question": "How much will my SIP grow in 20 years?",
      "answer": "A ₹10,000/month SIP at 12% for 20 years grows to approximately ₹1.02 crore nominally, but after 6% inflation, the real value is about ₹30.5 lakh. After LTCG tax, you keep even less."
    },
    {
      "question": "What is real return vs nominal return?",
      "answer": "Nominal return is what your investment grows to in absolute numbers. Real return adjusts for inflation — what your money can actually buy in the future. A 12% nominal return with 6% inflation is roughly a 5.7% real return."
    },
    {
      "question": "How does LTCG tax affect SIP returns?",
      "answer": "Long-Term Capital Gains tax at 12.5% applies to equity mutual fund gains above ₹1.25 lakh per year. This can reduce your effective returns by 0.5-1% annually depending on your holding period and gain size."
    },
    {
      "question": "Should I step up my SIP every year?",
      "answer": "A 10% annual step-up on a ₹10,000 SIP can increase your final corpus by 40-60% over 20 years. Step-up SIPs work because they match your likely income growth with higher investments."
    }
  ],
  "howToSteps": [
    { "name": "Enter monthly investment", "text": "Set your monthly SIP amount in the slider" },
    { "name": "Set expected return rate", "text": "Adjust the expected annual return (default: 12% for NIFTY)" },
    { "name": "Adjust inflation", "text": "Set the inflation rate to see real vs nominal returns" },
    { "name": "See real vs nominal returns", "text": "Compare what your SIP grows to vs what it's actually worth after inflation" }
  ]
}
```

- [ ] **Step 2: Create the remaining 9 calculator config files**

Create `src/content/calculators/emi.json`:

```json
{
  "id": "emi",
  "slug": "emi-analyzer",
  "name": "EMI Analyzer",
  "metaTitle": "EMI Analyzer — Real Cost of Your Loan | Financial Simulators",
  "metaDescription": "Compare loan EMIs across tenures. See total interest, real cost after inflation, and prepayment impact. Client-side, no PII.",
  "shortDescription": "Compare loan EMIs with real cost",
  "faq": [
    {
      "question": "How much interest do I pay on a home loan?",
      "answer": "On a ₹50L home loan at 8.5% for 20 years, you pay approximately ₹54.7L in interest — more than the principal. The real cost after inflation is lower, but still significant."
    },
    {
      "question": "Should I choose a shorter or longer loan tenure?",
      "answer": "Shorter tenures have higher EMIs but much less total interest. A 15-year loan at 8.5% saves roughly ₹20L in interest vs a 25-year loan on the same amount."
    },
    {
      "question": "How does prepayment reduce my loan cost?",
      "answer": "A single prepayment of ₹5L on a ₹50L loan in year 5 can reduce your total interest by ₹12-15L and shorten the loan by 3-4 years."
    }
  ],
  "howToSteps": [
    { "name": "Enter loan amount", "text": "Set the principal amount you want to borrow" },
    { "name": "Set interest rate and tenure", "text": "Adjust the rate and tenure to see different EMI options" },
    { "name": "Compare total cost", "text": "See total interest paid vs principal across tenures" },
    { "name": "Add prepayments", "text": "Toggle prepayment to see how it reduces total cost" }
  ]
}
```

Create `src/content/calculators/tax.json`:

```json
{
  "id": "tax",
  "slug": "tax-sandbox",
  "name": "Tax Sandbox",
  "metaTitle": "Tax Sandbox — Old vs New Regime Comparison | Financial Simulators",
  "metaDescription": "Compare old vs new tax regime side by side. Includes HRA, 80C/80D, LTCG/STCG, surcharge and cess. Client-side, no PII.",
  "shortDescription": "Old vs New regime, side by side",
  "faq": [
    {
      "question": "Which tax regime is better for me?",
      "answer": "It depends on your income and deductions. The new regime has lower rates but fewer deductions. If you claim more than ₹3.75L in deductions, the old regime is usually better. Use the Tax Sandbox to compare with your actual numbers."
    },
    {
      "question": "What deductions are available under the old regime?",
      "answer": "Common deductions include 80C (₹1.5L for PPF, ELSS, home loan principal), 80D (health insurance), HRA exemption, home loan interest (₹2L), and NPS contribution (₹50K additional)."
    },
    {
      "question": "How does the new tax regime work in Budget 2026?",
      "answer": "The new regime raised the basic exemption limit to ₹4L and widened the 5% slab. For most salaried individuals, this means roughly ₹17,000/year in savings compared to the previous new regime."
    }
  ],
  "howToSteps": [
    { "name": "Enter your income", "text": "Set your gross annual income and salary structure" },
    { "name": "Add deductions", "text": "Enter HRA, 80C, 80D, home loan interest and other deductions" },
    { "name": "Compare regimes", "text": "See old vs new regime tax side by side" },
    { "name": "Optimize", "text": "Adjust deductions to find which regime saves you more" }
  ]
}
```

Create `src/content/calculators/accum.json`:

```json
{
  "id": "accum",
  "slug": "accumulation-calculator",
  "name": "Accumulation Calculator",
  "metaTitle": "Accumulation Calculator — Lump Sum vs SIP | Financial Simulators",
  "metaDescription": "Compare lump sum investment vs SIP over time. See which strategy works better for your timeline. Client-side, no PII.",
  "shortDescription": "Lump sum vs SIP comparison",
  "faq": [
    {
      "question": "Is lump sum better than SIP?",
      "answer": "Lump sum wins more often in back-tests because money is invested longer. But SIPs are psychologically easier and reduce timing risk. Over 10+ years, the difference narrows. Use this calculator to compare with your actual numbers."
    },
    {
      "question": "What if I invest a windfall as lump sum?",
      "answer": "A ₹10L lump sum at 12% grows to ₹31L in 10 years. The same ₹10L as SIP over 10 years (₹8,333/month) grows to ₹17.3L. But you'd only invest ₹10L total via SIP vs ₹10L upfront via lump sum."
    }
  ],
  "howToSteps": [
    { "name": "Set investment amount", "text": "Enter the lump sum or monthly SIP amount" },
    { "name": "Choose time horizon", "text": "Set the number of years for your investment" },
    { "name": "Compare results", "text": "See lump sum vs SIP growth side by side" },
    { "name": "Adjust returns", "text": "Change expected return rate to see different scenarios" }
  ]
}
```

Create `src/content/calculators/fd.json`:

```json
{
  "id": "fd",
  "slug": "fd-comparator",
  "name": "FD Comparator",
  "metaTitle": "FD Comparator — Real Fixed Deposit Returns | Financial Simulators",
  "metaDescription": "See real FD returns after tax and inflation. Compare banks, tenures, and compounding. Client-side, no PII.",
  "shortDescription": "Real FD returns after tax and inflation",
  "faq": [
    {
      "question": "How much tax do I pay on FD interest?",
      "answer": "FD interest is taxed at your income tax slab rate. If you're in the 30% slab, a 7% FD gives only 4.9% post-tax. After 6% inflation, your real return is negative."
    },
    {
      "question": "Is FD better than mutual funds?",
      "answer": "FDs give guaranteed returns but post-tax and post-inflation returns are often negative. Equity mutual funds have risk but historically deliver 10-12% long-term returns, which are positive even after tax and inflation."
    }
  ],
  "howToSteps": [
    { "name": "Enter FD amount and rate", "text": "Set your deposit amount and the offered interest rate" },
    { "name": "Set tenure and tax slab", "text": "Choose the FD duration and your tax bracket" },
    { "name": "See real returns", "text": "View post-tax and post-inflation returns" },
    { "name": "Compare options", "text": "Compare different FD rates, tenures, and compounding frequencies" }
  ]
}
```

Create `src/content/calculators/swp.json`:

```json
{
  "id": "swp",
  "slug": "swp-stress-test",
  "name": "SWP Stress Test",
  "metaTitle": "SWP Stress Test — Will Your Corpus Survive? | Financial Simulators",
  "metaDescription": "Test if your retirement corpus survives market crashes with Systematic Withdrawal Plans. Monte Carlo stress testing. Client-side, no PII.",
  "shortDescription": "Will your corpus survive a crash?",
  "faq": [
    {
      "question": "How long will my retirement corpus last?",
      "answer": "A ₹2 crore corpus with ₹1L/month SWP at 8% returns lasts approximately 25 years. But a 30% market crash in year 1 can reduce that to 17 years. This calculator stress-tests your corpus against crashes."
    },
    {
      "question": "What is sequence-of-returns risk?",
      "answer": "If the market crashes early in your retirement, you're selling more units at lower prices. This can wipe out 40% of your corpus. A 2008-style crash in year 1 of retirement can cut your corpus life in half."
    }
  ],
  "howToSteps": [
    { "name": "Set your corpus", "text": "Enter your total retirement corpus amount" },
    { "name": "Set monthly withdrawal", "text": "Enter your monthly SWP amount" },
    { "name": "Stress test", "text": "See how crashes at different points affect your corpus" },
    { "name": "Adjust assumptions", "text": "Change return rate, inflation, and crash scenarios" }
  ]
}
```

Create `src/content/calculators/fire.json`:

```json
{
  "id": "fire",
  "slug": "fire-matrix",
  "name": "FIRE Matrix",
  "metaTitle": "FIRE Calculator — When Can You Retire? | Financial Simulators",
  "metaDescription": "Calculate your FIRE number and retirement timeline. See how savings rate affects retirement age. Client-side, no PII.",
  "shortDescription": "When can you retire?",
  "faq": [
    {
      "question": "What is the FIRE number?",
      "answer": "Your FIRE number is 25x your annual expenses. If you spend ₹10L/year, you need ₹2.5 crore invested to be financially independent. This calculator shows how your savings rate affects when you reach that number."
    },
    {
      "question": "How does the 4% rule work in India?",
      "answer": "The 4% rule says you can withdraw 4% of your corpus in the first year of retirement, adjusted for inflation each year. In India with higher inflation (6%), you may need a 3% withdrawal rate instead, meaning 33x annual expenses."
    }
  ],
  "howToSteps": [
    { "name": "Enter current savings and income", "text": "Set your monthly savings and current invested corpus" },
    { "name": "Set monthly expenses", "text": "Enter your expected monthly expenses in retirement" },
    { "name": "See retirement timeline", "text": "View when you'll hit your FIRE number" },
    { "name": "Adjust assumptions", "text": "Change return rate and inflation to see different scenarios" }
  ]
}
```

Create `src/content/calculators/ctc.json`:

```json
{
  "id": "ctc",
  "slug": "ctc-optimizer",
  "name": "CTC Optimizer",
  "metaTitle": "CTC Optimizer — Maximize Your In-Hand Salary | Financial Simulators",
  "metaDescription": "See how much of your CTC you actually take home. Optimize salary structure for maximum in-hand pay. Client-side, no PII.",
  "shortDescription": "Maximize your in-hand salary",
  "faq": [
    {
      "question": "How much of my CTC do I actually get?",
      "answer": "A ₹15L CTC typically gives ₹9.5-11L in hand depending on your salary structure. EPF, gratuity, and taxes take 27-37% off the top. This calculator shows the exact breakdown."
    },
    {
      "question": "How can I optimize my CTC structure?",
      "answer": "Restructuring allowances (HRA, transport, food) can increase in-hand pay without changing your CTC. Some companies allow flexible benefit plans that reduce your tax burden."
    }
  ],
  "howToSteps": [
    { "name": "Enter your CTC", "text": "Set your total cost to company amount" },
    { "name": "Review salary breakdown", "text": "See how your CTC splits into basic, HRA, allowances, and deductions" },
    { "name": "Compare structures", "text": "See current vs optimized salary structure" },
    { "name": "See in-hand difference", "text": "View the monthly take-home difference" }
  ]
}
```

Create `src/content/calculators/nps.json`:

```json
{
  "id": "nps",
  "slug": "nps-modeler",
  "name": "NPS Modeler",
  "metaTitle": "NPS Modeler — Project Your Pension & Corpus | Financial Simulators",
  "metaDescription": "Project your NPS corpus at retirement. See pension amount, lump sum, and annuity options. Client-side, no PII.",
  "shortDescription": "Project your pension and corpus",
  "faq": [
    {
      "question": "How much pension will NPS give me?",
      "answer": "A ₹10K/month NPS contribution for 30 years at 10% returns builds approximately ₹2.3 crore. At a 6% annuity rate, that's roughly ₹11.5K/month pension. But 40% must be used for annuity, and you can withdraw only 60% as lump sum."
    },
    {
      "question": "Is NPS better than PPF or mutual funds?",
      "answer": "NPS has the lowest expense ratio (0.01-0.03%) and extra ₹50K deduction under 80CCD(1B). But NPS mandates 40% annuity at retirement. ELSS mutual funds offer more flexibility and similar returns."
    }
  ],
  "howToSteps": [
    { "name": "Set monthly contribution", "text": "Enter your monthly NPS contribution amount" },
    { "name": "Choose asset allocation", "text": "Set equity and debt allocation percentages" },
    { "name": "See projected corpus", "text": "View your total NPS corpus at retirement" },
    { "name": "Explore pension options", "text": "See monthly pension and lump sum from different annuity rates" }
  ]
}
```

Create `src/content/calculators/goal.json`:

```json
{
  "id": "goal",
  "slug": "goal-planner",
  "name": "Goal Planner",
  "metaTitle": "Goal Planner — SIP Amount Per Financial Goal | Financial Simulators",
  "metaDescription": "Calculate the monthly SIP needed for each financial goal. Add multiple goals, adjust timelines. Client-side, no PII.",
  "shortDescription": "Monthly SIP needed per goal",
  "faq": [
    {
      "question": "How much SIP do I need for ₹1 crore?",
      "answer": "At 12% returns, you need approximately ₹10,000/month for 20 years to reach ₹1 crore. At 10%, you need ₹13,200/month. The Goal Planner lets you set multiple goals with different timelines."
    },
    {
      "question": "How do I plan for multiple goals?",
      "answer": "Add each goal separately — house down payment, children's education, retirement — with its own target amount and timeline. The planner shows the monthly SIP needed for each goal independently."
    }
  ],
  "howToSteps": [
    { "name": "Add a goal", "text": "Click '+ Add Goal' and enter target amount and years" },
    { "name": "Set expected returns", "text": "Adjust the expected return rate for each goal" },
    { "name": "See monthly SIP needed", "text": "View how much to invest monthly for each goal" },
    { "name": "Compare scenarios", "text": "Adjust timelines and rates to see different outcomes" }
  ]
}
```

- [ ] **Step 3: Verify all config files are valid JSON**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && for f in src/content/calculators/*.json; do node -e "JSON.parse(require('fs').readFileSync('$f','utf8')); console.log('$f: OK')"; done
```

Expected: All 10 files print `OK`

- [ ] **Step 4: Commit calculator configs**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/content/calculators/ && git commit -m "feat: add calculator config JSON files for SEO metadata and FAQ data"
```

---

### Task 2: SEO Library — JSON-LD and Metadata Generators

**Files:**
- Create: `src/lib/seo.ts`

This module provides functions that generate JSON-LD structured data and page metadata from calculator config JSON. Each calculator page imports these functions in its `generateMetadata` export.

- [ ] **Step 1: Create `src/lib/seo.ts`**

```typescript
import type { Metadata } from "next";

const SITE_URL = "https://financialsimulators.in";
const SITE_NAME = "Financial Simulators";

export interface CalculatorConfig {
  id: string;
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  faq: { question: string; answer: string }[];
  howToSteps: { name: string; text: string }[];
}

export function generateCalculatorMetadata(config: CalculatorConfig): Metadata {
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: `${SITE_URL}/${config.slug}`,
      siteName: SITE_NAME,
      type: "website",
    },
    alternates: {
      canonical: `/${config.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateCalculatorJsonLd(config: CalculatorConfig) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${config.name}`,
    step: config.howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.name,
    description: config.metaDescription,
    url: `${SITE_URL}/${config.slug}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  return [faqSchema, howToSchema, webAppSchema];
}

export function generateSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    description:
      "Real-return financial calculators for Indian investors. Zero PII, zero tracking, all math runs client-side.",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npx tsc --noEmit 2>&1 | tail -5
```

Expected: No new errors (existing calculator component errors are OK)

- [ ] **Step 3: Commit SEO library**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/lib/seo.ts && git commit -m "feat: add SEO library with JSON-LD generators and metadata helpers"
```

---

### Task 3: CalculatorPageShell Component

**Files:**
- Create: `src/components/shared/calculator-page-shell.tsx`

This component wraps each calculator with breadcrumbs, JSON-LD injection, and a "Back to all calculators" link. Calculator components render inside it unchanged.

- [ ] **Step 1: Create `src/components/shared/calculator-page-shell.tsx`**

```tsx
import Link from "next/link";
import type { CalculatorConfig } from "@/lib/seo";
import { generateCalculatorJsonLd } from "@/lib/seo";

interface Props {
  config: CalculatorConfig;
  children: React.ReactNode;
}

export function CalculatorPageShell({ config, children }: Props) {
  const schemas = generateCalculatorJsonLd(config);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Content is server-generated from our own config files — not user input.
          // This is the standard Next.js pattern for injecting structured data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto px-4 pt-4">
          <nav className="flex items-center gap-2 text-xs text-text-secondary font-mono mb-2">
            <Link href="/" className="hover:text-gain transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary">{config.name}</span>
          </nav>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 py-4">{children}</div>
        <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-xs text-text-secondary border-t border-border mt-auto">
          <div className="flex items-center justify-between">
            <span>Zero PII. Zero tracking. Computed entirely client-side.</span>
            <Link href="/" className="hover:text-gain transition-colors font-mono">
              ← All calculators
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npx tsc --noEmit 2>&1 | tail -5
```

Expected: No new errors

- [ ] **Step 3: Commit CalculatorPageShell**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/components/shared/calculator-page-shell.tsx && git commit -m "feat: add CalculatorPageShell with JSON-LD and breadcrumbs"
```

---

### Task 4: Individual Calculator Pages (10 routes)

**Files:**
- Create: `src/app/sip-simulator/page.tsx`
- Create: `src/app/emi-analyzer/page.tsx`
- Create: `src/app/tax-sandbox/page.tsx`
- Create: `src/app/accumulation-calculator/page.tsx`
- Create: `src/app/fd-comparator/page.tsx`
- Create: `src/app/swp-stress-test/page.tsx`
- Create: `src/app/fire-matrix/page.tsx`
- Create: `src/app/ctc-optimizer/page.tsx`
- Create: `src/app/nps-modeler/page.tsx`
- Create: `src/app/goal-planner/page.tsx`

Each page follows the same pattern: import the config JSON, import the calculator component, export `metadata` (using `generateCalculatorMetadata`), and render inside `CalculatorPageShell`.

- [ ] **Step 1: Create `src/app/sip-simulator/page.tsx`**

```tsx
import { Metadata } from "next";
import config from "@/content/calculators/sip.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { SIPCalculator } from "@/components/sip/sip-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function SIPSimulatorPage() {
  return (
    <CalculatorPageShell config={config}>
      <SIPCalculator />
    </CalculatorPageShell>
  );
}
```

- [ ] **Step 2: Create `src/app/emi-analyzer/page.tsx`**

```tsx
import { Metadata } from "next";
import config from "@/content/calculators/emi.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { EMICalculator } from "@/components/emi/emi-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function EMIAnalyzerPage() {
  return (
    <CalculatorPageShell config={config}>
      <EMICalculator />
    </CalculatorPageShell>
  );
}
```

- [ ] **Step 3: Create `src/app/tax-sandbox/page.tsx`**

```tsx
import { Metadata } from "next";
import config from "@/content/calculators/tax.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { TaxCalculator } from "@/components/tax/tax-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function TaxSandboxPage() {
  return (
    <CalculatorPageShell config={config}>
      <TaxCalculator />
    </CalculatorPageShell>
  );
}
```

- [ ] **Step 4: Create `src/app/accumulation-calculator/page.tsx`**

```tsx
import { Metadata } from "next";
import config from "@/content/calculators/accum.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { AccumCalculator } from "@/components/accum/accum-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function AccumulationCalculatorPage() {
  return (
    <CalculatorPageShell config={config}>
      <AccumCalculator />
    </CalculatorPageShell>
  );
}
```

- [ ] **Step 5: Create `src/app/fd-comparator/page.tsx`**

```tsx
import { Metadata } from "next";
import config from "@/content/calculators/fd.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { FDCalculator } from "@/components/fd/fd-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function FDComparatorPage() {
  return (
    <CalculatorPageShell config={config}>
      <FDCalculator />
    </CalculatorPageShell>
  );
}
```

- [ ] **Step 6: Create `src/app/swp-stress-test/page.tsx`**

```tsx
import { Metadata } from "next";
import config from "@/content/calculators/swp.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { SWPCalculator } from "@/components/swp/swp-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function SWPStressTestPage() {
  return (
    <CalculatorPageShell config={config}>
      <SWPCalculator />
    </CalculatorPageShell>
  );
}
```

- [ ] **Step 7: Create `src/app/fire-matrix/page.tsx`**

```tsx
import { Metadata } from "next";
import config from "@/content/calculators/fire.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { FIRECalculator } from "@/components/fire/fire-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function FIREMatrixPage() {
  return (
    <CalculatorPageShell config={config}>
      <FIRECalculator />
    </CalculatorPageShell>
  );
}
```

- [ ] **Step 8: Create `src/app/ctc-optimizer/page.tsx`**

```tsx
import { Metadata } from "next";
import config from "@/content/calculators/ctc.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { CTCCalculator } from "@/components/ctc/ctc-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function CTCOptimizerPage() {
  return (
    <CalculatorPageShell config={config}>
      <CTCCalculator />
    </CalculatorPageShell>
  );
}
```

- [ ] **Step 9: Create `src/app/nps-modeler/page.tsx`**

```tsx
import { Metadata } from "next";
import config from "@/content/calculators/nps.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { NPSCalculator } from "@/components/nps/nps-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function NPSModelerPage() {
  return (
    <CalculatorPageShell config={config}>
      <NPSCalculator />
    </CalculatorPageShell>
  );
}
```

- [ ] **Step 10: Create `src/app/goal-planner/page.tsx`**

```tsx
import { Metadata } from "next";
import config from "@/content/calculators/goal.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { GoalCalculator } from "@/components/goal/goal-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function GoalPlannerPage() {
  return (
    <CalculatorPageShell config={config}>
      <GoalCalculator />
    </CalculatorPageShell>
  );
}
```

- [ ] **Step 11: Verify dev server starts and pages render**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm run dev
```

Open browser to `http://localhost:3000/sip-simulator` and verify:
- Calculator renders correctly
- Page title shows "SIP Simulator — Real Returns Calculator | Financial Simulators"
- Breadcrumb navigation shows "Home / SIP Simulator"
- View page source and verify JSON-LD scripts are present

Test at least 2 more routes: `/emi-analyzer` and `/tax-sandbox`.

- [ ] **Step 12: Commit calculator pages**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/app/sip-simulator/ src/app/emi-analyzer/ src/app/tax-sandbox/ src/app/accumulation-calculator/ src/app/fd-comparator/ src/app/swp-stress-test/ src/app/fire-matrix/ src/app/ctc-optimizer/ src/app/nps-modeler/ src/app/goal-planner/ && git commit -m "feat: add 10 dedicated calculator pages with SEO metadata and JSON-LD"
```

---

### Task 5: Homepage Redesign — Calculator Card Grid

**Files:**
- Modify: `src/app/page.tsx`

Replace the single-page tab-switcher with a card grid linking to each calculator's dedicated page. The homepage gets site-wide description and the anti-marketing voice.

- [ ] **Step 1: Rewrite `src/app/page.tsx` as calculator card grid**

Replace the entire content of `src/app/page.tsx` with:

```tsx
import Link from "next/link";
import type { Metadata } from "next";

const CALCULATORS = [
  {
    id: "sip",
    name: "SIP Simulator",
    slug: "sip-simulator",
    description: "See actual returns after inflation and tax",
    tag: "Popular",
  },
  {
    id: "emi",
    name: "EMI Analyzer",
    slug: "emi-analyzer",
    description: "Compare loan EMIs with real cost",
  },
  {
    id: "tax",
    name: "Tax Sandbox",
    slug: "tax-sandbox",
    description: "Old vs New regime, side by side",
  },
  {
    id: "accum",
    name: "Accumulator",
    slug: "accumulation-calculator",
    description: "Lump sum vs SIP comparison",
  },
  {
    id: "fd",
    name: "FD Comparator",
    slug: "fd-comparator",
    description: "Real FD returns after tax and inflation",
  },
  {
    id: "swp",
    name: "SWP Stress Test",
    slug: "swp-stress-test",
    description: "Will your corpus survive a crash?",
  },
  {
    id: "fire",
    name: "FIRE Matrix",
    slug: "fire-matrix",
    description: "When can you retire?",
  },
  {
    id: "ctc",
    name: "CTC Optimizer",
    slug: "ctc-optimizer",
    description: "Maximize your in-hand salary",
  },
  {
    id: "nps",
    name: "NPS Modeler",
    slug: "nps-modeler",
    description: "Project your pension and corpus",
  },
  {
    id: "goal",
    name: "Goal Planner",
    slug: "goal-planner",
    description: "Monthly SIP needed per goal",
  },
] as const;

export const metadata: Metadata = {
  title: "Financial Simulators — Real Returns, No Marketing",
  description:
    "Inflation-adjusted, tax-aware financial calculators for Indian investors. Zero PII, zero tracking, all math runs in your browser.",
  openGraph: {
    title: "Financial Simulators — Real Returns, No Marketing",
    description:
      "Inflation-adjusted, tax-aware financial calculators for Indian investors. Zero PII, zero tracking, all math runs in your browser.",
    url: "https://financialsimulators.in",
    siteName: "Financial Simulators",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center">
      <header className="w-full max-w-7xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Financial Simulators
        </h1>
        <p className="text-lg text-text-secondary mt-2">
          Real returns. No marketing.
        </p>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl">
          Inflation-adjusted, tax-aware calculators for Indian investors. No
          signups, no tracking, no product pushing. All math runs in your
          browser.
        </p>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.id}
              href={`/${calc.slug}`}
              className="group flex flex-col gap-2 p-5 bg-surface rounded-lg border border-border hover:border-gain/40 hover:bg-surface/80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold group-hover:text-gain transition-colors">
                  {calc.name}
                </h2>
                {calc.tag && (
                  <span className="text-[10px] uppercase tracking-wider bg-gain/20 text-gain px-2 py-0.5 rounded font-mono">
                    {calc.tag}
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary">
                {calc.description}
              </p>
              <span className="text-xs font-mono text-gain opacity-0 group-hover:opacity-100 transition-opacity">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-xs text-text-secondary border-t border-border mt-auto">
        Zero PII. Zero tracking. Computed entirely client-side. Macro defaults:
        NIFTY 12% μ / 18% σ, 6% inflation, LTCG 12.5% above ₹1.25L.
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Verify homepage renders as card grid**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm run dev
```

Open `http://localhost:3000/` and verify:
- Card grid renders with all 10 calculators
- Each card links to its dedicated page (e.g., `/sip-simulator`)
- Hover effects work (border turns green, "Open →" appears)
- Footer still shows privacy statement
- Tab-switcher is completely removed

- [ ] **Step 3: Commit homepage redesign**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/app/page.tsx && git commit -m "feat: replace tab-switcher with calculator card grid on homepage"
```

---

### Task 6: Update Root Layout with Site-Wide JSON-LD

**Files:**
- Modify: `src/app/layout.tsx`

Add the site-wide `WebApplication` JSON-LD to the root layout so it appears on every page.

- [ ] **Step 1: Update `src/app/layout.tsx`**

Replace the entire content of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { generateSiteJsonLd } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIP Simulator — Real Returns, No Marketing",
  description:
    "Inflation-adjusted, tax-aware financial calculators for Indian investors. Zero PII, zero tracking, all math runs in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSchema = generateSiteJsonLd();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          // Content is server-generated from our own config — not user input.
          // Standard Next.js pattern for structured data injection.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-ink text-text-primary">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify layout renders correctly**

Visit `http://localhost:3000/` and verify the page still renders. View page source and confirm the `WebApplication` JSON-LD is in the `<head>`.

- [ ] **Step 3: Commit layout update**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/app/layout.tsx && git commit -m "feat: add site-wide WebApplication JSON-LD to root layout"
```

---

### Task 7: robots.txt and sitemap.xml

**Files:**
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Create `src/app/robots.ts`**

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: "https://financialsimulators.in/sitemap.xml",
  };
}
```

- [ ] **Step 2: Create `src/app/sitemap.ts`**

```typescript
import { MetadataRoute } from "next";
import sipConfig from "@/content/calculators/sip.json";
import emiConfig from "@/content/calculators/emi.json";
import taxConfig from "@/content/calculators/tax.json";
import accumConfig from "@/content/calculators/accum.json";
import fdConfig from "@/content/calculators/fd.json";
import swpConfig from "@/content/calculators/swp.json";
import fireConfig from "@/content/calculators/fire.json";
import ctcConfig from "@/content/calculators/ctc.json";
import npsConfig from "@/content/calculators/nps.json";
import goalConfig from "@/content/calculators/goal.json";

const BASE_URL = "https://financialsimulators.in";

const calculatorConfigs = [
  sipConfig,
  emiConfig,
  taxConfig,
  accumConfig,
  fdConfig,
  swpConfig,
  fireConfig,
  ctcConfig,
  npsConfig,
  goalConfig,
];

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorPages: MetadataRoute.Sitemap = calculatorConfigs.map(
    (config) => ({
      url: `${BASE_URL}/${config.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...calculatorPages,
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
```

- [ ] **Step 3: Verify robots.txt and sitemap.xml**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm run dev
```

Visit `http://localhost:3000/robots.txt` and verify:
- Allows all crawlers for `/`
- Disallows `/admin`
- Points to sitemap

Visit `http://localhost:3000/sitemap.xml` and verify:
- Homepage is listed with priority 1
- All 10 calculator routes are listed
- `/blog` is listed

- [ ] **Step 4: Commit robots.txt and sitemap**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/app/robots.ts src/app/sitemap.ts && git commit -m "feat: add robots.txt and sitemap.xml route handlers"
```

---

### Task 8: llms.txt and llms-full.txt for AI Agent Ingestion

**Files:**
- Create: `src/app/llms.txt/route.ts`
- Create: `src/app/llms-full.txt/route.ts`

These route handlers serve markdown content for AI agents, following the emerging llms.txt standard.

- [ ] **Step 1: Create `src/app/llms.txt/route.ts`**

```typescript
import { NextResponse } from "next/server";
import sipConfig from "@/content/calculators/sip.json";
import emiConfig from "@/content/calculators/emi.json";
import taxConfig from "@/content/calculators/tax.json";
import accumConfig from "@/content/calculators/accum.json";
import fdConfig from "@/content/calculators/fd.json";
import swpConfig from "@/content/calculators/swp.json";
import fireConfig from "@/content/calculators/fire.json";
import ctcConfig from "@/content/calculators/ctc.json";
import npsConfig from "@/content/calculators/nps.json";
import goalConfig from "@/content/calculators/goal.json";

const calculatorConfigs = [
  sipConfig,
  emiConfig,
  taxConfig,
  accumConfig,
  fdConfig,
  swpConfig,
  fireConfig,
  ctcConfig,
  npsConfig,
  goalConfig,
];

export async function GET() {
  const calculatorLines = calculatorConfigs
    .map((c) => `- [${c.name}](/${c.slug}): ${c.shortDescription}`)
    .join("\n");

  const content = `# Financial Simulators

> Real-return financial calculators for Indian investors. Zero PII, zero tracking, all math runs client-side.

## Calculators
${calculatorLines}

## Blog
- [Blog Index](/blog): Financial stories for common Indians

## Use Cases
- "How much SIP do I need for ₹1 crore?" → /sip-simulator
- "Is old or new tax regime better?" → /tax-sandbox
- "Will my retirement fund last?" → /swp-stress-test
- "When can I retire?" → /fire-matrix
- "How much of my CTC do I actually keep?" → /ctc-optimizer
- "How much pension will NPS give me?" → /nps-modeler
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
```

- [ ] **Step 2: Create `src/app/llms-full.txt/route.ts`**

```typescript
import { NextResponse } from "next/server";
import sipConfig from "@/content/calculators/sip.json";
import emiConfig from "@/content/calculators/emi.json";
import taxConfig from "@/content/calculators/tax.json";
import accumConfig from "@/content/calculators/accum.json";
import fdConfig from "@/content/calculators/fd.json";
import swpConfig from "@/content/calculators/swp.json";
import fireConfig from "@/content/calculators/fire.json";
import ctcConfig from "@/content/calculators/ctc.json";
import npsConfig from "@/content/calculators/nps.json";
import goalConfig from "@/content/calculators/goal.json";

const calculatorConfigs = [
  sipConfig,
  emiConfig,
  taxConfig,
  accumConfig,
  fdConfig,
  swpConfig,
  fireConfig,
  ctcConfig,
  npsConfig,
  goalConfig,
];

function formatCalculatorFaqs(
  config: (typeof calculatorConfigs)[number]
): string {
  return config.faq
    .map((item) => `**Q: ${item.question}**\n${item.answer}`)
    .join("\n\n");
}

export async function GET() {
  const calculatorSections = calculatorConfigs
    .map(
      (c) => `## ${c.name}

URL: /${c.slug}
Description: ${c.metaDescription}

### Frequently Asked Questions
${formatCalculatorFaqs(c)}`
    )
    .join("\n\n---\n\n");

  const content = `# Financial Simulators — Full Content

> Real-return financial calculators for Indian investors. Zero PII, zero tracking, all math runs client-side.

${calculatorSections}

---

## Blog
- [Blog Index](/blog): Financial stories for common Indians
- Individual blog posts with full content are available at /blog/[slug]
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
```

- [ ] **Step 3: Verify llms.txt and llms-full.txt**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm run dev
```

Visit `http://localhost:3000/llms.txt` and verify:
- Lists all 10 calculators with links
- Includes blog section
- Includes use cases

Visit `http://localhost:3000/llms-full.txt` and verify:
- Contains full descriptions and FAQs for each calculator
- Formatted as readable markdown

- [ ] **Step 4: Commit llms.txt route handlers**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/app/llms.txt/ src/app/llms-full.txt/ && git commit -m "feat: add llms.txt and llms-full.txt route handlers for AI agent ingestion"
```

---

### Task 9: Build Verification and Integration Test

- [ ] **Step 1: Run full build to catch any errors**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm run build 2>&1 | tail -30
```

Expected: Build succeeds with no errors. All 10 calculator routes, sitemap, robots, llms.txt, and llms-full.txt should appear in the build output.

- [ ] **Step 2: Start dev server and manually test key routes**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm run dev
```

Test each route:
- `/` — Homepage with calculator card grid
- `/sip-simulator` — SIP calculator with JSON-LD and breadcrumbs
- `/emi-analyzer` — EMI calculator with JSON-LD
- `/tax-sandbox` — Tax calculator with JSON-LD
- `/robots.txt` — Correct robots content
- `/sitemap.xml` — All routes listed
- `/llms.txt` — AI agent summary
- `/llms-full.txt` — Full calculator content

- [ ] **Step 3: Check page metadata with view source**

Visit `/sip-simulator`, view page source, and verify:
- `<title>` matches the metaTitle from config
- `<meta name="description">` matches metaDescription from config
- Three JSON-LD scripts present (FAQPage, HowTo, WebApplication)
- Canonical URL is present
- OpenGraph tags are present

---

## Self-Review Checklist

- [ ] **Spec coverage**: Every section of Sub-Project 1 (SEO/AI Foundation) from the design spec is covered by a task
- [ ] **Placeholder scan**: No "TBD", "TODO", or vague steps — every step has complete code
- [ ] **Type consistency**: CalculatorConfig type in seo.ts matches the JSON structure in config files; component imports match actual file names
- [ ] **Build order**: This plan produces working, testable software before Blog and CMS sub-projects begin