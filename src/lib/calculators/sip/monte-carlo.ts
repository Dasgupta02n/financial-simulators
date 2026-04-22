import type { SIPInput } from "./types";

function boxMullerRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function sampleMonthlyReturn(mu: number, sigma: number): number {
  const z = boxMullerRandom();
  return Math.exp((mu - sigma * sigma / 2) / 12 + (sigma * z) / Math.sqrt(12)) - 1;
}

export interface MonteCarloResult {
  p10Path: number[];
  p50Path: number[];
  p90Path: number[];
  allFinalValues: number[];
}

export function runMonteCarlo(
  input: SIPInput,
  simulations: number = 500
): MonteCarloResult {
  const mu = input.returnRate / 100;
  const sigma = 0.18;
  const totalMonths = input.tenure * 12;

  const yearEndPaths: number[][] = Array.from(
    { length: simulations },
    () => []
  );

  for (let sim = 0; sim < simulations; sim++) {
    let lumpsumValue = input.lumpsum;
    let sipAccumulated = 0;

    for (let month = 1; month <= totalMonths; month++) {
      const r = sampleMonthlyReturn(mu, sigma);

      lumpsumValue *= 1 + r;
      sipAccumulated = (sipAccumulated + input.monthlySIP) * (1 + r);

      if (month % 12 === 0) {
        yearEndPaths[sim].push(lumpsumValue + sipAccumulated);
      }
    }
  }

  const allFinalValues = yearEndPaths.map(
    (path) => path[path.length - 1]
  );

  const p10Path: number[] = [];
  const p50Path: number[] = [];
  const p90Path: number[] = [];

  for (let yearIdx = 0; yearIdx < input.tenure; yearIdx++) {
    const yearValues = yearEndPaths
      .map((path) => path[yearIdx])
      .sort((a, b) => a - b);
    p10Path.push(yearValues[Math.floor(simulations * 0.1)]);
    p50Path.push(yearValues[Math.floor(simulations * 0.5)]);
    p90Path.push(yearValues[Math.floor(simulations * 0.9)]);
  }

  return { p10Path, p50Path, p90Path, allFinalValues };
}