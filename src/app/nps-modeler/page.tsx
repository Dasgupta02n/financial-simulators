import { Metadata } from "next";
import config from "@/content/calculators/nps.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { NPSCalculator } from "@/components/nps/nps-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function NPSModelerPage() {
  return (
    <CalculatorPageShell config={config}>
      <NPSCalculator />
    </CalculatorPageShell>
  );
}