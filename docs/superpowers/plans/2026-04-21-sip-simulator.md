# SIP Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an inflation-adjusted, tax-aware SIP Simulator with Monte Carlo volatility, stress testing, and split-panel UI for the Indian market.

**Architecture:** Client-side-only math engine (pure functions) feeding a debounced React state pipeline into a Recharts stacked-area chart with Monte Carlo confidence bands. Split-panel layout (40/60) with Ink & Ember dark theme.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Recharts, TypeScript, Geist Sans + Geist Mono

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install recharts, tailwind-merge, clsx**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm install recharts tailwind-merge clsx
```

- [ ] **Step 2: Verify installation**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && node -e "require('recharts'); require('tailwind-merge'); require('clsx'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add package.json package-lock.json && git commit -m "chore: add recharts, tailwind-merge, clsx"
```

---

### Task 2: Global Theme Setup (Ink & Ember)

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace globals.css with Ink & Ember theme tokens**

Replace entire content of `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme inline {
  --color-ink: #0a0f1a;
  --color-surface: #111827;
  --color-border: #1f2937;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-gain: #6ee7b7;
  --color-loss: #f87171;
  --color-warn: #fbbf24;
  --color-stress: #ef4444;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--color-ink);
  color: var(--color-text-primary);
  font-family: var(--font-sans), system-ui, sans-serif;
}

* {
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 2: Update layout.tsx metadata**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  description: "Inflation-adjusted, tax-aware SIP projection tool for Indian investors. Privacy-first, client-side computation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-text-primary">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/app/globals.css src/app/layout.tsx && git commit -m "feat: ink & ember theme tokens + layout metadata"
```

---

### Task 3: Types & Macro Context

**Files:**
- Create: `src/lib/calculators/sip/types.ts`
- Create: `src/lib/macro/context.ts`

- [ ] **Step 1: Create SIP types**

Create `src/lib/calculators/sip/types.ts`:

```typescript
export interface SIPInput {
  monthlySIP: number;
  lumpsum: number;
  returnRate: number;
  tenure: number;
  inflationRate: number;
  stepUpMode: "percentage" | "fixed";
  stepUpValue: number;
}

export interface YearlyDataPoint {
  year: number;
  invested: number;
  nominalCorpus: number;
  realCorpus: number;
  postTaxCorpus: number;
  stressCorpus?: number;
  p10?: number;
  p90?: number;
}

export interface SIPOutput {
  totalInvested: number;
  nominalCorpus: number;
  postTaxCorpus: number;
  realCorpus: number;
  stressCorpus?: number;
  ltcgTax: number;
  ltcgExempt: number;
  yearlyData: YearlyDataPoint[];
  monteCarloPaths: number[][];
}

export interface StressTestConfig {
  enabled: boolean;
  severity: 0.2 | 0.3;
  crashYears: number;
}

export type StepUpMode = "percentage" | "fixed";
```

- [ ] **Step 2: Create Macro Context**

Create `src/lib/macro/context.ts`:

```typescript
export const MACRO_CONTEXT = {
  niftyLongTermReturn: 0.12,
  niftyVolatility: 0.18,
  historicalInflation: 0.06,
  cpiInflation2026: 0.047,
  gdpBaseline: 0.065,
  ltcgRate: 0.125,
  ltcgExemption: 125000,
  rbiRateCycle: "easing" as const,
} as const;

export type MacroContext = typeof MACRO_CONTEXT;
```

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/lib/calculators/sip/types.ts src/lib/macro/context.ts && git commit -m "feat: SIP types + macro context constants"
```

---

### Task 4: SIP Engine (Compounding + Step-Up)

**Files:**
- Create: `src/lib/calculators/sip/step-up.ts`
- Create: `src/lib/calculators/sip/engine.ts`

- [ ] **Step 1: Create step-up logic**

Create `src/lib/calculators/sip/step-up.ts`:

```typescript
import type { StepUpMode } from "./types";

