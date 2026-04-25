import { Metadata } from "next";
import config from "@/content/calculators/salary.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { SalaryCalculator } from "@/components/salary/salary-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function SalaryPage() {
  return (
    <CalculatorPageShell config={config}>
      <SalaryCalculator />
    </CalculatorPageShell>
  );
}