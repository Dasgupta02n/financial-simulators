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