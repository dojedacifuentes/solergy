import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "solar" | "success" | "warning" | "danger" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        {
          "bg-slate-700/50 text-slate-300 border-slate-600/50": variant === "default",
          "bg-amber-500/20 text-amber-300 border-amber-500/30": variant === "solar",
          "bg-green-500/20 text-green-300 border-green-500/30": variant === "success",
          "bg-orange-500/20 text-orange-300 border-orange-500/30": variant === "warning",
          "bg-red-500/20 text-red-300 border-red-500/30": variant === "danger",
          "bg-transparent text-slate-400 border-slate-600": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
