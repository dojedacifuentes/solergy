"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarZones } from "@/lib/data/mock-zones";

export interface QuizAnswers {
  installType: string;
  mainConcern: string;
  consumptionTime: string;
  extraConsumers: string[];
  monthlyBillRange: string;
  commune: string;
}

export interface EnergyProfile {
  id: string;
  label: string;
  diagnosis: string;
  opportunity: string;
  suggestedSystem: string;
  habitsToImprove: string[];
  estimatedSavingRange: string;
  roiRange: string;
}

function computeProfile(answers: QuizAnswers): EnergyProfile {
  const { installType, mainConcern, consumptionTime, extraConsumers, monthlyBillRange } = answers;

  const highBill = monthlyBillRange === ">500k" || monthlyBillRange === "200k-500k";
  const hasPump = extraConsumers.includes("bomba");
  const hasPool = extraConsumers.includes("piscina");
  const hasIrrigation = extraConsumers.includes("riego");
  const hasMachinery = extraConsumers.includes("maquinaria");
  const hasRefrigeration = extraConsumers.includes("refrigeracion");

  if (installType === "agro" && (hasIrrigation || hasMachinery) && consumptionTime === "dia") {
    return {
      id: "agro-diurno",
      label: "Agro Diurno",
      diagnosis: "Tu perfil es ideal para solar: consumo diurno intensivo con bombas o maquinaria. El retorno puede ser de los más rápidos del mercado.",
      opportunity: "Muy alta — consumo diurno intensivo coincide exactamente con generación solar",
      suggestedSystem: "Sistema de 12–20 paneles con inversor trifásico. Batería opcional según horario nocturno.",
      habitsToImprove: ["Concentrar riego en horario 9:00–15:00", "Programar bombas en franja solar"],
      estimatedSavingRange: "60–85% de la cuenta mensual",
      roiRange: "3–5 años",
    };
  }

  if (installType === "pyme" && (mainConcern === "continuidad" || mainConcern === "cuenta") && (hasRefrigeration || hasMachinery)) {
    return {
      id: "pyme-opex",
      label: "Pyme OPEX Solar",
      diagnosis: "Tu negocio tiene alto consumo operacional diurno. El solar reduce el OPEX y protege la continuidad operacional.",
      opportunity: "Alta — operaciones diurnas con alta demanda energética constante",
      suggestedSystem: "Sistema de 10–24 paneles con batería de respaldo y monitoreo de producción.",
      habitsToImprove: ["Programar equipos pesados en horario solar", "Revisar tarifa eléctrica actual"],
      estimatedSavingRange: "55–80% de la cuenta mensual",
      roiRange: "3–5 años",
    };
  }

  if ((installType === "turismo" || installType === "cabaña") && mainConcern === "independencia") {
    return {
      id: "turismo-sustentable",
      label: "Turismo Sustentable",
      diagnosis: "Tu operación turística puede convertir la energía solar en un diferencial competitivo real y argumento de marketing.",
      opportunity: "Alta — turismo solar es un diferencial que los visitantes valoran",
      suggestedSystem: "Sistema de 10–18 paneles con baterías de respaldo para temporada alta.",
      habitsToImprove: ["Piscina y calefacción en horario solar", "Señalización de energía renovable para huéspedes"],
      estimatedSavingRange: "65–85% de la cuenta mensual",
      roiRange: "3,5–5 años",
    };
  }

  if (installType === "parcela" && (mainConcern === "cortes" || mainConcern === "independencia") && (hasPump || hasPool)) {
    return {
      id: "parcela-resiliente",
      label: "Parcela Resiliente",
      diagnosis: "Vives en zona de cortes frecuentes con equipos de alto consumo. El solar con batería te da autonomía real.",
      opportunity: "Alta — parcelas con bombas y piscinas tienen el mejor ROI del mercado residencial",
      suggestedSystem: "Sistema de 8–14 paneles con 1–2 baterías de respaldo e inversor híbrido.",
      habitsToImprove: ["Bomba en horario solar", "Cargar vehículo o herramientas de día"],
      estimatedSavingRange: "70–90% de la cuenta mensual",
      roiRange: "4–6 años",
    };
  }

  if (installType === "casa" && highBill && extraConsumers.length >= 3) {
    return {
      id: "residencial-premium",
      label: "Residencial Premium",
      diagnosis: "Tu hogar tiene consumo elevado con múltiples equipos. El solar puede cubrir la mayor parte de tu cuenta.",
      opportunity: "Alta — cuenta alta con múltiples consumos da el mejor margen de ahorro",
      suggestedSystem: "Sistema de 8–12 paneles con batería de respaldo para continuidad nocturna.",
      habitsToImprove: ["Lavadora y lavavajillas al mediodía", "Calefacción eléctrica en horario solar"],
      estimatedSavingRange: "65–85% de la cuenta mensual",
      roiRange: "4–6 años",
    };
  }

  if (installType === "casa" && (mainConcern === "cuenta" || mainConcern === "retorno")) {
    return {
      id: "hogar-ahorro",
      label: "Hogar Ahorro Inteligente",
      diagnosis: "Tu hogar puede reducir significativamente la cuenta eléctrica con solar. La clave es el cambio de hábitos de consumo.",
      opportunity: "Media-alta — motivación de ahorro clara con margen de mejora de hábitos",
      suggestedSystem: "Sistema de 6–10 paneles con opción de batería según consumo nocturno.",
      habitsToImprove: ["Mover consumos al horario solar 10:00–15:00", "Programar lavadora de día"],
      estimatedSavingRange: "50–75% de la cuenta mensual",
      roiRange: "4–7 años",
    };
  }

  return {
    id: "exploracion-inicial",
    label: "Exploración Inicial",
    diagnosis: "Tu perfil tiene potencial solar a confirmar. Un asesor puede dimensionar el sistema adecuado para tu situación específica.",
    opportunity: "A confirmar — perfil diverso que requiere evaluación personalizada",
    suggestedSystem: "Sistema de 4–8 paneles como punto de partida. Requiere evaluación en terreno.",
    habitsToImprove: ["Identificar principales consumidores eléctricos", "Revisar horarios de consumo actuales"],
    estimatedSavingRange: "40–65% de la cuenta mensual",
    roiRange: "5–8 años",
  };
}

