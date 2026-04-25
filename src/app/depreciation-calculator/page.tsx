import { Metadata } from "next";
import config from "@/content/calculators/depreciation.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { DepreciationCalculator } from "@/components/depreciation/depreciation-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function DepreciationPage() {
  return (
    <CalculatorPageShell config={config}>
      <DepreciationCalculator />
    </CalculatorPageShell>
  );
}