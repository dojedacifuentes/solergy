// Panel de configuración local — no exponer en UI pública
// Credenciales solo para acceso local/demo — no sustituye autenticación real

export const ADMIN_CREDENTIALS = {
  username: "solergy",
  password: "energia2026",
} as const;

export const COMPANY_CONFIG_DEFAULTS = {
  whatsapp: "+56 9 9501 9476",
  waNumber: "56995019476",
  email: "Solergy.soluciones@gmail.com",
  companyName: "Solergy",
  tagline: "Independencia Energética Inteligente",
  regions: ["V", "VI", "RM"],
  kitBasePrice: 3900000,
  kitBasePanels: 6,
  kitBaseBattery: 1,
  kitBaseInverter: 1,
  kitBaseCoverageMin: 65,
  kitBaseCoverageMax: 80,
  roiYearsMin: 4,
  roiYearsMax: 6,
  waMessageBase: "Hola Solergy, me interesa una evaluación solar para mi propiedad.",
} as const;

export type CompanyConfig = typeof COMPANY_CONFIG_DEFAULTS;
