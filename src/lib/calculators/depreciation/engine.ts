import type { DepreciationInput, DepreciationOutput, DepreciationYearlyPoint } from "./types";
import { VEHICLE_DEPRECIATION_WDV, RESALE_PERCENT } from "./types";

export function computeDepreciation(input: DepreciationInput): DepreciationOutput {
  const {
    vehicleType,
    purchasePrice,
    ownershipYears,
    isEV,
    loanAmount,
    loanRate,
    loanTenureYears,
    fuelCostMonthly,
    insuranceAnnual,
    maintenanceAnnual,
    registrationCost,
    inflationRate,
    incomeAnnual,
  } = input;

  // Loan EMI
  const hasLoan = loanAmount > 0;
  const monthlyRate = loanRate / 100 / 12;
  const totalLoanMonths = loanTenureYears * 12;
  let emi = 0;
  let totalLoanPayment = 0;
  let totalLoanInterest = 0;

  if (hasLoan && monthlyRate > 0 && totalLoanMonths > 0) {
    emi = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalLoanMonths)) /
      (Math.pow(1 + monthlyRate, totalLoanMonths) - 1)
    );
    totalLoanPayment = emi * totalLoanMonths;
    totalLoanInterest = totalLoanPayment - loanAmount;
  }

  const yearlyData: DepreciationYearlyPoint[] = [];
  let bookValue = purchasePrice;
  let cumulativeCost = purchasePrice + registrationCost;
  let totalFuelCost = 0;
  let totalInsuranceCost = 0;
  let totalMaintenanceCost = 0;
  let currentFuel = fuelCostMonthly * 12;
  let currentInsurance = insuranceAnnual;
  let currentMaintenance = maintenanceAnnual;

  for (let year = 1; year <= ownershipYears; year++) {
    // WDV depreciation
    bookValue = Math.round(bookValue * (1 - VEHICLE_DEPRECIATION_WDV));

    // Resale percentage (from lookup table, capped)
    const resaleTable = RESALE_PERCENT[vehicleType];
    const resalePct = year < resaleTable.length ? resaleTable[year] : resaleTable[resaleTable.length - 1];
    const resaleValue = Math.round(purchasePrice * (resalePct / 100));

    // Inflated costs
    if (year > 1) {
      currentFuel = Math.round(currentFuel * (1 + 0.08)); // 8% fuel inflation
      currentInsurance = Math.round(currentInsurance * (1 + inflationRate / 100));
      currentMaintenance = Math.round(currentMaintenance * (1 + inflationRate / 100));
    }

    totalFuelCost += currentFuel;
    totalInsuranceCost += currentInsurance;
    totalMaintenanceCost += currentMaintenance;

    cumulativeCost += currentFuel + currentInsurance + currentMaintenance;
    if (hasLoan && year <= loanTenureYears) {
      cumulativeCost += emi * 12;
    }

    const realCumulativeCost = Math.round(cumulativeCost / Math.pow(1 + inflationRate / 100, year));

    yearlyData.push({
      year,
      bookValue,
      resaleValue,
      fuelCost: currentFuel,
      insuranceCost: currentInsurance,
      maintenanceCost: currentMaintenance,
      cumulativeCost: Math.round(cumulativeCost),
      realCumulativeCost,
    });
  }

  const finalResaleValue = yearlyData[yearlyData.length - 1]?.resaleValue ?? 0;
  const totalCostOfOwnership = Math.round(cumulativeCost - finalResaleValue);

  // Section 80EEB: ₹1.5L deduction for EV loan interest (income ≤ ₹50L)
  const section80EEBDeduction = isEV && incomeAnnual <= 50_00_000
    ? Math.min(totalLoanInterest, 1_50_000)
    : 0;

  const taxSaved = Math.round(section80EEBDeduction * 0.30); // approx at 30% slab
  const netCostAfterTax = totalCostOfOwnership - taxSaved;
  const realCostOfOwnership = Math.round(netCostAfterTax / Math.pow(1 + inflationRate / 100, ownershipYears));
  const depreciationPerYear = Math.round(purchasePrice * VEHICLE_DEPRECIATION_WDV);

  return {
    yearlyData,
    purchasePrice,
    finalBookValue: bookValue,
    estimatedResaleValue: finalResaleValue,
    totalFuelCost: Math.round(totalFuelCost),
    totalInsuranceCost: Math.round(totalInsuranceCost),
    totalMaintenanceCost: Math.round(totalMaintenanceCost),
    totalLoanInterest: Math.round(totalLoanInterest),
    registrationCost,
    totalCostOfOwnership,
    section80EEBDeduction,
    netCostAfterTax,
    realCostOfOwnership,
    depreciationPerYear,
  };
}