import { Metadata } from "next";
import config from "@/content/calculators/epf.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { EPFCalculator } from "@/components/epf/epf-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function EPFPage() {
  return (
    <CalculatorPageShell config={config}>
      <EPFCalculator />
    </CalculatorPageShell>
  );
}