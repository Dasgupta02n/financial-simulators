import type { Worksheet } from "exceljs";

export type TemplateFn = (ws: Worksheet, name: string) => void;

const templates: Record<string, TemplateFn> = {};

export function registerTemplate(id: string, fn: TemplateFn): void {
  templates[id] = fn;
}

export function getTemplate(id: string): TemplateFn | undefined {
  return templates[id];
}

// --- Register all templates ---

import { registerSipTemplate } from "./sip-template";
import { registerEmiTemplate } from "./emi-template";
import { registerTaxTemplate } from "./tax-template";
import { registerFireTemplate } from "./fire-template";
import { registerFdTemplate } from "./fd-template";
import { registerHraTemplate } from "./hra-template";
import { registerCtcTemplate } from "./ctc-template";
import { registerGoalTemplate } from "./goal-template";
import { registerSwpTemplate } from "./swp-template";
import { registerNpsTemplate } from "./nps-template";
import { registerPpfTemplate } from "./ppf-template";
import { registerAccumulationTemplate } from "./accumulation-template";
import { registerCompoundTemplate } from "./compound-template";
import { registerSimpleInterestTemplate } from "./simple-interest-template";
import { registerStepUpSipTemplate } from "./step-up-sip-template";
import { registerSalaryTemplate } from "./salary-template";
import { registerGstTemplate } from "./gst-template";
import { registerRealEstateTemplate } from "./real-estate-template";
import { registerCryptoTemplate } from "./crypto-template";
import { registerForexTemplate } from "./forex-template";
import { registerDepreciationTemplate } from "./depreciation-template";
import { registerTermInsuranceTemplate } from "./term-insurance-template";
import { registerEpfTemplate } from "./epf-template";
import { registerPlannerTemplate } from "./planner-template";

registerSipTemplate();
registerEmiTemplate();
registerTaxTemplate();
registerFireTemplate();
registerFdTemplate();
registerHraTemplate();
registerCtcTemplate();
registerGoalTemplate();
registerSwpTemplate();
registerNpsTemplate();
registerPpfTemplate();
registerAccumulationTemplate();
registerCompoundTemplate();
registerSimpleInterestTemplate();
registerStepUpSipTemplate();
registerSalaryTemplate();
registerGstTemplate();
registerRealEstateTemplate();
registerCryptoTemplate();
registerForexTemplate();
registerDepreciationTemplate();
registerTermInsuranceTemplate();
registerEpfTemplate();
registerPlannerTemplate();