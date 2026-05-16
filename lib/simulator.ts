import type { SimulatorInput, SimulatorResult, SimulatorScenario } from "@/types";

const BILL_TO_KWH = 3200; // approx CLP per kWh

function habitMultiplier(input: SimulatorInput): number {
  let mult = 1;
  if (input.workFromHome) mult += 0.08;
  if (input.hasPool) mult += 0.12;
  if (input.hasWaterPump) mult += 0.07;
  if (input.nightConsumption === "alto") mult -= 0.15;
  if (input.nightConsumption === "bajo") mult += 0.1;
  return mult;
}

function buildScenario(
  label: string,
  description: string,
  input: SimulatorInput,
  coveragePct: number,
  panels: number,
  batteries: number,
  investmentBase: number,
  recommendation: string,
): SimulatorScenario {
  const hm = habitMultiplier(input);
  const effectiveCoverage = Math.min(95, coveragePct * hm);
  const monthlySaving = Math.round(input.monthlyBill * (effectiveCoverage / 100));
  const yearlySaving = monthlySaving * 12;
  const roiYears = yearlySaving > 0 ? parseFloat((investmentBase / yearlySaving).toFixed(1)) : 0;
  const investmentMin = Math.round(investmentBase * 0.9 / 100000) * 100000;
  const investmentMax = Math.round(investmentBase * 1.15 / 100000) * 100000;

  return {
    label,
    description,
    coveragePercent: Math.round(effectiveCoverage),
    monthlySaving,
    yearlySaving,
    roiYears,
    investmentMin,
    investmentMax,
    independenceLevel: Math.round(effectiveCoverage),
    panels,
    batteries,
    recommendation,
  };
}

export function runSimulator(input: SimulatorInput): SimulatorResult {
  const { monthlyBill, priority, hasPool, hasWaterPump, nightConsumption } = input;

  // Scale system size by bill
  const billFactor = monthlyBill / 100000;
  const basePanels = Math.max(4, Math.round(6 * billFactor));
  const baseBatteries = hasPool || hasWaterPump ? 2 : 1;

  const conservative = buildScenario(
    "Conservador",
    "Sistema básico con cobertura parcial. Ideal para empezar y evaluar.",
    input,
    48,
    basePanels,
    0,
    3900000 * billFactor,
    `${basePanels} paneles + inversor on-grid. Sin batería, reduce cuenta diurna.`
  );

  const smart = buildScenario(
    "Inteligente",
    "El equilibrio perfecto entre ahorro, respaldo y retorno.",
    input,
    70,
    Math.round(basePanels * 1.4),
    baseBatteries,
    6200000 * billFactor,
    `${Math.round(basePanels * 1.4)} paneles + ${baseBatteries} batería(s) + inversor híbrido. Respaldo nocturno incluido.`
  );

  const optimized = buildScenario(
    "Optimizado",
    "Máxima independencia energética. Para quienes quieren el control total.",
    input,
    88,
    Math.round(basePanels * 2),
    baseBatteries + 1,
    9800000 * billFactor,
    `${Math.round(basePanels * 2)} paneles + ${baseBatteries + 1} baterías + inversor bidireccional. Excedente a la red.`
  );

  let habitImpact = "";
  const improvable: string[] = [];
  if (nightConsumption === "alto") improvable.push("mover consumo al horario solar (+15% retorno)");
  if (hasPool) improvable.push("programar bomba de piscina en horas pico solar (+25% eficiencia)");
  if (hasWaterPump) improvable.push("operar bomba de agua en horario solar (+7%)");

  habitImpact = improvable.length > 0
    ? `Tus hábitos actuales reducen la eficiencia. Si ajustas: ${improvable.join("; ")}.`
    : "Tus hábitos son compatibles con solar. Excelente punto de partida.";

  const systemRec =
    priority === "respaldo"
      ? "Recomendamos el escenario Inteligente o Optimizado por su enfoque en baterías de respaldo."
      : priority === "independencia"
      ? "El escenario Optimizado maximiza tu autonomía y te desconecta casi completamente de la red."
      : priority === "plusvalia"
      ? "Cualquier sistema suma plusvalía, pero el Inteligente o Optimizado tiene mayor impacto en tasación."
      : "Para maximizar ahorro con menor inversión inicial, el escenario Inteligente ofrece el mejor ROI.";

  return { conservative, smart, optimized, habitImpact, systemRec };
}
