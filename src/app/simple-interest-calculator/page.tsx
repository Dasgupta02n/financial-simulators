import { Metadata } from "next";
import config from "@/content/calculators/simple-interest.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { SimpleInterestCalculator } from "@/components/simple-interest/simple-interest-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function SimpleInterestPage() {
  return (
    <CalculatorPageShell config={config}>
      <SimpleInterestCalculator />
    </CalculatorPageShell>
  );
}