export function getYearlySIP(
  baseSIP: number,
  year: number,
  mode: StepUpMode,
  stepUpValue: number
): number {
  if (year === 0) return baseSIP;
  const prevSIP = getYearlySIP(baseSIP, year - 1, mode, stepUpValue);
  if (mode === "percentage") {
    return prevSIP * (1 + stepUpValue / 100);
  }
  return prevSIP + stepUpValue;
}
```

- [ ] **Step 2: Create compounding engine**

Create `src/lib/calculators/sip/engine.ts`:

```typescript
import type { SIPInput, YearlyDataPoint } from "./types";
import { getYearlySIP } from "./step-up";

export function computeSIP(input: SIPInput): YearlyDataPoint[] {
  const monthlyRate = input.returnRate / 100 / 12;
  const totalMonths = input.tenure * 12;
  const yearlyData: YearlyDataPoint[] = [];

  let lumpsumValue = input.lumpsum;
  let sipAccumulated = 0;
  let totalInvested = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const currentYear = Math.ceil(month / 12);
    const currentSIP = getYearlySIP(
      input.monthlySIP,
      currentYear - 1,
      input.stepUpMode,
      input.stepUpValue
    );

    lumpsumValue *= 1 + monthlyRate;
    sipAccumulated = (sipAccumulated + currentSIP) * (1 + monthlyRate);
    totalInvested += currentSIP;

    if (month % 12 === 0) {
      const nominalCorpus = lumpsumValue + sipAccumulated;
      const inflationFactor = Math.pow(
        1 + input.inflationRate / 100,
        currentYear
      );
      yearlyData.push({
        year: currentYear,
        invested: totalInvested + input.lumpsum,
        nominalCorpus,
        realCorpus: nominalCorpus / inflationFactor,
        postTaxCorpus: 0,
      });
    }
  }

  return yearlyData;
}
```

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/lib/calculators/sip/engine.ts src/lib/calculators/sip/step-up.ts && git commit -m "feat: SIP compounding engine + step-up logic"
```

---

### Task 5: Tax, Inflation, Stress Test Modules

**Files:**
- Create: `src/lib/calculators/sip/tax.ts`
- Create: `src/lib/calculators/sip/inflation.ts`
- Create: `src/lib/calculators/sip/stress-test.ts`

- [ ] **Step 1: Create LTCG tax module**

Create `src/lib/calculators/sip/tax.ts`:

```typescript
import { MACRO_CONTEXT } from "@/lib/macro/context";

export interface TaxResult {
  gains: number;
  exempt: number;
  taxable: number;
  tax: number;
  postTaxCorpus: number;
}

export function applyLTCG(maturityCorpus: number, totalInvested: number): TaxResult {
  const gains = Math.max(0, maturityCorpus - totalInvested);
  const exempt = Math.min(gains, MACRO_CONTEXT.ltcgExemption);
  const taxable = Math.max(0, gains - exempt);
  const tax = taxable * MACRO_CONTEXT.ltcgRate;
  const postTaxCorpus = maturityCorpus - tax;

  return { gains, exempt, taxable, tax, postTaxCorpus };
}
```

- [ ] **Step 2: Create inflation module**

Create `src/lib/calculators/sip/inflation.ts`:

```typescript
export function realReturn(nominalRate: number, inflationRate: number): number {
  return (1 + nominalRate) / (1 + inflationRate) - 1;
}

export function presentValue(futureValue: number, inflationRate: number, years: number): number {
  return futureValue / Math.pow(1 + inflationRate, years);
}
```

- [ ] **Step 3: Create stress test module**

Create `src/lib/calculators/sip/stress-test.ts`:

