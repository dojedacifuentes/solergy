import type { LeadScore } from "@/types";
import { solarZones } from "@/lib/data/mock-zones";

interface ScoringInput {
  monthlyBill: number;
  region: string;
  commune: string;
  propertyType: string;
  nightConsumption: string;
  hasPool: boolean;
  hasWaterPump: boolean;
  workFromHome: boolean;
  priority: string;
}

function scoreConsumo(monthlyBill: number): number {
  if (monthlyBill >= 400000) return 30;
  if (monthlyBill >= 200000) return 25;
  if (monthlyBill >= 100000) return 18;
  if (monthlyBill >= 60000) return 12;
  return 8;
}

function scoreRadiacion(region: string, commune: string): number {
  const zone = solarZones.find(
    (z) => z.region === region && z.name.toLowerCase() === commune.toLowerCase()
  );
  if (!zone) {
    if (region === "VI") return 18;
    if (region === "V") return 16;
    return 15;
  }
  return Math.round((zone.radiationScore / 100) * 20);
}

function scoreContinuidad(propertyType: string, region: string): number {
  const typeMap: Record<string, number> = {
    agricola: 15,
    negocio: 14,
    turismo: 13,
    parcela: 12,
    pyme: 11,
    hogar: 9,
  };
  const base = typeMap[propertyType] ?? 10;
  if (region === "V") return Math.min(15, base + 2);
  return base;
}

function scoreCapacidadPago(monthlyBill: number, propertyType: string): number {
  const typeMultiplier: Record<string, number> = {
    negocio: 1.2,
    agricola: 1.1,
    turismo: 1.1,
    pyme: 1.0,
    parcela: 1.0,
    hogar: 0.9,
  };
  const raw = Math.min(20, (monthlyBill / 30000) * typeMultiplier[propertyType ?? "hogar"]);
  return Math.round(raw);
}

function scoreSaturacion(region: string, commune: string): number {
  const zone = solarZones.find(
    (z) => z.region === region && z.name.toLowerCase() === commune.toLowerCase()
  );
  if (!zone) {
    if (region === "VI") return 14;
    if (region === "V") return 13;
    return 10;
  }
  return Math.round(((100 - zone.saturationScore) / 100) * 15);
}

function getProfileLabel(total: number, propertyType: string, priority: string): string {
  if (total >= 80) {
    if (propertyType === "agricola") return "AGRO DIURNO IDEAL";
    if (propertyType === "negocio" || propertyType === "pyme") return "COMERCIO & PYME";
    if (propertyType === "turismo") return "TURISMO SOSTENIBLE";
    return "ALTO POTENCIAL";
  }
  if (total >= 65) {
    if (priority === "respaldo") return "RESPALDO CRÍTICO";
    if (priority === "plusvalia") return "PLUSVALÍA VERDE";
    if (propertyType === "parcela") return "RESIDENCIAL PREMIUM";
    return "PERFIL SÓLIDO";
  }
  if (total >= 50) return "POTENCIAL MEDIO";
  return "ETAPA TEMPRANA";
}

function getRecommendation(total: number, propertyType: string): string {
  if (total >= 80)
    return "Oportunidad prioritaria. Contacto inmediato recomendado. Alta probabilidad de cierre.";
  if (total >= 65)
    return "Buen perfil. Presentar propuesta en primera llamada. Énfasis en ahorro mensual.";
  if (total >= 50)
    return "Perfil con potencial. Nutrir con información antes de propuesta formal.";
  return "Perfil en etapa de evaluación. Compartir simulación educativa primero.";
}

export function scoreLeadInput(input: ScoringInput): LeadScore {
  const consumo = scoreConsumo(input.monthlyBill);
  const radiacion = scoreRadiacion(input.region, input.commune);
  const continuidad = scoreContinuidad(input.propertyType, input.region);
  const capacidadPago = scoreCapacidadPago(input.monthlyBill, input.propertyType);
  const saturacion = scoreSaturacion(input.region, input.commune);

  const total = consumo + radiacion + continuidad + capacidadPago + saturacion;

  return {
    total,
    breakdown: { consumo, radiacion, continuidad, capacidadPago, saturacion },
    profileLabel: getProfileLabel(total, input.propertyType, input.priority),
    priority: total >= 70 ? "alta" : total >= 50 ? "media" : "baja",
    recommendation: getRecommendation(total, input.propertyType),
  };
}
