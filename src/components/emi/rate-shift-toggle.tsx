"use client";

import { twMerge } from "tailwind-merge";
import type { RateShift, RateShiftPoint } from "@/lib/calculators/emi/types";

interface RateShiftToggleProps {
  rateShift: RateShift;
  onChange: (shift: RateShift) => void;
}

function ShiftRow({
  shift,
  index,
  onUpdate,
  onRemove,
}: {
  shift: RateShiftPoint;
  index: number;
  onUpdate: (i: number, s: RateShiftPoint) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-secondary font-mono w-20">After Y{shift.afterYear}</span>
      <input
        type="range"
        min={1}
        max={30}
        step={1}
        value={shift.afterYear}
        onChange={(e) => onUpdate(index, { ...shift, afterYear: parseInt(e.target.value) })}
        className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-border accent-gain"
      />
      <span className="text-xs text-text-secondary font-mono w-16 text-right">
        {shift.bpsChange > 0 ? "+" : ""}{shift.bpsChange} bps
      </span>
      <input
        type="range"
        min={-200}
        max={200}
        step={25}
        value={shift.bpsChange}
        onChange={(e) => onUpdate(index, { ...shift, bpsChange: parseInt(e.target.value) })}
        className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-border accent-warn"
      />
      <button
        onClick={() => onRemove(index)}
        className="text-text-secondary hover:text-loss text-sm px-1"
      >
        ×
      </button>
    </div>
  );
}

export function RateShiftToggle({ rateShift, onChange }: RateShiftToggleProps) {
  const handleToggle = () => {
    if (!rateShift.enabled) {
      onChange({ enabled: true, shifts: [{ afterYear: 2, bpsChange: -25 }] });
    } else {
      onChange({ ...rateShift, enabled: !rateShift.enabled });
    }
  };

  const addShift = () => {
    const lastYear = rateShift.shifts.length > 0
      ? rateShift.shifts[rateShift.shifts.length - 1].afterYear + 2
      : 2;
    onChange({
      ...rateShift,
      shifts: [...rateShift.shifts, { afterYear: Math.min(lastYear, 30), bpsChange: -25 }],
    });
  };

  const updateShift = (i: number, s: RateShiftPoint) => {
    const newShifts = [...rateShift.shifts];
    newShifts[i] = s;
    onChange({ ...rateShift, shifts: newShifts });
  };

  const removeShift = (i: number) => {
    onChange({ ...rateShift, shifts: rateShift.shifts.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="border-t border-border pt-4 mt-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary font-semibold">
          Rate Shift (RBI Cycle)
        </span>
        <button
          className={twMerge(
            "w-10 h-5 rounded-full transition-colors relative",
            rateShift.enabled ? "bg-warn" : "bg-border"
          )}
          onClick={handleToggle}
        >
          <span
            className={twMerge(
              "absolute top-0.5 w-4 h-4 rounded-full bg-text-primary transition-transform",
              rateShift.enabled ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>
      </div>

      {rateShift.enabled && (
        <div className="flex flex-col gap-3 mt-4">
          {rateShift.shifts.map((shift, i) => (
            <ShiftRow
              key={i}
              shift={shift}
              index={i}
              onUpdate={updateShift}
              onRemove={removeShift}
            />
          ))}
          {rateShift.shifts.length < 5 && (
            <button
              onClick={addShift}
              className="text-xs text-gain hover:text-gain/80 font-mono self-start"
            >
              + Add Shift Point
            </button>
          )}
          <p className="text-xs text-text-secondary mt-1">
            Model expected RBI rate changes. Negative bps = rate cut (easing), positive = hike (tightening).
          </p>
        </div>
      )}
    </div>
  );
}