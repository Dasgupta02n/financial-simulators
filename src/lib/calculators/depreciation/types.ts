export type VehicleType = "car" | "bike" | "commercial";

export interface DepreciationInput {
  vehicleType: VehicleType;
  purchasePrice: number;
  ownershipYears: number;
  isEV: boolean;
  loanAmount: number;
  loanRate: number;
  loanTenureYears: number;
  fuelCostMonthly: number;
  insuranceAnnual: number;
  maintenanceAnnual: number;
  registrationCost: number;
  inflationRate: number;
  incomeAnnual: number;
}

export interface DepreciationYearlyPoint {
  year: number;
  bookValue: number;
  resaleValue: number;
  fuelCost: number;
  insuranceCost: number;
  maintenanceCost: number;
  cumulativeCost: number;
  realCumulativeCost: number;
}

export interface DepreciationOutput {
  yearlyData: DepreciationYearlyPoint[];
  purchasePrice: number;
  finalBookValue: number;
  estimatedResaleValue: number;
  totalFuelCost: number;
  totalInsuranceCost: number;
  totalMaintenanceCost: number;
  totalLoanInterest: number;
  registrationCost: number;
  totalCostOfOwnership: number;
  section80EEBDeduction: number;
  netCostAfterTax: number;
  realCostOfOwnership: number;
  depreciationPerYear: number;
}

export const VEHICLE_DEPRECIATION_WDV = 0.15; // 15% WDV per Income Tax Act

export const RESALE_PERCENT: Record<VehicleType, number[]> = {
  car: [0, 80, 70, 60, 50, 42, 35, 28, 22, 18, 15, 12, 10],
  bike: [0, 75, 60, 48, 38, 30, 24, 19, 15, 12, 10],
  commercial: [0, 70, 55, 42, 32, 25, 20, 16, 13, 10, 8],
};