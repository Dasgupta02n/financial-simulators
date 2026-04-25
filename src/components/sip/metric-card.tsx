import { twMerge } from "tailwind-merge";
import { formatINR } from "@/lib/format";

interface MetricCardProps {
  label: string;
  value: number;
  variant?: "neutral" | "gain" | "loss" | "warn";
  className?: string;
}

const variantStyles = {
  neutral: "text-text-primary",
  gain: "text-gain",
  loss: "text-loss",
  warn: "text-warn",
} as const;

export function MetricCard({
  label,
  value,
  variant = "neutral",
  className,
}: MetricCardProps) {
  return (
    <div className={twMerge("flex flex-col gap-0.5", className)}>
      <span className="text-[10px] uppercase tracking-wider text-text-secondary font-mono">
        {label}
      </span>
      <span
        className={twMerge(
          "text-xl font-mono font-semibold",
          variantStyles[variant]
        )}
      >
        {formatINR(value)}
      </span>
    </div>
  );
}