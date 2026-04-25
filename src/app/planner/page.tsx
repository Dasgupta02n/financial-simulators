import { Metadata } from "next";
import config from "@/content/calculators/planner.json";
import { generateCalculatorMetadata } from "@/lib/seo";
import { CalculatorPageShell } from "@/components/shared/calculator-page-shell";
import { PlannerWizard } from "@/components/planner/planner-wizard";

export const metadata: Metadata = generateCalculatorMetadata(config);

export default function PlannerPage() {
  return (
    <CalculatorPageShell config={config}>
      <PlannerWizard />
    </CalculatorPageShell>
  );
}