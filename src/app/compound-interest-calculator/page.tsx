import { Metadata } from "next";
import config from "@/content/calculators/compound.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { CompoundCalculator } from "@/components/compound/compound-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function CompoundInterestPage() {
  return (
    <CalculatorPageShell config={config}>
      <CompoundCalculator />
    </CalculatorPageShell>
  );
}