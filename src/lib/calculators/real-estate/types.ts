export type PropertyType = "land" | "commercial" | "residential" | "virtual";
export type OwnershipType = "freehold" | "leasehold";

export interface RealEstateInput {
  propertyValue: number;
  propertyType: PropertyType;
  ownershipType: OwnershipType;
  state: string;
  holdingYears: number;
  appreciationRate: number;
  rentalYield: number;
  maintenanceMonthly: number;
  propertyTaxAnnual: number;
  loanAmount: number;
  loanRate: number;
  loanTenureYears: number;
  inflationRate: number;
  taxSlab: number;
}

export interface RealEstateYearlyPoint {
  year: number;
  propertyValue: number;
  totalCostToDate: number;
  rentalIncome: number;
  netPosition: number;
  realValue: number;
}

export interface RealEstateOutput {
  yearlyData: RealEstateYearlyPoint[];
  finalPropertyValue: number;
  totalCostOfOwnership: number;
  totalRentalIncome: number;
  stampDuty: number;
  registrationCost: number;
  totalMaintenance: number;
  totalPropertyTax: number;
  capitalGainsTax: number;
  netProceedsAfterTax: number;
  realValueAfterInflation: number;
  roi: number;
  realROI: number;
}

export const STAMP_DUTY: Record<string, number> = {
  maharashtra: 5,
  karnataka: 5,
  delhi: 6,
  tamil_nadu: 7,
  telangana: 6,
  gujarat: 5,
  rajasthan: 6,
  west_bengal: 7,
  haryana: 7,
  uttar_pradesh: 7,
};

export const PROPERTY_TAX_RATE: Record<string, number> = {
  maharashtra: 0.5,
  karnataka: 0.5,
  delhi: 0.7,
  tamil_nadu: 0.6,
  telangana: 0.5,
  gujarat: 0.4,
  rajasthan: 0.5,
  west_bengal: 0.6,
  haryana: 0.6,
  uttar_pradesh: 0.5,
};