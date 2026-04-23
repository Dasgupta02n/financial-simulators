export interface HRAInput {
  basicSalary: number;
  hraReceived: number;
  rentPaid: number;
  metroCity: boolean;
}

export interface HRAOutput {
 hraExemption: number;
  taxableHRA: number;
  breakdown: {
    actualHRA: number;
    rentOver10Percent: number;
    metroLimit: number;
  };
}