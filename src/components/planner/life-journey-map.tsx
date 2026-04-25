"use client";

import type { PlannerGoal } from "@/lib/planner/types";
import { formatINR } from "@/lib/format";
import { twMerge } from "tailwind-merge";

interface Props {
  goals: PlannerGoal[];
  currentAge?: number;
}

const GOAL_COLORS: Record<string, string> = {
  emergency_fund: "bg-loss",
  home: "bg-sienna",
  education: "bg-blue-400",
  marriage: "bg-pink-400",
  retirement: "bg-gain",
  car: "bg-amber-400",
  travel: "bg-purple-400",
  health: "bg-teal-400",
};

const GOAL_ICONS: Record<string, string> = {
  emergency_fund: "🛡️",
  home: "🏠",
  education: "🎓",
  marriage: "💍",
  retirement: "🏖️",
  car: "🚗",
  travel: "✈️",
  health: "🏥",
};

export function LifeJourneyMap({ goals, currentAge = 30 }: Props) {
  if (goals.length === 0) return null;

  const sortedGoals = [...goals].sort((a, b) => a.yearsFromNow - b.yearsFromNow);
  const maxYear = Math.max(...sortedGoals.map((g) => g.yearsFromNow), 5);
  const timelineYears = Math.min(maxYear + 2, 40);

  // Generate year markers
  const markers: number[] = [];
  const step = timelineYears <= 10 ? 1 : timelineYears <= 20 ? 2 : 5;
  for (let y = 0; y <= timelineYears; y += step) markers.push(y);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text-primary">Life Journey Timeline</h3>
      <p className="text-xs text-text-secondary">Your financial milestones plotted over time</p>

      <div className="relative bg-white border border-border rounded-lg p-4 overflow-x-auto">
        {/* Timeline axis */}
        <div className="relative min-h-[180px] ml-8">
          {/* Year markers */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
          <div className="flex justify-between">
            {markers.map((y) => (
              <div key={y} className="flex flex-col items-center" style={{ minWidth: "30px" }}>
                <div className="w-px h-2 bg-border" />
                <span className="text-[9px] font-mono text-text-muted mt-1">
                  {currentAge + y}
                </span>
              </div>
            ))}
          </div>

          {/* Goal markers */}
          <div className="flex flex-col gap-6 mt-4 pb-6">
            {sortedGoals.map((goal, i) => {
              const leftPct = (goal.yearsFromNow / timelineYears) * 100;
              const color = GOAL_COLORS[goal.type] || "bg-sienna";
              const icon = GOAL_ICONS[goal.type] || "🎯";
              const priorityBorder = goal.priority === "essential"
                ? "border-loss/40"
                : goal.priority === "important"
                  ? "border-amber-300"
                  : "border-border";

              return (
                <div
                  key={goal.id}
                  className="relative"
                  style={{ paddingLeft: `${leftPct}%` }}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className={twMerge("w-3 h-3 rounded-full", color)} />
                  </div>

                  {/* Connector line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-border" style={{ left: `${leftPct}%` }} />

                  {/* Goal card */}
                  <div className={twMerge("ml-2 p-2 rounded-md border bg-white text-left", priorityBorder)}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{icon}</span>
                      <span className="text-xs font-semibold text-text-primary">{goal.name}</span>
                    </div>
                    <div className="text-[10px] font-mono text-text-muted mt-0.5">
                      Age {currentAge + goal.yearsFromNow} · {goal.yearsFromNow} yr{goal.yearsFromNow !== 1 ? "s" : ""} from now
                    </div>
                    <div className="text-[10px] font-mono text-sienna font-semibold">
                      {formatINR(goal.targetAmount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}