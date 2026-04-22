import { Metadata } from "next";
import config from "@/content/calculators/fire.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { FIRECalculator } from "@/components/fire/fire-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function FIREMatrixPage() {
  return (
    <CalculatorPageShell config={config}>
      <FIRECalculator />
    </CalculatorPageShell>
  );
}