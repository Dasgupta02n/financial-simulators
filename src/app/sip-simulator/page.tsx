import { Metadata } from "next";
import config from "@/content/calculators/sip.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { SIPCalculator } from "@/components/sip/sip-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function SIPSimulatorPage() {
  return (
    <CalculatorPageShell config={config}>
      <SIPCalculator />
    </CalculatorPageShell>
  );
}