import type { CompanyConfig } from "@/lib/config";

export interface ProposalData {
  // User data
  name?: string;
  commune: string;
  region: string;
  propertyType: string;
  monthlyBill: number;
  priority?: string;
  profile?: string;
  // Simulator results
  conservadorSavingRange: [number, number];
  optimizadoSavingRange: [number, number];
  conservadorRoiRange: [number, number];
  optimizadoRoiRange: [number, number];
  coverageRange: [number, number];
  independenceLevel: string;
  solarScore?: number;
  kitName?: string;
  habits?: {
    nocturnalConsumption?: string;
    hasPool?: boolean;
    hasPump?: boolean;
    telework?: boolean;
  };
  // Config
  companyConfig: CompanyConfig;
}

function formatCLPLocal(n: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(n);
}

export async function generateProposalPDF(data: ProposalData): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 18;
  let y = 0;

  // --- HEADER ---
  // Amber accent bar
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, W, 14, "F");

  // Dark header background
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 14, W, 42, "F");

  // Company name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(245, 158, 11);
  doc.text(data.companyConfig.companyName.toUpperCase(), margin, 32);

  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(data.companyConfig.tagline, margin, 40);

  // Contact info on right
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(data.companyConfig.whatsapp, W - margin, 30, { align: "right" });
  doc.text(data.companyConfig.email, W - margin, 37, { align: "right" });

  y = 62;

  // --- TITLE SECTION ---
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 56, W, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("PROPUESTA ENERGÉTICA PRELIMINAR", margin, 67);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generada el ${new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })}`, W - margin, 67, { align: "right" });

  y = 82;

  // --- USER DATA TABLE ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("Datos del cliente", margin, y);
  y += 6;

  const userData: [string, string][] = [
    ["Nombre", data.name || "—"],
    ["Comuna", data.commune],
    ["Región", data.region],
    ["Tipo de propiedad", data.propertyType],
    ["Cuenta mensual estimada", formatCLPLocal(data.monthlyBill)],
  ];
  if (data.priority) userData.push(["Prioridad energética", data.priority]);
  if (data.profile) userData.push(["Perfil energético", data.profile]);
  if (data.solarScore) userData.push(["Puntaje solar de la zona", `${data.solarScore}/100`]);

  doc.setFontSize(9);
  const rowH = 7;
  userData.forEach(([label, value], i) => {
    const bg = i % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(bg[0], bg[1], bg[2]);
    doc.rect(margin, y, W - margin * 2, rowH, "F");
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");
    doc.text(label, margin + 3, y + 5);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(value, W - margin - 3, y + 5, { align: "right" });
    y += rowH;
  });

  y += 10;

  // --- SCENARIO CARDS ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("Escenarios de estimación", margin, y);
  y += 6;

  const scenarios = [
    {
      label: "Conservador",
      saving: data.conservadorSavingRange,
      roi: data.conservadorRoiRange,
      coverage: data.coverageRange[0],
      color: [59, 130, 246] as [number, number, number],
      bg: [239, 246, 255] as [number, number, number],
    },
    {
      label: "Inteligente",
      saving: [
        Math.round((data.conservadorSavingRange[0] + data.optimizadoSavingRange[0]) / 2),
        Math.round((data.conservadorSavingRange[1] + data.optimizadoSavingRange[1]) / 2),
      ] as [number, number],
      roi: [
        parseFloat(((data.conservadorRoiRange[0] + data.optimizadoRoiRange[0]) / 2).toFixed(1)),
        parseFloat(((data.conservadorRoiRange[1] + data.optimizadoRoiRange[1]) / 2).toFixed(1)),
      ] as [number, number],
      coverage: Math.round((data.coverageRange[0] + data.coverageRange[1]) / 2),
      color: [245, 158, 11] as [number, number, number],
      bg: [255, 251, 235] as [number, number, number],
    },
    {
      label: "Optimizado",
      saving: data.optimizadoSavingRange,
      roi: data.optimizadoRoiRange,
      coverage: data.coverageRange[1],
      color: [34, 197, 94] as [number, number, number],
      bg: [240, 253, 244] as [number, number, number],
    },
  ];

  const cardW = (W - margin * 2 - 8) / 3;
  const cardH = 50;

  scenarios.forEach((s, i) => {
    const cx = margin + i * (cardW + 4);
    doc.setFillColor(...s.bg);
    doc.roundedRect(cx, y, cardW, cardH, 3, 3, "F");
    doc.setFillColor(...s.color);
    doc.rect(cx, y, cardW, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(s.label, cx + cardW / 2, y + 5.5, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...s.color);
    doc.text("Ahorro mensual", cx + 4, y + 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(`${formatCLPLocal(s.saving[0])} – ${formatCLPLocal(s.saving[1])}`, cx + 4, y + 21);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...s.color);
    doc.text("Retorno estimado", cx + 4, y + 29);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(`${s.roi[0]}–${s.roi[1]} años`, cx + 4, y + 35);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...s.color);
    doc.text("Cobertura solar", cx + 4, y + 43);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(`hasta ${s.coverage}%`, cx + 4, y + 49);
  });

  y += cardH + 10;

  // --- INDEPENDENCE BAR ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Nivel de independencia: ${data.independenceLevel}`, margin, y);
  y += 5;

  const barW = W - margin * 2;
  const barH = 6;
  const coveragePct = data.coverageRange[1] / 100;
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(margin, y, barW, barH, 2, 2, "F");
  doc.setFillColor(245, 158, 11);
  doc.roundedRect(margin, y, barW * coveragePct, barH, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`${data.coverageRange[0]}–${data.coverageRange[1]}% de cobertura solar estimada`, margin, y + barH + 5);
  y += barH + 12;

  // --- HABITS SECTION ---
  if (data.habits) {
    const habitLines: string[] = [];
    if (data.habits.nocturnalConsumption && data.habits.nocturnalConsumption !== "bajo") {
      habitLines.push(`Consumo nocturno ${data.habits.nocturnalConsumption}: trasladar cargas al horario solar puede mejorar el retorno un 10–20%.`);
    }
    if (data.habits.hasPool) habitLines.push("Piscina: programar bomba en horario solar (10:00–15:00) puede sumar hasta +8% de retorno.");
    if (data.habits.hasPump) habitLines.push("Bomba de agua: uso diurno coincide con generación solar, optimizando la cobertura.");
    if (data.habits.telework) habitLines.push("Teletrabajo: consumo diurno de equipos mejora la autoconsumo del sistema.");

    if (habitLines.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text("Impacto de hábitos energéticos", margin, y);
      y += 5;

      doc.setFillColor(255, 251, 235);
      doc.rect(margin, y, W - margin * 2, habitLines.length * 8 + 6, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 84, 0);
      habitLines.forEach((line) => {
        const wrapped = doc.splitTextToSize(`→ ${line}`, W - margin * 2 - 6);
        doc.text(wrapped, margin + 3, y + 5);
        y += wrapped.length * 4.5 + 3;
      });
      y += 4;
    }
  }

  // Habit impact message
  doc.setFillColor(245, 158, 11);
  doc.rect(margin, y, 3, 14, "F");
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const habitMsg = "El retorno no depende solo del equipo instalado, también depende de cómo usa la energía. Trasladar consumos al horario solar puede acelerar el retorno.";
  const habitWrapped = doc.splitTextToSize(habitMsg, W - margin * 2 - 8);
  doc.text(habitWrapped, margin + 6, y + 5);
  y += habitWrapped.length * 5 + 8;

  // --- NEXT STEPS ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Próximos pasos", margin, y);
  y += 5;

  const steps = [
    "Revisión del consumo eléctrico",
    "Evaluación técnica en terreno",
    "Dimensionamiento del sistema",
    "Propuesta definitiva y contrato",
    "Instalación y puesta en marcha",
  ];

  steps.forEach((s, i) => {
    doc.setFillColor(245, 158, 11);
    doc.circle(margin + 3, y + 2, 2.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(String(i + 1), margin + 3, y + 3, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(s, margin + 9, y + 3.5);
    y += 8;
  });

  y += 6;

  // --- DISCLAIMER ---
  doc.setFillColor(241, 245, 249);
  const disclaimer = "Esta propuesta es una simulación referencial. Los valores pueden variar según hábitos de consumo, orientación, superficie disponible, equipos, baterías y evaluación técnica. No constituye oferta comercial.";
  const discLines = doc.splitTextToSize(disclaimer, W - margin * 2 - 6);
  doc.rect(margin, y, W - margin * 2, discLines.length * 4.5 + 8, "F");
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(discLines, margin + 3, y + 5);
  y += discLines.length * 4.5 + 14;

  // --- FOOTER CTA ---
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 272, W, 25, "F");
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 272, W, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11);
  doc.text("Solicitar evaluación personalizada", W / 2, 280, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`${data.companyConfig.whatsapp}  ·  ${data.companyConfig.email}`, W / 2, 287, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`${data.companyConfig.companyName} — ${data.companyConfig.tagline}`, W / 2, 293, { align: "center" });

  const fileName = `Propuesta_Solar_${data.commune.replace(/\s/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
