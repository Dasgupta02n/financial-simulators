import type { StressTestConfig, SIPInput, YearlyDataPoint } from "./types";
import { computeSIP } from "./engine";

export function applyStressTest(
  input: SIPInput,
  config: StressTestConfig
): YearlyDataPoint[] {
  if (!config.enabled) return [];

  const baseData = computeSIP(input);
  const crashStartYear = input.tenure - config.crashYears;

  return baseData.map((point) => {
    if (point.year > crashStartYear) {
      const yearsIntoCrash = point.year - crashStartYear;
      const crashFactor = Math.pow(1 - config.severity, 1 / config.crashYears);
      const stressedCorpus = point.nominalCorpus * Math.pow(crashFactor, yearsIntoCrash);
      const inflationFactor = Math.pow(1 + input.inflationRate / 100, point.year);

      return {
        ...point,
        stressCorpus: stressedCorpus / inflationFactor,
      };
    }
    return point;
  });
}