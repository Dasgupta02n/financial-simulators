---
name: SIP Simulator Design
date: 2026-04-21
calculator: 1 of 10
status: approved
---

# Inflation-Adjusted, Tax-Aware SIP Simulator — Design Spec

## Mission

Deliver a privacy-first, mathematically realistic SIP projection tool for Indian middle-class earners. No flat CAGR fairy tales. No lead-gen traps. Show the truth: Real vs Nominal returns, post-tax reality, and stress-tested outcomes.

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Layout | Split Panel (40/60) | Instant slider→chart feedback loop |
| Visual Personality | Ink & Ember (dark) | Makes Real vs Nominal gap viscerally visible |
| Chart Type | Stacked Area | The gap between fills IS the story |
| Volatility Engine | Parametric Monte Carlo (1000 sims) | Probability cone shows uncertainty — the anti-marketing visual |
| Privacy | 100% client-side | Zero PII, zero API calls with user data |

## File Structure

```
src/
  app/
    page.tsx                          ← Calculator entry point
  lib/
    calculators/
      sip/
        engine.ts                     ← Pure math: SIP + lumpsum compounding
        monte-carlo.ts                ← Parametric MC (1000 sims, log-normal)
        tax.ts                        ← LTCG deduction (12.5% > ₹1.25L)
        inflation.ts                  ← Real vs Nominal discounting
        step-up.ts                    ← Dual-mode: % or ₹ annual step-up
        stress-test.ts                ← Late-stage crash overlay (20/30%)
        types.ts                      ← Input/Output type definitions
    macro/
      context.ts                      ← Macro-Context defaults (2026 India)
  components/
    sip/
      sip-calculator.tsx              ← Main orchestrator (split panel)
      slider-panel.tsx                ← Left panel: all input sliders
      results-panel.tsx               ← Right panel: metrics + chart
      projection-chart.tsx            ← Recharts stacked area + MC cone
      stress-test-toggle.tsx          ← Toggle + crash severity selector
      metric-card.tsx                 ← Single metric display
```

## Data Flow

```
Slider Input
  → engine.ts (compound SIP + lumpsum)
  → step-up.ts (apply annual increment)
  → monte-carlo.ts (1000 sims → P10/P50/P90)
  → tax.ts (LTCG deduction from P50)
  → inflation.ts (Real purchasing power)
  → stress-test.ts (if toggled: late-stage crash)
  → Recharts stacked area render
```

All computation is synchronous, client-side, pure functions. No I/O. No state outside React. Debounced at 150ms on slider drag.

## Math Engine

### SIP Compounding (monthly)

- SIP FV: `SIP × [(1+r)^n - 1] / r × (1+r)` where r = monthly return, n = total months
- Lumpsum FV: `L × (1+r)^n`
- Combined: `FV_total = FV_sip + FV_lump`

### Step-Up Logic

- Mode A (flat %): `SIP_year(k+1) = SIP_year(k) × (1 + stepUpPct)`
- Mode B (fixed ₹): `SIP_year(k+1) = SIP_year(k) + stepUpAmount`
- Each year's SIP amount compounds independently for remaining months

### Monte Carlo

- Distribution: Log-normal
- Parameters: μ = annualized return (default 12%), σ = annualized volatility (default 18%)
- 1,000 independent simulations, month-by-month projection for full tenure
- Output: P10 (pessimistic), P50 (median), P90 (optimistic) paths
- Monthly return sampled: `r_monthly = exp((μ - σ²/2)/12 + σ × Z / sqrt(12))` where Z ~ N(0,1)

### LTCG Tax

- Gains = Maturity - Total Invested
- Exempt = min(Gains, 1,25,000)
- Taxable = max(0, Gains - Exempt)
- Tax = Taxable × 12.5%
- Post-tax Maturity = Maturity - Tax

### Inflation Adjustment

- Real Return = (1 + Nominal Return) / (1 + Inflation Rate) - 1
- Applied to post-tax maturity as present-value discount
- Default inflation: 6% (Indian historical average)

### Stress Test

- Applies a one-time crash of X% (20% or 30%) in the final N years (default: last 2 years)
- Crash applied to the portfolio value at the start of the crash window
- Remaining months compound from the reduced base
- Shows "In-Hand After Stress" metric alongside base case

## UI Specification

### Layout

Split panel. Left: slider inputs (40% width). Right: results + chart (60% width). Collapses to vertical stack on mobile (< 768px).

### Sliders (left panel)

| Parameter | Range | Default | Step |
|---|---|---|---|
| Monthly SIP | ₹500 – ₹5,00,000 | ₹10,000 | ₹500 |
| Initial Lumpsum | ₹0 – ₹1,00,00,000 | ₹0 | ₹10,000 |
| Expected Return | 4% – 18% | 12% | 0.5% |
| Tenure | 1 – 40 years | 20 | 1 |
| Inflation Rate | 2% – 12% | 6% | 0.5% |
| Step-Up Mode | % / ₹ (toggle) | 10% | — |
| Step-Up Value | 1-50% or ₹500-₹50,000 | 10% / ₹5,000 | varies |

### Metrics (right panel, top)

- Total Invested (neutral white)
- Nominal Corpus (green)
- Post-Tax Corpus (green, dimmer)
- Real Purchasing Power (red)
- In-Hand After Stress (red, with amber warning badge — only when stress toggle is on)

### Chart (right panel, bottom)

- Stacked area: Nominal (green fill), Real (red fill)
- Monte Carlo cone: P10/P90 as translucent band around P50
- Stress path: dashed red line overlay (when toggled)
- X-axis: Years
- Y-axis: ₹ in Lakhs/Crores (auto-formatted Indian numbering system)
- Tooltip: year-by-year breakdown showing Nominal, Real, and stress values

### Stress Test Toggle

- Switch component: Off / On
- When on: reveals severity selector (20% / 30%) and timing slider (last 1-5 years)
- Triggers re-computation + chart overlay

## Design Tokens (Ink & Ember)

```
Background:     #0a0f1a
Surface:        #111827
Border:         #1f2937
Text Primary:   #f9fafb
Text Secondary: #9ca3af
Gain Green:     #6ee7b7
Loss Red:       #f87171
Warning Amber:  #fbbf24
Chart Green:    #6ee7b7 / 15% opacity fill
Chart Red:      #f87171 / 12% opacity fill
Cone Band:      #6ee7b7 / 8% opacity
Stress Dash:    #ef4444
Font Display:   Geist Mono (tabular-nums)
Font Body:      Geist Sans
```

## Macro-Context Defaults (2026 India)

```
NIFTY 50 long-term return:     12% (with σ=18% historical volatility)
Headline inflation:            6% (historical average; adjustable)
CPI inflation (IMF 2026):     4.7% (available as alternate preset)
GDP baseline:                 6.5% (contextual reference)
LTCG rate:                    12.5% above ₹1.25L exemption
RBI rate cycle:               Easing bias (contextual note in UI)
```

## Dependencies

- `recharts` — charting (stacked area + custom overlay)
- `tailwind-merge` — deterministic class resolution
- `clsx` — conditional classnames

## Constraints

- All math is client-side. Zero PII. Zero lead-gen.
- Every output shows Real vs Nominal.
- Stress test is always accessible (never hidden behind a paywall or CTA).
- Indian numbering format (Lakhs/Crores) throughout.
- Tabular-nums for all financial figures.
- No Inter, Roboto, Arial. Geist Sans + Geist Mono only.