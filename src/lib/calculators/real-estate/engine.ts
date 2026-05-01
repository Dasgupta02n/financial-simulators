import type { RealEstateInput, RealEstateOutput, RealEstateYearlyPoint } from "./types";
import { STAMP_DUTY, PROPERTY_TAX_RATE } from "./types";

export function computeRealEstate(input: RealEstateInput): RealEstateOutput {
  const {
    propertyValue,
    propertyType,
    ownershipType,
    state,
    holdingYears,
    appreciationRate,
    rentalYield,
    maintenanceMonthly,
    propertyTaxAnnual,
    loanAmount,
    loanRate,
    loanTenureYears,
    inflationRate,
    taxSlab,
  } = input;

  const stampDutyPct = STAMP_DUTY[state] ?? 6;
  const propTaxPct = PROPERTY_TAX_RATE[state] ?? 0.5;

  const stampDuty = Math.round(propertyValue * (stampDutyPct / 100));
  const registrationCost = Math.round(propertyValue * 0.01);

  // Leasehold appreciation penalty: ~1.5% lower
  const effectiveAppreciation = ownershipType === "leasehold"
    ? appreciationRate - 1.5
    : appreciationRate;

  // No rental yield for land or virtual
  const hasRental = propertyType === "commercial" || propertyType === "residential";
  const effectiveRentalYield = hasRental ? rentalYield : 0;

  const yearlyData: RealEstateYearlyPoint[] = [];
  let totalCostToDate = propertyValue + stampDuty + registrationCost;
  let totalRentalIncome = 0;
  let currentPropertyValue = propertyValue;
  let currentMaintenance = maintenanceMonthly * 12;
  let currentPropertyTax = propertyTaxAnnual > 0 ? propertyTaxAnnual : Math.round(propertyValue * (propTaxPct / 100));
  let currentRental = Math.round(propertyValue * (effectiveRentalYield / 100));

  // Loan EMI cost
  const hasLoan = loanAmount > 0;
  const monthlyRate = loanRate / 100 / 12;
  const totalLoanMonths = loanTenureYears * 12;
  let emi = 0;
  if (hasLoan && monthlyRate > 0 && totalLoanMonths > 0) {
    emi = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalLoanMonths)) /
      (Math.pow(1 + monthlyRate, totalLoanMonths) - 1)
    );
  }

  for (let year = 1; year <= holdingYears; year++) {
    // Appreciate property
    currentPropertyValue = Math.round(currentPropertyValue * (1 + effectiveAppreciation / 100));

    // Costs this year (inflated)
    currentMaintenance = Math.round(currentMaintenance * (1 + inflationRate / 100));
    currentPropertyTax = Math.round(currentPropertyTax * (1 + inflationRate / 100));

    // Rental income (inflated)
    currentRental = Math.round(currentRental * (1 + inflationRate / 100));

    totalCostToDate += currentMaintenance + currentPropertyTax;
    if (hasLoan && year <= loanTenureYears) {
      totalCostToDate += emi * 12;
    }
    totalRentalIncome += currentRental;

    const netPosition = currentPropertyValue + totalRentalIncome - totalCostToDate;
    const realValue = Math.round(currentPropertyValue / Math.pow(1 + inflationRate / 100, year));

    yearlyData.push({
      year,
      propertyValue: currentPropertyValue,
      totalCostToDate: Math.round(totalCostToDate),
      rentalIncome: totalRentalIncome,
      netPosition: Math.round(netPosition),
      realValue,
    });
  }

  // Capital gains tax
  const gains = currentPropertyValue - propertyValue;
  const isLTCG = holdingYears > 2;
  let capitalGainsTax = 0;
  if (isLTCG) {
    // Section 54 exemption: if reinvested, no tax. Assume no reinvestment.
    const indexationFactor = Math.pow(1 + inflationRate / 100, holdingYears);
    const indexedCost = Math.round(propertyValue * indexationFactor);
    const indexedGains = Math.max(0, currentPropertyValue - indexedCost);
    capitalGainsTax = Math.round(indexedGains * 0.20); // 20% with indexation for LTCG
  } else {
    capitalGainsTax = Math.round(gains * (taxSlab / 100)); // Short-term at slab
  }

  const netProceedsAfterTax = currentPropertyValue - capitalGainsTax;
  const finalPoint = yearlyData[yearlyData.length - 1];
  const realValueAfterInflation = finalPoint.realValue;

  const roi = ((netProceedsAfterTax + totalRentalIncome - totalCostToDate) / propertyValue) * 100;
  const realROI = roi - inflationRate * holdingYears;

  return {
    yearlyData,
    finalPropertyValue: currentPropertyValue,
    totalCostOfOwnership: Math.round(totalCostToDate),
    totalRentalIncome: Math.round(totalRentalIncome),
    stampDuty,
    registrationCost,
    totalMaintenance: 0,
    totalPropertyTax: 0,
    capitalGainsTax,
    netProceedsAfterTax: Math.round(netProceedsAfterTax),
    realValueAfterInflation,
    roi: Math.round(roi * 100) / 100,
    realROI: Math.round(realROI * 100) / 100,
  };
}