```typescript
import type { StressTestConfig, SIPInput, YearlyDataPoint } from "./types";
import { computeSIP } from "./engine";

export function applyStressTest(
  input: SIPInput,
  config: StressTestConfig
): YearlyDataPoint[] {
  if (!config.enabled) return [];

  const stressInput = { ...input };
  const baseData = computeSIP(stressInput);

  return baseData.map((point) => {
    if (point.year > input.tenure - config.crashYears) {
      const preCrashCorpus = point.nominalCorpus;
      const yearsIntoCrash = point.year - (input.tenure - config.crashYears);
      const crashFactor = Math.pow(1 - config.severity, 1 / config.crashYears);
      const stressedCorpus = preCrashCorpus * Math.pow(crashFactor, yearsIntoCrash);
      const inflationFactor = Math.pow(1 + input.inflationRate / 100, point.year);

      return {
        ...point,
        stressCorpus: stressedCorpus / inflationFactor,
      };
    }
    return point;
  });
}
```

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/lib/calculators/sip/tax.ts src/lib/calculators/sip/inflation.ts src/lib/calculators/sip/stress-test.ts && git commit -m "feat: LTCG tax, inflation, and stress-test modules"
```

---

### Task 6: Monte Carlo Engine

**Files:**
- Create: `src/lib/calculators/sip/monte-carlo.ts`

- [ ] **Step 1: Create Monte Carlo simulator**

Create `src/lib/calculators/sip/monte-carlo.ts`:

```typescript
import type { SIPInput, YearlyDataPoint } from "./types";

function boxMullerRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function sampleMonthlyReturn(mu: number, sigma: number): number {
  const z = boxMullerRandom();
  return Math.exp((mu - sigma * sigma / 2) / 12 + (sigma * z) / Math.sqrt(12)) - 1;
}

export interface MonteCarloResult {
  p10Path: number[];
  p50Path: number[];
  p90Path: number[];
  allFinalValues: number[];
}

export function runMonteCarlo(
  input: SIPInput,
  simulations: number = 1000
): MonteCarloResult {
  const mu = input.returnRate / 100;
  const sigma = 0.18;
  const totalMonths = input.tenure * 12;

  const yearEndPaths: number[][] = Array.from(
    { length: simulations },
    () => []
  );

  for (let sim = 0; sim < simulations; sim++) {
    let lumpsumValue = input.lumpsum;
    let sipAccumulated = 0;

    for (let month = 1; month <= totalMonths; month++) {
      const currentYear = Math.ceil(month / 12);
      const currentSIP = input.monthlySIP;
      const r = sampleMonthlyReturn(mu, sigma);

      lumpsumValue *= 1 + r;
      sipAccumulated = (sipAccumulated + currentSIP) * (1 + r);

      if (month % 12 === 0) {
        yearEndPaths[sim].push(lumpsumValue + sipAccumulated);
      }
    }
  }

  const allFinalValues = yearEndPaths.map(
    (path) => path[path.length - 1]
  );

  const p10Path: number[] = [];
  const p50Path: number[] = [];
  const p90Path: number[] = [];

  for (let yearIdx = 0; yearIdx < input.tenure; yearIdx++) {
    const yearValues = yearEndPaths
      .map((path) => path[yearIdx])
      .sort((a, b) => a - b);
    p10Path.push(yearValues[Math.floor(simulations * 0.1)]);
    p50Path.push(yearValues[Math.floor(simulations * 0.5)]);
    p90Path.push(yearValues[Math.floor(simulations * 0.9)]);
  }

  return { p10Path, p50Path, p90Path, allFinalValues };
}
```

- [ ] **Step 2: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/lib/calculators/sip/monte-carlo.ts && git commit -m "feat: parametric Monte Carlo engine with log-normal sampling"
```

---

### Task 7: Utility — Indian Number Formatting

**Files:**
- Create: `src/lib/format.ts`

- [ ] **Step 1: Create Indian currency formatter**

Create `src/lib/format.ts`:

```typescript
export function formatINR(value: number): string {
  if (value < 0) return "-" + formatINR(-value);
  if (value >= 10000000) {
    return "₹" + (value / 10000000).toFixed(2) + " Cr";
  }
  if (value >= 100000) {
    return "₹" + (value / 100000).toFixed(2) + " L";
  }
  const str = Math.round(value).toString();
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (rest ? "," : "") + last3;
  return "₹" + formatted;
}

export function formatINRShort(value: number): string {
  if (value >= 10000000) return (value / 10000000).toFixed(1) + "Cr";
  if (value >= 100000) return (value / 100000).toFixed(1) + "L";
  if (value >= 1000) return (value / 1000).toFixed(1) + "K";
  return value.toFixed(0);
}
```

