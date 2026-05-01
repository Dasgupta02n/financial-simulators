import {
  SURCHARGE_THRESHOLDS,
  CESS_RATE,
} from "./types";

export function computeSurcharge(
  taxableIncome: number,
  taxBeforeSurcharge: number,
  regimeName: "old" | "new"
): { surcharge: number; marginalRelief: number } {
  if (taxableIncome <= SURCHARGE_THRESHOLDS[0].threshold) {
    return { surcharge: 0, marginalRelief: 0 };
  }

  let applicableRate = 0;
  let thresholdCrossed = 0;

  for (let i = SURCHARGE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (taxableIncome > SURCHARGE_THRESHOLDS[i].threshold) {
      applicableRate = SURCHARGE_THRESHOLDS[i].rate;
      if (i === 0) {
        thresholdCrossed = SURCHARGE_THRESHOLDS[i].threshold;
      } else {
        thresholdCrossed = SURCHARGE_THRESHOLDS[i].threshold;
      }
      break;
    }
  }

  // New regime caps surcharge at 25% for highest bracket
  if (regimeName === "new" && applicableRate > 0.25) {
    applicableRate = 0.25;
  }

  const surcharge = Math.round(taxBeforeSurcharge * applicableRate);
  const cessOnSurcharge = Math.round(surcharge * CESS_RATE);

  // Marginal relief: total additional tax (surcharge + cess on surcharge)
  // should not exceed income above the threshold
  const incomeAboveThreshold = taxableIncome - thresholdCrossed;
  const totalAdditionalTax = surcharge + cessOnSurcharge;

  if (totalAdditionalTax <= incomeAboveThreshold) {
    return { surcharge, marginalRelief: 0 };
  }

  // Reduce surcharge so total additional = income above threshold
  // surcharge + surcharge * CESS_RATE = incomeAboveThreshold
  // surcharge * (1 + CESS_RATE) = incomeAboveThreshold
  const adjustedSurcharge = Math.round(incomeAboveThreshold / (1 + CESS_RATE));
  const marginalRelief = surcharge - adjustedSurcharge;

  return { surcharge: adjustedSurcharge, marginalRelief };
}