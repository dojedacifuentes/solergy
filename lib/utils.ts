import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("es-CL").format(n);
}

export function formatKWh(kwh: number): string {
  return `${formatNumber(kwh)} kWh`;
}

export function calcSavings(
  monthlyBill: number,
  coveragePercent: number
): { monthly: number; yearly: number; fiveYear: number } {
  const monthly = monthlyBill * (coveragePercent / 100);
  return {
    monthly: Math.round(monthly),
    yearly: Math.round(monthly * 12),
    fiveYear: Math.round(monthly * 12 * 5),
  };
}

export function calcROI(investment: number, yearlySavings: number): number {
  if (yearlySavings <= 0) return 0;
  return Math.round(investment / yearlySavings);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    nuevo: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    contactado: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    evaluacion: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    propuesta: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    cerrado: "bg-green-500/20 text-green-300 border-green-500/30",
    perdido: "bg-red-500/20 text-red-300 border-red-500/30",
  };
  return map[status] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30";
}

export function getPriorityIcon(priority: string): string {
  const map: Record<string, string> = {
    ahorro: "💰",
    respaldo: "🔋",
    independencia: "⚡",
    plusvalia: "🏠",
  };
  return map[priority] ?? "⚡";
}