- [ ] **Step 2: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/lib/format.ts && git commit -m "feat: Indian numbering format utilities (Lakhs/Crores)"
```

---

### Task 8: Metric Card Component

**Files:**
- Create: `src/components/sip/metric-card.tsx`

- [ ] **Step 1: Create metric card**

Create `src/components/sip/metric-card.tsx`:

```tsx
import { twMerge } from "tailwind-merge";
import { formatINR } from "@/lib/format";

interface MetricCardProps {
  label: string;
  value: number;
  variant?: "neutral" | "gain" | "loss" | "warn";
  className?: string;
}

const variantStyles = {
  neutral: "text-text-primary",
  gain: "text-gain",
  loss: "text-loss",
  warn: "text-warn",
} as const;

export function MetricCard({
  label,
  value,
  variant = "neutral",
  className,
}: MetricCardProps) {
  return (
    <div className={twMerge("flex flex-col gap-1", className)}>
      <span className="text-xs uppercase tracking-wider text-text-secondary font-mono">
        {label}
      </span>
      <span
        className={twMerge(
          "text-2xl font-mono font-semibold",
          variantStyles[variant]
        )}
      >
        {formatINR(value)}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/components/sip/metric-card.tsx && git commit -m "feat: metric card component with variant styling"
```

---

### Task 9: Slider Panel Component

**Files:**
- Create: `src/components/sip/slider-panel.tsx`

- [ ] **Step 1: Create slider panel with all inputs**

Create `src/components/sip/slider-panel.tsx`:

```tsx
"use client";

import type { SIPInput, StressTestConfig } from "@/lib/calculators/sip/types";
import { twMerge } from "tailwind-merge";

interface SliderPanelProps {
  input: SIPInput;
  stressConfig: StressTestConfig;
  onInputChange: <K extends keyof SIPInput>(key: K, value: SIPInput[K]) => void;
  onStressChange: <K extends keyof StressTestConfig>(key: K, value: StressTestConfig[K]) => void;
}

function SliderRow({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm text-text-secondary">{label}</label>
        <span className="text-sm font-mono text-text-primary">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border accent-gain"
      />
    </div>
  );
}

export function SliderPanel({
  input,
  stressConfig,
  onInputChange,
  onStressChange,
}: SliderPanelProps) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-surface rounded-lg border border-border">
      <h2 className="text-lg font-semibold tracking-tight">Configure Your SIP</h2>

      <SliderRow
        label="Monthly SIP"
        value={input.monthlySIP}
        displayValue={`₹${input.monthlySIP.toLocaleString("en-IN")}`}
        min={500}
        max={500000}
        step={500}
        onChange={(v) => onInputChange("monthlySIP", v)}
      />

      <SliderRow
        label="Initial Lumpsum"
        value={input.lumpsum}
        displayValue={`₹${input.lumpsum.toLocaleString("en-IN")}`}
        min={0}
        max={10000000}
        step={10000}
        onChange={(v) => onInputChange("lumpsum", v)}
      />

      <SliderRow
        label="Expected Return"
        value={input.returnRate}
        displayValue={`${input.returnRate}%`}
        min={4}
        max={18}
        step={0.5}
        onChange={(v) => onInputChange("returnRate", v)}
      />

      <SliderRow
        label="Tenure"
        value={input.tenure}
        displayValue={`${input.tenure} yrs`}
        min={1}
        max={40}
        step={1}
        onChange={(v) => onInputChange("tenure", v)}
      />

      <SliderRow
        label="Inflation Rate"
        value={input.inflationRate}
        displayValue={`${input.inflationRate}%`}
        min={2}
        max={12}
        step={0.5}
        onChange={(v) => onInputChange("inflationRate", v)}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm text-text-secondary">Step-Up Mode</span>
        <div className="flex gap-2">
          <button
            className={twMerge(
              "px-4 py-1.5 text-sm rounded-md font-mono transition-colors",
              input.stepUpMode === "percentage"
                ? "bg-gain/20 text-gain border border-gain/40"
                : "bg-border text-text-secondary border border-border"
            )}
            onClick={() => onInputChange("stepUpMode", "percentage")}
          >
            % Annual
          </button>
          <button
            className={twMerge(
              "px-4 py-1.5 text-sm rounded-md font-mono transition-colors",
              input.stepUpMode === "fixed"
                ? "bg-gain/20 text-gain border border-gain/40"
                : "bg-border text-text-secondary border border-border"
            )}
            onClick={() => onInputChange("stepUpMode", "fixed")}
          >
            ₹ Fixed
          </button>
        </div>
      </div>

      <SliderRow
        label={input.stepUpMode === "percentage" ? "Step-Up %" : "Step-Up ₹"}
        value={input.stepUpValue}
        displayValue={
          input.stepUpMode === "percentage"
            ? `${input.stepUpValue}%`
            : `₹${input.stepUpValue.toLocaleString("en-IN")}`
        }
        min={input.stepUpMode === "percentage" ? 1 : 500}
        max={input.stepUpMode === "percentage" ? 50 : 50000}
        step={input.stepUpMode === "percentage" ? 1 : 500}
        onChange={(v) => onInputChange("stepUpValue", v)}
      />

      <div className="border-t border-border pt-4 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary font-semibold">
            Stress Test
          </span>
          <button
            className={twMerge(
              "w-10 h-5 rounded-full transition-colors relative",
              stressConfig.enabled ? "bg-warn" : "bg-border"
            )}
            onClick={() =>
              onStressChange("enabled", !stressConfig.enabled)
            }
          >
            <span
              className={twMerge(
                "absolute top-0.5 w-4 h-4 rounded-full bg-text-primary transition-transform",
                stressConfig.enabled ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {stressConfig.enabled && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex gap-2">
              <button
                className={twMerge(
                  "px-3 py-1 text-sm rounded-md font-mono",
                  stressConfig.severity === 0.2
                    ? "bg-stress/20 text-stress border border-stress/40"
                    : "bg-border text-text-secondary border border-border"
                )}
                onClick={() => onStressChange("severity", 0.2)}
              >
                20% Crash
              </button>
              <button
                className={twMerge(
                  "px-3 py-1 text-sm rounded-md font-mono",
                  stressConfig.severity === 0.3
                    ? "bg-stress/20 text-stress border border-stress/40"
                    : "bg-border text-text-secondary border border-border"
                )}
                onClick={() => onStressChange("severity", 0.3)}
              >
                30% Crash
              </button>
            </div>
            <SliderRow
              label="Crash Window"
              value={stressConfig.crashYears}
              displayValue={`Last ${stressConfig.crashYears} yr${stressConfig.crashYears > 1 ? "s" : ""}`}
              min={1}
              max={5}
              step={1}
              onChange={(v) => onStressChange("crashYears", v)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/components/sip/slider-panel.tsx && git commit -m "feat: slider panel with all inputs + stress test toggle"
```

---

### Task 10: Projection Chart Component

**Files:**
- Create: `src/components/sip/projection-chart.tsx`

- [ ] **Step 1: Create Recharts stacked area chart with MC cone**

Create `src/components/sip/projection-chart.tsx`:

```tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import type { YearlyDataPoint } from "@/lib/calculators/sip/types";
import { formatINRShort } from "@/lib/format";

interface ProjectionChartProps {
  data: YearlyDataPoint[];
  showStress: boolean;
}

export function ProjectionChart({ data, showStress }: ProjectionChartProps) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="nominalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#f87171" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="coneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="year"
            tick={{ fill: "#9ca3af", fontSize: 12, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={(v) => `Y${v}`}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 12, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={formatINRShort}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
            width={70}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "8px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "12px",
            }}
            labelFormatter={(v) => `Year ${v}`}
            formatter={(value: number, name: string) => [
              formatINRShort(value),
              name,
            ]}
          />

          {/* Monte Carlo P10/P90 band */}
          <Area
            type="monotone"
            dataKey="p90"
            stroke="none"
            fill="url(#coneGrad)"
            fillOpacity={1}
            name="P90"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="p10"
            stroke="none"
            fill="#0a0f1a"
            fillOpacity={1}
            name="P10 (mask)"
            isAnimationActive={false}
          />

          {/* Nominal corpus area */}
          <Area
            type="monotone"
            dataKey="nominalCorpus"
            stroke="#6ee7b7"
            strokeWidth={2}
            fill="url(#nominalGrad)"
            name="Nominal"
            isAnimationActive={false}
          />

          {/* Real corpus area */}
          <Area
            type="monotone"
            dataKey="realCorpus"
            stroke="#f87171"
            strokeWidth={2}
            fill="url(#realGrad)"
            name="Real"
            isAnimationActive={false}
          />

          {/* Stress test overlay */}
          {showStress && (
            <Line
              type="monotone"
              dataKey="stressCorpus"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              name="Stress"
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/components/sip/projection-chart.tsx && git commit -m "feat: projection chart with MC cone + stress overlay"
```

---

### Task 11: Results Panel Component

**Files:**
- Create: `src/components/sip/results-panel.tsx`

- [ ] **Step 1: Create results panel with metrics + chart**

Create `src/components/sip/results-panel.tsx`:

```tsx
"use client";

import type { YearlyDataPoint } from "@/lib/calculators/sip/types";
import { MetricCard } from "./metric-card";
import { ProjectionChart } from "./projection-chart";

interface ResultsPanelProps {
  totalInvested: number;
  nominalCorpus: number;
  postTaxCorpus: number;
  realCorpus: number;
  stressCorpus?: number;
  ltcgTax: number;
  yearlyData: YearlyDataPoint[];
  stressEnabled: boolean;
}

export function ResultsPanel({
  totalInvested,
  nominalCorpus,
  postTaxCorpus,
  realCorpus,
  stressCorpus,
  ltcgTax,
  yearlyData,
  stressEnabled,
}: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Total Invested" value={totalInvested} variant="neutral" />
        <MetricCard label="Nominal Corpus" value={nominalCorpus} variant="gain" />
        <MetricCard label="Post-Tax Corpus" value={postTaxCorpus} variant="gain" className="opacity-70" />
        <MetricCard label="Real Purchasing Power" value={realCorpus} variant="loss" />
        {stressEnabled && stressCorpus !== undefined && (
          <MetricCard label="After Stress Test" value={stressCorpus} variant="warn" />
        )}
      </div>

      {ltcgTax > 0 && (
        <div className="text-xs text-text-secondary font-mono px-1">
          LTCG Tax: ₹{ltcgTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })} (12.5% on gains above ₹1.25L exemption)
        </div>
      )}

      <div className="bg-surface rounded-lg border border-border p-4">
        <ProjectionChart data={yearlyData} showStress={stressEnabled} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/components/sip/results-panel.tsx && git commit -m "feat: results panel with metrics grid + chart"
```

---

### Task 12: Main Orchestrator Component

**Files:**
- Create: `src/components/sip/sip-calculator.tsx`

- [ ] **Step 1: Create main SIP calculator orchestrator**

Create `src/components/sip/sip-calculator.tsx`:

```tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import type { SIPInput, StressTestConfig, YearlyDataPoint } from "@/lib/calculators/sip/types";
import { computeSIP } from "@/lib/calculators/sip/engine";
import { applyLTCG } from "@/lib/calculators/sip/tax";
import { runMonteCarlo } from "@/lib/calculators/sip/monte-carlo";
import { applyStressTest } from "@/lib/calculators/sip/stress-test";
import { presentValue } from "@/lib/calculators/sip/inflation";
import { SliderPanel } from "./slider-panel";
import { ResultsPanel } from "./results-panel";

const DEFAULT_INPUT: SIPInput = {
  monthlySIP: 10000,
  lumpsum: 0,
  returnRate: 12,
  tenure: 20,
  inflationRate: 6,
  stepUpMode: "percentage",
  stepUpValue: 10,
};

const DEFAULT_STRESS: StressTestConfig = {
  enabled: false,
  severity: 0.3,
  crashYears: 2,
};

export function SIPCalculator() {
  const [input, setInput] = useState<SIPInput>(DEFAULT_INPUT);
  const [stressConfig, setStressConfig] = useState<StressTestConfig>(DEFAULT_STRESS);

  const handleInputChange = useCallback(
    <K extends keyof SIPInput>(key: K, value: SIPInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleStressChange = useCallback(
    <K extends keyof StressTestConfig>(key: K, value: StressTestConfig[K]) => {
      setStressConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const result = useMemo(() => {
    const yearlyData = computeSIP(input);

    const finalPoint = yearlyData[yearlyData.length - 1];
    if (!finalPoint) return null;

    const { postTaxCorpus, tax: ltcgTax } = applyLTCG(
      finalPoint.nominalCorpus,
      finalPoint.invested
    );

    const realCorpus = presentValue(
      postTaxCorpus,
      input.inflationRate / 100,
      input.tenure
    );

    const mcResult = runMonteCarlo(input, 500);

    const enrichedData: YearlyDataPoint[] = yearlyData.map((point, idx) => ({
      ...point,
      postTaxCorpus: applyLTCG(point.nominalCorpus, point.invested).postTaxCorpus,
      realCorpus: presentValue(
        applyLTCG(point.nominalCorpus, point.invested).postTaxCorpus,
        input.inflationRate / 100,
        point.year
      ),
      p10: mcResult.p10Path[idx],
      p90: mcResult.p90Path[idx],
    }));

    const stressData = applyStressTest(input, stressConfig);
    if (stressConfig.enabled && stressData.length > 0) {
      const stressFinal = stressData[stressData.length - 1];
      return {
        totalInvested: finalPoint.invested,
        nominalCorpus: finalPoint.nominalCorpus,
        postTaxCorpus,
        realCorpus,
        stressCorpus: stressFinal.stressCorpus,
        ltcgTax,
        yearlyData: enrichedData.map((point, idx) => ({
          ...point,
          stressCorpus: stressData[idx]?.stressCorpus,
        })),
      };
    }

    return {
      totalInvested: finalPoint.invested,
      nominalCorpus: finalPoint.nominalCorpus,
      postTaxCorpus,
      realCorpus,
      ltcgTax,
      yearlyData: enrichedData,
    };
  }, [input, stressConfig]);

  if (!result) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="lg:w-[40%]">
        <SliderPanel
          input={input}
          stressConfig={stressConfig}
          onInputChange={handleInputChange}
          onStressChange={handleStressChange}
        />
      </div>
      <div className="lg:w-[60%]">
        <ResultsPanel
          totalInvested={result.totalInvested}
          nominalCorpus={result.nominalCorpus}
          postTaxCorpus={result.postTaxCorpus}
          realCorpus={result.realCorpus}
          stressCorpus={result.stressCorpus}
          ltcgTax={result.ltcgTax}
          yearlyData={result.yearlyData}
          stressEnabled={stressConfig.enabled}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/components/sip/sip-calculator.tsx && git commit -m "feat: SIP calculator orchestrator with split-panel layout"
```

---

### Task 13: Wire Up Page Route

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page.tsx with SIP Calculator**

Replace entire content of `src/app/page.tsx` with:

```tsx
import { SIPCalculator } from "@/components/sip/sip-calculator";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center">
      <header className="w-full max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">SIP Simulator</h1>
        <p className="text-sm text-text-secondary mt-1">
          Real returns. No marketing. All math runs in your browser.
        </p>
      </header>
      <SIPCalculator />
      <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-xs text-text-secondary border-t border-border mt-auto">
        Zero PII. Zero tracking. Computed entirely client-side. Macro defaults: NIFTY 12% μ / 18% σ, 6% inflation, LTCG 12.5% above ₹1.25L.
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm run build 2>&1 | tail -10
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && git add src/app/page.tsx && git commit -m "feat: wire SIP calculator to home page route"
```

---

### Task 14: Build Verification & Visual Smoke Test

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm run build
```

Expected: Build succeeds with zero errors.

- [ ] **Step 2: Start dev server and verify in browser**

```bash
cd "C:\Users\dasgu\OneDrive\Desktop\Calculator" && npm run dev
```

Open `http://localhost:3000`. Verify:
- Split panel renders (sliders left, results right)
- Dragging any slider updates the chart and metrics
- Step-up mode toggle works (% vs ₹)
- Stress test toggle reveals severity/crash-window controls
- Stress dashed line appears on chart when toggled
- Monte Carlo cone (P10/P90 band) visible around nominal area
- All values display in ₹ Lakhs/Crores format
- Layout collapses to vertical on narrow viewport