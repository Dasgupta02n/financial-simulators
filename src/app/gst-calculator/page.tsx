import { Metadata } from "next";
import config from "@/content/calculators/gst.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { GSTCalculator } from "@/components/gst/gst-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function GSTPage() {
  return (
    <CalculatorPageShell config={config}>
      <GSTCalculator />
    </CalculatorPageShell>
  );
}