export type Region = "RM" | "V" | "VI";
export type PropertyType = "parcela" | "hogar" | "pyme" | "turismo" | "agricola" | "negocio";
export type Priority = "ahorro" | "respaldo" | "independencia" | "plusvalia";
export type NightConsumption = "bajo" | "medio" | "alto";
export type LeadStatus = "nuevo" | "contactado" | "evaluacion" | "propuesta" | "cerrado" | "perdido";
export type IndependenceLevel = "basico" | "intermedio" | "avanzado" | "premium";

export interface Lead {
  id: string;
  name: string;
  commune: string;
  region: Region;
  propertyType: PropertyType;
  monthlyBill: number;
  priority: Priority;
  potentialSaving: number;
  status: LeadStatus;
  projectValue: number;
  phone?: string;
  email?: string;
  createdAt: string;
  notes?: string;
  score?: number;
  profileLabel?: string;
}

export interface SimulatorInput {
  region: Region;
  commune: string;
  propertyType: PropertyType;
  monthlyBill: number;
  people: number;
  hasPool: boolean;
  hasWaterPump: boolean;
  workFromHome: boolean;
  nightConsumption: NightConsumption;
  priority: Priority;
  resilience?: boolean;
}

export interface SimulatorScenario {
  label: string;
  description: string;
  coverageRange: [number, number];
  coveragePercent: number;
  monthlySavingRange: [number, number];
  monthlySaving: number;
  yearlySaving: number;
  roiRange: [number, number];
  roiYears: number;
  investmentMin: number;
  investmentMax: number;
  independenceLevel: number;
  panels: number;
  batteries: number;
  recommendation: string;
  kitName: string;
}

export interface SimulatorResult {
  conservative: SimulatorScenario;
  smart: SimulatorScenario;
  optimized: SimulatorScenario;
  habitImpact: string;
  systemRec: string;
  zoneScore?: number;
  zoneName?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  type: PropertyType;
  location: string;
  region: Region;
  monthlyBillBefore: number;
  monthlyBillAfter: number;
  saving: number;
  roiYears: number;
  mainBenefit: string;
  description: string;
  system: string;
  image: string;
}

export interface KpiData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon: string;
  color: string;
}

export interface ZoneData {
  name: string;
  region: Region;
  lat: number;
  lng: number;
  clientType: PropertyType[];
  opportunity: "alta" | "media" | "baja";
  potentialLeads: number;
  avgBill: number;
  mainNeed: string;
}

export interface MonthlyData {
  month: string;
  kwhGenerated: number;
  savings: number;
  leads: number;
}

export interface HabitScenario {
  id: string;
  appliance: string;
  icon: string;
  timeDay: string;
  timeNight: string;
  impactLabel: string;
  impactPercent: number;
}

export interface LeadScore {
  total: number;
  breakdown: {
    consumo: number;
    radiacion: number;
    continuidad: number;
    capacidadPago: number;
    saturacion: number;
  };
  profileLabel: string;
  priority: "alta" | "media" | "baja";
  recommendation: string;
}
