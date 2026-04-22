export function realReturn(nominalRate: number, inflationRate: number): number {
  return (1 + nominalRate) / (1 + inflationRate) - 1;
}

export function presentValue(futureValue: number, inflationRate: number, years: number): number {
  return futureValue / Math.pow(1 + inflationRate, years);
}