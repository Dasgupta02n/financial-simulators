import { Metadata } from "next";
import config from "@/content/calculators/term-insurance.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { TermInsuranceCalculator } from "@/components/term-insurance/term-insurance-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function TermInsurancePage() {
  return (
    <CalculatorPageShell config={config}>
      <TermInsuranceCalculator />
    </CalculatorPageShell>
  );
}