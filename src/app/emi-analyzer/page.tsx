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