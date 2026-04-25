import type { CryptoInput, CryptoOutput, CryptoYearlyPoint } from "./types";

export function computeCrypto(input: CryptoInput): CryptoOutput {
  const {
    purchasePrice,
    quantity,
    currentPrice,
    holdingYears,
    stakingIncome,
    taxSlab,
    inflationRate,
  } = input;

  const invested = purchasePrice * quantity;
  const currentValue = currentPrice * quantity;
  const totalGains = currentValue - invested;

  // Section 115BBE: 30% flat tax on crypto gains (no slab benefit)
  const taxOnGains = Math.round(Math.max(0, totalGains) * 0.30);

  // Section 194S: 1% TDS on transfers above ₹10L
  const tdsAmount = currentValue > 10_00_000 ? Math.round(currentValue * 0.01) : 0;

  // Staking income: taxed as income from other sources at slab rate
  const totalStakingIncome = Math.round(stakingIncome * holdingYears);
  const stakingTax = Math.round(totalStakingIncome * (taxSlab / 100));

  const netAfterTax = currentValue - taxOnGains - tdsAmount - stakingTax + totalStakingIncome;

  const yearlyData: CryptoYearlyPoint[] = [];
  let cumulativeStaking = 0;

  for (let year = 1; year <= holdingYears; year++) {
    // Assume linear price appreciation for projection
    const projectedPrice = purchasePrice + (currentPrice - purchasePrice) * (year / holdingYears);
    const projectedValue = Math.round(projectedPrice * quantity);
    const projectedGains = Math.max(0, projectedValue - invested);
    const projectedTax = Math.round(projectedGains * 0.30);
    const projectedTDS = projectedValue > 10_00_000 ? Math.round(projectedValue * 0.01) : 0;

    cumulativeStaking += stakingIncome;
    const yearStakingTax = Math.round(stakingIncome * (taxSlab / 100));

    const realValue = Math.round(projectedValue / Math.pow(1 + inflationRate / 100, year));

    yearlyData.push({
      year,
      valueAtPrice: projectedValue,
      tax30Pct: projectedTax,
      tds1Pct: projectedTDS,
      realValue,
      cumulativeStakingIncome: Math.round(cumulativeStaking),
      stakingTax: Math.round(cumulativeStaking * (taxSlab / 100)),
    });
  }

  const realValueAfterInflation = Math.round(netAfterTax / Math.pow(1 + inflationRate / 100, holdingYears));
  const effectiveTaxRate = totalGains > 0
    ? Math.round(((taxOnGains + tdsAmount + stakingTax) / (totalGains + totalStakingIncome)) * 10000) / 100
    : 0;
  const realReturn = invested > 0
    ? Math.round((((realValueAfterInflation / invested) ** (1 / holdingYears) - 1) * 100) * 100) / 100
    : 0;

  return {
    yearlyData,
    totalGains: Math.round(totalGains),
    taxOnGains,
    tdsAmount,
    stakingTax,
    netAfterTax: Math.round(netAfterTax),
    realValueAfterInflation,
    effectiveTaxRate,
    realReturn,
  };
}