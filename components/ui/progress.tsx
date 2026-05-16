"use client";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: "solar" | "blue" | "green" | "purple";
}

export function Progress({ value, max = 100, color = "solar", className, ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={cn("w-full bg-slate-800 rounded-full overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          {
            "bg-gradient-to-r from-amber-600 to-amber-400": color === "solar",
            "bg-gradient-to-r from-blue-600 to-blue-400": color === "blue",
            "bg-gradient-to-r from-green-600 to-green-400": color === "green",
            "bg-gradient-to-r from-purple-600 to-purple-400": color === "purple",
          }
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
