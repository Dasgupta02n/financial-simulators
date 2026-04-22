import { Metadata } from "next";
import config from "@/content/calculators/goal.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { GoalCalculator } from "@/components/goal/goal-calculator";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function GoalPlannerPage() {
  return (
    <CalculatorPageShell config={config}>
      <GoalCalculator />
    </CalculatorPageShell>
  );
}