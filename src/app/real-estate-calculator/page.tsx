import { Metadata } from "next";
import config from "@/content/calculators/real-estate.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { RealEstateCalculator } from "@/components/real-estate/real-estate-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function RealEstatePage() {
  return (
    <CalculatorPageShell config={config}>
      <RealEstateCalculator />
    </CalculatorPageShell>
  );
}