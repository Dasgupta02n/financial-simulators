import { Metadata } from "next";
import config from "@/content/calculators/step-up-sip.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { StepUpSIPCalculator } from "@/components/step-up-sip/step-up-sip-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function StepUpSIPPage() {
  return (
    <CalculatorPageShell config={config}>
      <StepUpSIPCalculator />
    </CalculatorPageShell>
  );
}