const COMMUNES_BY_REGION = {
  "V": solarZones.filter((z) => z.region === "V").map((z) => z.name).sort(),
  "RM": solarZones.filter((z) => z.region === "RM").map((z) => z.name).sort(),
  "VI": solarZones.filter((z) => z.region === "VI").map((z) => z.name).sort(),
};

interface Props {
  onComplete: (answers: QuizAnswers, profile: EnergyProfile) => void;
}

const STEPS = 5;

export function EnergyQuiz({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({
    extraConsumers: [],
  });

  const progress = ((step) / STEPS) * 100;

  const setField = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const toggleExtra = (item: string) => {
    const current = answers.extraConsumers ?? [];
    if (current.includes(item)) {
      setField("extraConsumers", current.filter((x) => x !== item));
    } else {
      setField("extraConsumers", [...current, item]);
    }
  };

  const handleNext = () => {
    if (step < STEPS - 1) setStep((s) => s + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    const full = answers as QuizAnswers;
    const profile = computeProfile(full);
    onComplete(full, profile);
  };

  const canProceed = () => {
    if (step === 0) return !!answers.installType;
    if (step === 1) return !!answers.mainConcern;
    if (step === 2) return !!answers.consumptionTime;
    if (step === 3) return true; // multiselect is optional
    if (step === 4) return !!answers.monthlyBillRange && !!answers.commune;
    return false;
  };

  const selectedRegion = answers.commune
    ? (Object.entries(COMMUNES_BY_REGION).find(([, communes]) =>
        communes.includes(answers.commune ?? "")
      )?.[0] ?? "V")
    : "V";

  return (
    <div className="min-h-[500px] flex flex-col">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Perfil energético</span>
          <span>{step + 1} de {STEPS}</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < step ? "bg-amber-400" : i === step ? "bg-amber-500 ring-2 ring-amber-500/30" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          {/* STEP 0 */}
          {step === 0 && (
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-widest mb-2">Pregunta 1</p>
              <h2 className="text-xl font-bold text-white mb-6">¿Dónde quieres instalar?</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "casa", label: "Casa / Depto", icon: "🏠" },
                  { value: "parcela", label: "Parcela / Fundo", icon: "🌿" },
                  { value: "pyme", label: "PyME / Oficina", icon: "🏢" },
                  { value: "agro", label: "Agrícola", icon: "🌾" },
                  { value: "cabaña", label: "Turismo / Cabañas", icon: "🏕️" },
                  { value: "bodega", label: "Bodega / Logística", icon: "🏭" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setField("installType", opt.value)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      answers.installType === opt.value
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                        : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{opt.icon}</div>
                    <div className="text-sm font-medium">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-widest mb-2">Pregunta 2</p>
              <h2 className="text-xl font-bold text-white mb-6">¿Qué te preocupa más?</h2>
              <div className="space-y-3">
                {[
                  { value: "cuenta", label: "💰 La cuenta de luz es muy alta", desc: "Quiero reducir el gasto mensual" },
                  { value: "cortes", label: "⚡ Los cortes eléctricos", desc: "Necesito continuidad garantizada" },
                  { value: "independencia", label: "🔋 Independencia energética", desc: "Quiero depender menos de la red" },
                  { value: "retorno", label: "📈 Retorno de inversión", desc: "Busco la mejor rentabilidad" },
                  { value: "continuidad", label: "🏭 Continuidad operacional", desc: "Mi negocio no puede parar" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setField("mainConcern", opt.value)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      answers.mainConcern === opt.value
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                        : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                    }`}
                  >
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-widest mb-2">Pregunta 3</p>
              <h2 className="text-xl font-bold text-white mb-6">¿Cuándo consumes más energía?</h2>
              <div className="space-y-3">
                {[
                  { value: "dia", label: "☀️ Principalmente de día", desc: "Equipos encendidos 8:00–18:00" },
                  { value: "noche", label: "🌙 Principalmente de noche", desc: "Uso intensivo nocturno" },
                  { value: "todo", label: "🔄 Todo el día por igual", desc: "Consumo distribuido 24 horas" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setField("consumptionTime", opt.value)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      answers.consumptionTime === opt.value
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                        : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                    }`}
                  >
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — multiselect */}
          {step === 3 && (
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-widest mb-2">Pregunta 4</p>
              <h2 className="text-xl font-bold text-white mb-2">¿Tienes alguno de estos consumos?</h2>
              <p className="text-slate-500 text-sm mb-5">Selecciona todos los que apliquen</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "bomba", label: "💧 Bomba de agua" },
                  { value: "piscina", label: "🏊 Piscina" },
                  { value: "camaras", label: "📷 Cámaras de seguridad" },
                  { value: "porton", label: "🚪 Portón eléctrico" },
                  { value: "refrigeracion", label: "❄️ Refrigeración" },
                  { value: "maquinaria", label: "⚙️ Maquinaria" },
                  { value: "riego", label: "🌱 Riego" },
                ].map((opt) => {
                  const selected = (answers.extraConsumers ?? []).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleExtra(opt.value)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                        selected
                          ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                          : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${selected ? "bg-amber-500 border-amber-500" : "border-slate-600"}`}>
                        {selected && <div className="w-1.5 h-1.5 rounded-sm bg-slate-900" />}
                      </div>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-widest mb-2">Pregunta 5</p>
              <h2 className="text-xl font-bold text-white mb-5">Cuenta mensual y ubicación</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-3">Cuenta mensual aproximada</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "<50k", label: "Menos de $50.000" },
                      { value: "50k-100k", label: "$50.000 – $100.000" },
                      { value: "100k-200k", label: "$100.000 – $200.000" },
                      { value: "200k-500k", label: "$200.000 – $500.000" },
                      { value: ">500k", label: "Más de $500.000" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setField("monthlyBillRange", opt.value)}
                        className={`p-3 rounded-xl border text-sm text-left transition-all ${
                          answers.monthlyBillRange === opt.value
                            ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                            : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-300 mb-3">¿En qué comuna?</p>
                  <div className="space-y-2">
                    <select
                      value={answers.commune ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setField("commune", val);
                      }}
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all appearance-none"
                    >
                      <option value="" className="bg-slate-900">Selecciona tu comuna...</option>
                      <optgroup label="V Región — Valparaíso" className="bg-slate-900">
                        {COMMUNES_BY_REGION["V"].map((c) => (
                          <option key={c} value={c} className="bg-slate-900">{c}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Región Metropolitana" className="bg-slate-900">
                        {COMMUNES_BY_REGION["RM"].map((c) => (
                          <option key={c} value={c} className="bg-slate-900">{c}</option>
                        ))}
                      </optgroup>
                      <optgroup label="VI Región — O'Higgins" className="bg-slate-900">
                        {COMMUNES_BY_REGION["VI"].map((c) => (
                          <option key={c} value={c} className="bg-slate-900">{c}</option>
                        ))}
                      </optgroup>
                    </select>
                    {answers.commune && (
                      <p className="text-xs text-slate-500">
                        Región detectada: {selectedRegion === "V" ? "V Región — Valparaíso" : selectedRegion === "RM" ? "Región Metropolitana" : "VI Región — O'Higgins"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="px-5 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm font-medium"
          >
            ← Atrás
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step < STEPS - 1 ? "Continuar →" : "Ver mi perfil energético"}
        </button>
      </div>
    </div>
  );
}
