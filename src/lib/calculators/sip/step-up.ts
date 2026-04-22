import type { StepUpMode } from "./types";

export function getYearlySIP(
  baseSIP: number,
  year: number,
  mode: StepUpMode,
  stepUpValue: number
): number {
  if (year === 0) return baseSIP;
  const prevSIP = getYearlySIP(baseSIP, year - 1, mode, stepUpValue);
  if (mode === "percentage") {
    return prevSIP * (1 + stepUpValue / 100);
  }
  return prevSIP + stepUpValue;
}