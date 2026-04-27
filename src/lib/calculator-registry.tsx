import type { ComponentType } from "react";
import type { CalculatorConfig } from "@/lib/seo";

import sipConfig from "@/content/calculators/sip.json";
import emiConfig from "@/content/calculators/emi.json";
import taxConfig from "@/content/calculators/tax.json";
import fireConfig from "@/content/calculators/fire.json";
import fdConfig from "@/content/calculators/fd.json";
import hraConfig from "@/content/calculators/hra.json";
import ctcConfig from "@/content/calculators/ctc.json";
import goalConfig from "@/content/calculators/goal.json";
import swpConfig from "@/content/calculators/swp.json";
import npsConfig from "@/content/calculators/nps.json";
import ppfConfig from "@/content/calculators/ppf.json";
import accumConfig from "@/content/calculators/accum.json";
import compoundConfig from "@/content/calculators/compound.json";
import simpleInterestConfig from "@/content/calculators/simple-interest.json";
import stepUpSipConfig from "@/content/calculators/step-up-sip.json";
import salaryConfig from "@/content/calculators/salary.json";
import gstConfig from "@/content/calculators/gst.json";
import realEstateConfig from "@/content/calculators/real-estate.json";
import cryptoConfig from "@/content/calculators/crypto.json";
import forexConfig from "@/content/calculators/forex.json";
import depreciationConfig from "@/content/calculators/depreciation.json";
import termInsuranceConfig from "@/content/calculators/term-insurance.json";
import epfConfig from "@/content/calculators/epf.json";
import plannerConfig from "@/content/calculators/planner.json";

import { SIPCalculator } from "@/components/sip/sip-calculator";
import { EMICalculator } from "@/components/emi/emi-calculator";
import { TaxCalculator } from "@/components/tax/tax-calculator";
import { FIRECalculator } from "@/components/fire/fire-calculator";
import { FDCalculator } from "@/components/fd/fd-calculator";
import { HRACalculator } from "@/components/hra/hra-calculator";
import { CTCCalculator } from "@/components/ctc/ctc-calculator";
import { GoalCalculator } from "@/components/goal/goal-calculator";
import { SWPCalculator } from "@/components/swp/swp-calculator";
import { NPSCalculator } from "@/components/nps/nps-calculator";
import { PPFViewModel } from "@/components/ppf/ppf-calculator";
import { AccumCalculator } from "@/components/accum/accum-calculator";
import { CompoundCalculator } from "@/components/compound/compound-calculator";
import { SimpleInterestCalculator } from "@/components/simple-interest/simple-interest-calculator";
import { StepUpSIPCalculator } from "@/components/step-up-sip/step-up-sip-calculator";
import { SalaryCalculator } from "@/components/salary/salary-calculator";
import { GSTCalculator } from "@/components/gst/gst-calculator";
import { RealEstateCalculator } from "@/components/real-estate/real-estate-calculator";
import { CryptoCalculator } from "@/components/crypto/crypto-calculator";
import { ForexCalculator } from "@/components/forex/forex-calculator";
import { DepreciationCalculator } from "@/components/depreciation/depreciation-calculator";
import { TermInsuranceCalculator } from "@/components/term-insurance/term-insurance-calculator";
import { EPFCalculator } from "@/components/epf/epf-calculator";
import { PlannerWizard } from "@/components/planner/planner-wizard";

export interface CalculatorEntry {
  config: CalculatorConfig;
  Component: ComponentType;
}

export const calculatorRegistry: Record<string, CalculatorEntry> = {
  "sip-simulator": { config: sipConfig, Component: SIPCalculator },
  "emi-analyzer": { config: emiConfig, Component: EMICalculator },
  "tax-sandbox": { config: taxConfig, Component: TaxCalculator },
  "fire-matrix": { config: fireConfig, Component: FIRECalculator },
  "fd-comparator": { config: fdConfig, Component: FDCalculator },
  "hra-calculator": { config: hraConfig, Component: HRACalculator },
  "ctc-optimizer": { config: ctcConfig, Component: CTCCalculator },
  "goal-planner": { config: goalConfig, Component: GoalCalculator },
  "swp-stress-test": { config: swpConfig, Component: SWPCalculator },
  "nps-modeler": { config: npsConfig, Component: NPSCalculator },
  "ppf-calculator": { config: ppfConfig, Component: PPFViewModel },
  "accumulation-calculator": { config: accumConfig, Component: AccumCalculator },
  "compound-interest-calculator": {
    config: compoundConfig,
    Component: CompoundCalculator,
  },
  "simple-interest-calculator": {
    config: simpleInterestConfig,
    Component: SimpleInterestCalculator,
  },
  "step-up-sip-calculator": {
    config: stepUpSipConfig,
    Component: StepUpSIPCalculator,
  },
  "salary-calculator": { config: salaryConfig, Component: SalaryCalculator },
  "gst-calculator": { config: gstConfig, Component: GSTCalculator },
  "real-estate-calculator": {
    config: realEstateConfig,
    Component: RealEstateCalculator,
  },
  "crypto-calculator": { config: cryptoConfig, Component: CryptoCalculator },
  "forex-calculator": { config: forexConfig, Component: ForexCalculator },
  "depreciation-calculator": {
    config: depreciationConfig,
    Component: DepreciationCalculator,
  },
  "term-insurance-calculator": {
    config: termInsuranceConfig,
    Component: TermInsuranceCalculator,
  },
  "epf-calculator": { config: epfConfig, Component: EPFCalculator },
  planner: { config: plannerConfig, Component: PlannerWizard },
};