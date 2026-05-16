interface StatsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon: string;
  color?: string;
}

export function StatsCard({ label, value, unit, trend, icon, color = "text-amber-400" }: StatsCardProps) {
  return (
    <div className="glass rounded-2xl p-5 hover:border-amber-500/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold ${color}`}>
        {value}
        {unit && <span className="text-base font-normal text-slate-400 ml-1">{unit}</span>}
      </div>
      <div className="text-slate-400 text-sm mt-1">{label}</div>
    </div>
  );
}
