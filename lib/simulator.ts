import type { SimulatorInput, SimulatorResult, SimulatorScenario } from "@/types";
import { solarZones } from "@/lib/data/mock-zones";

function getZoneScore(region: string, commune: string): number {
  const zone = solarZones.find(
    (z) => z.region === region && z.name.toLowerCase() === commune.toLowerCase()
  );
  return zone?.solarScore ?? 75;
}

function habitMultiplier(input: SimulatorInput): number {
  let m = 1.0;
  if (input.hasPool) m += 0.08;
  if (input.hasWaterPump) m += 0.06;
  if (input.workFromHome) m += 0.04;
  if (input.nightConsumption === "alto") m -= 0.06;
  if (input.nightConsumption === "medio") m -= 0.03;
  return m;
}

function habitImpactMessage(input: SimulatorInput): string {
  const gains: string[] = [];
  const losses: string[] = [];

  if (input.hasPool) gains.push("piscina en horario solar (+8% retorno)");
  if (input.hasWaterPump) gains.push("bomba de agua diurna (+6% retorno)");
  if (input.workFromHome) gains.push("teletrabajo consume en peak solar (+4% retorno)");
  if (input.nightConsumption === "alto")
    losses.push("alto consumo nocturno reduce cobertura efectiva (-6%)");
  else if (input.nightConsumption === "medio")
    losses.push("consumo nocturno moderado (-3%)");

  if (gains.length === 0 && losses.length === 0)
    return "Tu perfil de consumo es equilibrado. Pequeños cambios de hábito pueden acelerar el retorno hasta un 20%.";

  const parts: string[] = [];
  if (gains.length) parts.push(`✅ Ventajas: ${gains.join(", ")}.`);
  if (losses.length) parts.push(`⚠️ A optimizar: ${losses.join(", ")}.`);
  return parts.join(" ");
}

function buildScenario(
  label: string,
  description: string,
  baseCoverage: number,
  coverageSpread: number,
  monthlyBill: number,
  habitMult: number,
  panels: number,
  batteries: number,
  kitName: string,
  recommendation: string
): SimulatorScenario {
  const adjCoverage = Math.min(95, baseCoverage * habitMult);
  const coverageLow = Math.max(35, adjCoverage - coverageSpread);
  const coverageHigh = Math.min(97, adjCoverage + coverageSpread);

  const savingLow = Math.round((monthlyBill * coverageLow) / 100 / 1000) * 1000;
  const savingHigh = Math.round((monthlyBill * coverageHigh) / 100 / 1000) * 1000;
  const savingMid = Math.round((savingLow + savingHigh) / 2 / 1000) * 1000;

  const investMin = Math.round((panels * 350000 + batteries * 800000) / 100000) * 100000;
  const investMax = Math.round(investMin * 1.3 / 100000) * 100000;

  const roiLow = parseFloat((investMin / (savingMid * 12)).toFixed(1));
  const roiHigh = parseFloat((investMax / (savingLow * 12 || 1)).toFixed(1));
  const roiMid = parseFloat(((roiLow + roiHigh) / 2).toFixed(1));

  return {
    label,
    description,
    coverageRange: [Math.round(coverageLow), Math.round(coverageHigh)],
    coveragePercent: Math.round(adjCoverage),
    monthlySavingRange: [savingLow, savingHigh],
    monthlySaving: savingMid,
    yearlySaving: savingMid * 12,
    roiRange: [roiLow, roiHigh],
    roiYears: roiMid,
    investmentMin: investMin,
    investmentMax: investMax,
    independenceLevel: Math.round(adjCoverage),
    panels,
    batteries,
    recommendation,
    kitName,
  };
}

const PROPERTY_LABELS: Record<string, string> = {
  hogar: "Hogar residencial",
  parcela: "Parcela / campo",
  pyme: "Pyme",
  turismo: "Turismo / cabañas",
  agricola: "Agrícola",
  negocio: "Negocio / comercio",
};

export function runSimulator(input: SimulatorInput): SimulatorResult {
  const billFactor = input.monthlyBill / 100000;
  const habitMult = habitMultiplier(input);
  const zoneScore = getZoneScore(input.region, input.commune);
  const zoneName = input.commune || "tu zona";

  const basePanels = Math.max(4, Math.round(6 * billFactor));
  const hasResil = input.resilience ?? false;

  const conservative = buildScenario(
    "Conservador",
    "Reduce cuenta con inversión mínima, sin batería o con batería básica",
    48,
    8,
    input.monthlyBill,
    habitMult,
    Math.max(4, basePanels - 2),
    hasResil ? 1 : 0,
    "Kit Starter / Base",
    "Ideal si priorizas bajo costo inicial. Ahorro inmediato sin complejidad."
  );

  const smart = buildScenario(
    "Inteligente",
    "El equilibrio óptimo entre ahorro, retorno y autonomía",
    70,
    7,
    input.monthlyBill,
    habitMult,
    basePanels,
    hasResil ? 2 : 1,
    "Kit Base / Plus",
    "La opción más recomendada. Cubre la mayor parte del consumo con respaldo ante cortes."
  );

  const optimized = buildScenario(
    "Optimizado",
    "Máxima independencia energética y retorno a largo plazo",
    88,
    5,
    input.monthlyBill,
    habitMult,
    basePanels + 4,
    hasResil ? 4 : 2,
    "Kit Plus / Pro",
    "Para quienes buscan independencia total. El excedente de energía retorna a la red."
  );

  const zoneBonus =
    zoneScore >= 80
      ? ` ${zoneName} tiene puntaje solar ${zoneScore}/100 — zona de alta irradiación que acelera el retorno.`
      : zoneScore >= 70
      ? ` ${zoneName} tiene buena radiación solar (${zoneScore}/100).`
      : "";

  const systemRec = `Según tu consumo de ${(input.monthlyBill / 1000).toFixed(0)}K CLP/mes y perfil "${PROPERTY_LABELS[input.propertyType] ?? input.propertyType}", el sistema Inteligente de ${smart.panels} paneles + ${smart.batteries} batería${smart.batteries !== 1 ? "s" : ""} es el punto de partida ideal.${zoneBonus}`;

  return {
    conservative,
    smart,
    optimized,
    habitImpact: habitImpactMessage(input),
    systemRec,
    zoneScore,
    zoneName,
  };
}
