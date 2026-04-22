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