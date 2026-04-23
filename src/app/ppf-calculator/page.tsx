import { Metadata } from "next";
import config from "@/content/calculators/ppf.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { PPFViewModel } from "@/components/ppf/ppf-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function PPFPage() {
  return (
    <CalculatorPageShell config={config}>
      <PPFViewModel />
    </CalculatorPageShell>
  );
}