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

const configs: Record<string, CalculatorConfig> = {
  sip: sipConfig,
  emi: emiConfig,
  tax: taxConfig,
  fire: fireConfig,
  fd: fdConfig,
  hra: hraConfig,
  ctc: ctcConfig,
  goal: goalConfig,
  swp: swpConfig,
  nps: npsConfig,
  ppf: ppfConfig,
  accum: accumConfig,
  compound: compoundConfig,
  simpleInterest: simpleInterestConfig,
  stepUpSip: stepUpSipConfig,
  salary: salaryConfig,
  gst: gstConfig,
  realEstate: realEstateConfig,
  crypto: cryptoConfig,
  forex: forexConfig,
  depreciation: depreciationConfig,
  termInsurance: termInsuranceConfig,
  epf: epfConfig,
  planner: plannerConfig,
};

export interface CalculatorLookupResult {
  name: string;
  slug: string;
}

export function lookupCalculator(calculatorId: string): CalculatorLookupResult | null {
  const cfg = configs[calculatorId] as (CalculatorConfig & { id?: string; slug?: string }) | undefined;
  if (!cfg) return null;
  return {
    name: cfg.name ?? calculatorId,
    slug: cfg.slug ?? calculatorId,
  };
}