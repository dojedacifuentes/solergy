export interface ReferenceScenario {
  id: string;
  title: string;
  type: string;
  region: "RM" | "V" | "VI";
  location: string;
  billBefore: number;
  billAfter: number;
  savingPercent: number;
  roiYears: number;
  system: string;
  mainBenefit: string;
  detail: string;
  icon: string;
}

export const referenceScenarios: ReferenceScenario[] = [
  {
    id: "parcela-interior",
    title: "Parcela Familiar Interior",
    type: "parcela",
    region: "V",
    location: "Limache / Olmué",
    billBefore: 180000,
    billAfter: 32000,
    savingPercent: 82,
    roiYears: 4.1,
    system: "10 paneles · 2 baterías · inversor híbrido",
    mainBenefit: "Independencia total + respaldo ante cortes",
    detail: "Parcela de ~4.000m² con bomba de agua, taller y uso residencial. La generación solar cubre el 82% del consumo anual. El excedente se inyecta a la red.",
    icon: "🏡",
  },
  {
    id: "cabanas-turismo",
    title: "Complejo de Cabañas Turísticas",
    type: "turismo",
    region: "V",
    location: "Algarrobo / Costa V Región",
    billBefore: 320000,
    billAfter: 58000,
    savingPercent: 82,
    roiYears: 3.8,
    system: "18 paneles · 3 baterías · inversor trifásico",
    mainBenefit: "Ahorro en peak + diferencial competitivo verde",
    detail: "Complejo de 6 cabañas con piscina. La instalación solar se convirtió en argumento de marketing. Temporada alta cubierta al 90% sin costo energético adicional.",
    icon: "🏕️",
  },
  {
    id: "hogar-urbano",
    title: "Hogar Urbano Teletrabajo",
    type: "hogar",
    region: "RM",
    location: "Maipú / Pudahuel",
    billBefore: 95000,
    billAfter: 28000,
    savingPercent: 70,
    roiYears: 4.8,
    system: "6 paneles · 1 batería · inversor monofásico",
    mainBenefit: "Ahorro mensual garantizado desde el primer mes",
    detail: "Hogar de 4 personas con teletrabajo diario. El cambio de hábitos de uso (electrodomésticos en franja solar) aumentó el retorno en un 30% adicional.",
    icon: "🏠",
  },
  {
    id: "negocio-retail",
    title: "Negocio Retail / Comercio",
    type: "negocio",
    region: "VI",
    location: "Rancagua / San Fernando",
    billBefore: 580000,
    billAfter: 95000,
    savingPercent: 84,
    roiYears: 3.2,
    system: "24 paneles · 4 baterías · inversor industrial",
    mainBenefit: "Continuidad operacional + ahorro masivo en cuentas",
    detail: "Local comercial con alta carga eléctrica. Los cortes afectaban cámaras de frío y sistemas de pago. Hoy operan con respaldo completo y el ROI más rápido de la cartera.",
    icon: "🏪",
  },
  {
    id: "agro-intensivo",
    title: "Explotación Agrícola Intensiva",
    type: "agricola",
    region: "VI",
    location: "Machalí / Requínoa",
    billBefore: 450000,
    billAfter: 72000,
    savingPercent: 84,
    roiYears: 3.5,
    system: "20 paneles · 2 baterías · inversor trifásico",
    mainBenefit: "Autonomía de bombas + reducción de costos operativos",
    detail: "Fundo con riego tecnificado y 3 bombas de alta potencia. El consumo es 100% diurno, ideal para solar sin baterías. Las baterías cubren los picos nocturnos de monitoreo.",
    icon: "🌾",
  },
  {
    id: "hotel-boutique",
    title: "Hotel Boutique Enológico",
    type: "turismo",
    region: "V",
    location: "Casablanca / Santa Cruz",
    billBefore: 680000,
    billAfter: 110000,
    savingPercent: 84,
    roiYears: 3.6,
    system: "28 paneles · 4 baterías · inversor trifásico",
    mainBenefit: "Sostenibilidad como diferencial competitivo turístico",
    detail: "Hotel de 20 habitaciones en zona vitivinícola. La certificación de energía 100% renovable se convirtió en un atributo central en su propuesta de valor turística.",
    icon: "🍷",
  },
  {
    id: "bodega-logistica",
    title: "Bodega Logística",
    type: "pyme",
    region: "RM",
    location: "Lampa / Quilicura",
    billBefore: 380000,
    billAfter: 62000,
    savingPercent: 84,
    roiYears: 3.9,
    system: "18 paneles · 2 baterías · inversor trifásico",
    mainBenefit: "Reducción de costos operativos + continuidad de cámaras",
    detail: "Bodega de distribución con montacargas eléctricos y cámaras frigoríficas. La generación solar coincide exactamente con el horario productivo de 8:00 a 18:00.",
    icon: "🏭",
  },
];
