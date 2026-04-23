import type { HRAInput, HRAOutput } from "./types";

export function computeHRA(input: HRAInput): HRAOutput {
  const { basicSalary, hraReceived, rentPaid, metroCity } = input;

  // HRA exemption is the minimum of:
  // 1. Actual HRA received
  // 2. Rent paid - 10% of basic salary (if positive)
  // 3. 50% of basic salary (metro) or 40% of basic salary (non-metro)
  const actualHRA = hraReceived;
  const rentOver10Percent = Math.max(0, rentPaid - 0.1 * basicSalary);
  const metroLimit = metroCity ? 0.5 * basicSalary : 0.4 * basicSalary;

  const hraExemption = Math.min(actualHRA, rentOver10Percent, metroLimit);
  const taxableHRA = Math.max(0, hraReceived - hraExemption);

  return {
    hraExemption: Math.round(hraExemption),
    taxableHRA: Math.round(taxableHRA),
    breakdown: {
      actualHRA: Math.round(actualHRA),
      rentOver10Percent: Math.round(rentOver10Percent),
      metroLimit: Math.round(metroLimit),
    },
  };
}