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
    <div className={twMerge("flex flex-col gap-1", className)}>
      <span className="text-xs uppercase tracking-wider text-text-secondary font-mono">
        {label}
      </span>
      <span
        className={twMerge(
          "text-2xl font-mono font-semibold",
          variantStyles[variant]
        )}
      >
        {formatINR(value)}
      </span>
    </div>
  );
}