export interface KitConfig {
  id: string;
  name: string;
  powerKwp: number;
  panels: number;
  batteries: number;
  inverterType: string;
  priceMin: number;
  priceMax: number;
  monthlyGeneration: number;
  coverageForBill: (monthlyBill: number) => number;
  idealFor: string[];
  description: string;
  badge?: string;
}

export const solarKits: KitConfig[] = [
  {
    id: "starter",
    name: "Kit Starter",
    powerKwp: 1.5,
    panels: 4,
    batteries: 0,
    inverterType: "On-grid monofásico",
    priceMin: 2200000,
    priceMax: 2800000,
    monthlyGeneration: 180,
    coverageForBill: (bill) => Math.min(50, (180 * 60 / bill) * 100),
    idealFor: ["hogar"],
    description: "Ideal para hogares con cuenta baja. Reduce la dependencia de red sin batería.",
  },
  {
    id: "base",
    name: "Kit Base",
    powerKwp: 3,
    panels: 6,
    batteries: 1,
    inverterType: "Híbrido monofásico",
    priceMin: 3500000,
    priceMax: 4300000,
    monthlyGeneration: 360,
    coverageForBill: (bill) => Math.min(75, (360 * 60 / bill) * 100),
    idealFor: ["hogar", "parcela"],
    description: "El más popular. Cubre 60-75% del consumo con respaldo en cortes. Base Solergy.",
    badge: "MÁS POPULAR",
  },
  {
    id: "plus",
    name: "Kit Plus",
    powerKwp: 5,
    panels: 10,
    batteries: 2,
    inverterType: "Híbrido monofásico",
    priceMin: 5800000,
    priceMax: 7200000,
    monthlyGeneration: 600,
    coverageForBill: (bill) => Math.min(88, (600 * 60 / bill) * 100),
    idealFor: ["parcela", "turismo", "pyme"],
    description: "Alto rendimiento para propiedades medianas con bomba de agua o piscina.",
  },
  {
    id: "pro",
    name: "Kit Pro",
    powerKwp: 8,
    panels: 16,
    batteries: 3,
    inverterType: "Trifásico híbrido",
    priceMin: 9500000,
    priceMax: 12000000,
    monthlyGeneration: 960,
    coverageForBill: (bill) => Math.min(92, (960 * 60 / bill) * 100),
    idealFor: ["turismo", "pyme", "agricola"],
    description: "Para negocios y propiedades con alta carga. Incluye respaldo prioritario de cargas críticas.",
  },
  {
    id: "industrial",
    name: "Kit Industrial",
    powerKwp: 15,
    panels: 30,
    batteries: 5,
    inverterType: "Trifásico industrial",
    priceMin: 18000000,
    priceMax: 24000000,
    monthlyGeneration: 1800,
    coverageForBill: (bill) => Math.min(95, (1800 * 60 / bill) * 100),
    idealFor: ["agricola", "negocio"],
    description: "Solución empresarial para altos consumos. Retorno acelerado para industrias y agro.",
    badge: "MÁXIMO RENDIMIENTO",
  },
];

export function recommendKit(monthlyBill: number, propertyType: string): KitConfig {
  const byType: Record<string, string[]> = {
    hogar: ["starter", "base"],
    parcela: ["base", "plus"],
    turismo: ["plus", "pro"],
    pyme: ["plus", "pro"],
    agricola: ["pro", "industrial"],
    negocio: ["pro", "industrial"],
  };

  const validIds = byType[propertyType] ?? ["base", "plus"];
  const candidates = solarKits.filter((k) => validIds.includes(k.id));

  return (
    candidates.find((k) => k.priceMax <= monthlyBill * 48) ??
    candidates[candidates.length - 1]
  );
}

export const KIT_PRICE_PER_KWP = 1279000;
