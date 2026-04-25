import { Metadata } from "next";
import config from "@/content/calculators/crypto.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { CryptoCalculator } from "@/components/crypto/crypto-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function CryptoPage() {
  return (
    <CalculatorPageShell config={config}>
      <CryptoCalculator />
    </CalculatorPageShell>
  );
}