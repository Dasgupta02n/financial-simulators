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