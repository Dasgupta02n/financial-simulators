import { Metadata } from "next";
import config from "@/content/calculators/ctc.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { CTCCalculator } from "@/components/ctc/ctc-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function CTCOptimizerPage() {
  return (
    <CalculatorPageShell config={config}>
      <CTCCalculator />
    </CalculatorPageShell>
  );
}