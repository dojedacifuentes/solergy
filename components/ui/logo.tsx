import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}

export function Logo({ className, size = "md", dark = false }: LogoProps) {
  const sizes = { sm: 28, md: 36, lg: 48 };
  const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-3xl" };
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="19" fill="#0a0f1e" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="7" fill="#f59e0b" />
        <g stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round">
          <line x1="20" y1="4" x2="20" y2="9" />
          <line x1="20" y1="31" x2="20" y2="36" />
          <line x1="4" y1="20" x2="9" y2="20" />
          <line x1="31" y1="20" x2="36" y2="20" />
          <line x1="8.8" y1="8.8" x2="12.4" y2="12.4" />
          <line x1="27.6" y1="27.6" x2="31.2" y2="31.2" />
          <line x1="31.2" y1="8.8" x2="27.6" y2="12.4" />
          <line x1="12.4" y1="27.6" x2="8.8" y2="31.2" />
        </g>
      </svg>
      <span className={cn("font-bold tracking-tight", textSizes[size], dark ? "text-slate-900" : "text-white")}>
        Sol<span className="text-amber-400">ergy</span>
      </span>
    </div>
  );
}
