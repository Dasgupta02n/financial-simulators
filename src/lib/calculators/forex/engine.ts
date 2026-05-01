import type { ForexInput, ForexOutput, ForexYearlyPoint } from "./types";

export function computeForex(input: ForexInput): ForexOutput {
  const {
    amountINR,
    exchangeRate,
    holdingYears,
    appreciationRate,
    taxSlab,
    inflationRate,
  } = input;

  // TCS: 20% above ₹7L under LRS, 0.5% below ₹7L
  const tcsOnRemittance = amountINR > 7_00_000
    ? Math.round(amountINR * 0.20)
    : Math.round(amountINR * 0.005);

  // Bank spread: ~0.5-1% on conversion
  const bankSpread = Math.round(amountINR * 0.01);

  const netInvestedINR = amountINR - tcsOnRemittance - bankSpread;
  const initialForeignAmount = Math.round((netInvestedINR / exchangeRate) * 100) / 100;

  const yearlyData: ForexYearlyPoint[] = [];
  let currentForeignValue = initialForeignAmount;

  for (let year = 1; year <= holdingYears; year++) {
    // Foreign asset appreciates
    currentForeignValue = currentForeignValue * (1 + appreciationRate / 100);

    // Convert back to INR (same exchange rate for simplicity — user can adjust)
    const inrValue = Math.round(currentForeignValue * exchangeRate);
    const gains = Math.max(0, inrValue - netInvestedINR);

    let capitalGainsTax = 0;
    if (holdingYears > 3) {
      // Long-term: 20% with indexation
      const indexationFactor = Math.pow(1 + inflationRate / 100, year);
      const indexedCost = Math.round(netInvestedINR * indexationFactor);
      const indexedGains = Math.max(0, inrValue - indexedCost);
      capitalGainsTax = Math.round(indexedGains * 0.20);
    } else {
      // Short-term: slab rate
      capitalGainsTax = Math.round(gains * (taxSlab / 100));
    }

    const netAfterTax = inrValue - capitalGainsTax;
    const realValue = Math.round(netAfterTax / Math.pow(1 + inflationRate / 100, year));

    yearlyData.push({
      year,
      foreignValue: Math.round(currentForeignValue * 100) / 100,
      inrValue,
      capitalGainsTax,
      tcsAmount: 0, // TCS only on initial remittance
      netAfterTax,
      realValue,
    });
  }

  const final = yearlyData[yearlyData.length - 1];
  const totalDeductions = tcsOnRemittance + bankSpread + final.capitalGainsTax;
  const netProceeds = final.inrValue - final.capitalGainsTax;
  const realValue = Math.round(netProceeds / Math.pow(1 + inflationRate / 100, holdingYears));

  const effectiveRate = netInvestedINR > 0 && holdingYears > 0
    ? Math.round((((realValue / netInvestedINR) ** (1 / holdingYears) - 1) * 100) * 100) / 100
    : 0;

  return {
    yearlyData,
    initialForeignAmount: Math.round(initialForeignAmount * 100) / 100,
    finalForeignAmount: Math.round(currentForeignValue * 100) / 100,
    finalINRValue: final.inrValue,
    capitalGainsTax: final.capitalGainsTax,
    tcsAmount: tcsOnRemittance,
    bankSpread,
    totalDeductions,
    netProceeds,
    realValue,
    effectiveRate,
  };
}