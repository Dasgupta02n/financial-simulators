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