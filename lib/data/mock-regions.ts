export interface RegionStats {
  id: "RM" | "V" | "VI";
  name: string;
  installedKw: number;
  installations: number;
  avgGrowthPct: number;
  topZone: string;
  topZoneScore: number;
  marketShare: number;
  opportunity: string;
  color: string;
}

export const regionStats: RegionStats[] = [
  {
    id: "RM",
    name: "Región Metropolitana",
    installedKw: 129863,
    installations: 8400,
    avgGrowthPct: 34,
    topZone: "Paine",
    topZoneScore: 84,
    marketShare: 52,
    opportunity: "Densidad alta. Corredor Colina–Paine con parcelas premium y bajo nivel de saturación en zonas periurbanas.",
    color: "text-blue-400",
  },
  {
    id: "V",
    name: "Región de Valparaíso",
    installedKw: 65893,
    installations: 3200,
    avgGrowthPct: 41,
    topZone: "Casablanca",
    topZoneScore: 81,
    marketShare: 26,
    opportunity: "Corredor agroenológico y turístico. Alta irradiación y baja saturación. Mercado en etapa temprana con gran potencial.",
    color: "text-amber-400",
  },
  {
    id: "VI",
    name: "Región de O'Higgins",
    installedKw: 37102,
    installations: 2100,
    avgGrowthPct: 58,
    topZone: "Requínoa",
    topZoneScore: 84,
    marketShare: 22,
    opportunity: "La región con mayor crecimiento de Chile. Corredor Rancagua–Requínoa con máxima radiación y mínima competencia instalada.",
    color: "text-green-400",
  },
];

export const sectorBreakdown = [
  { sector: "Agrícola", percent: 41, color: "#10b981" },
  { sector: "Habitacional", percent: 21, color: "#f59e0b" },
  { sector: "Industrial", percent: 18, color: "#3b82f6" },
  { sector: "Comercial", percent: 12, color: "#8b5cf6" },
  { sector: "Turismo", percent: 8, color: "#ec4899" },
];
