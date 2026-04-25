import { Metadata } from "next";
import config from "@/content/calculators/forex.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { ForexCalculator } from "@/components/forex/forex-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function ForexPage() {
  return (
    <CalculatorPageShell config={config}>
      <ForexCalculator />
    </CalculatorPageShell>
  );
}