"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnergyQuiz, type QuizAnswers, type EnergyProfile } from "@/components/quiz/EnergyQuiz";
import { ProfileResult } from "@/components/quiz/ProfileResult";
import { SimulatorForm } from "@/components/simulator/simulator-form";
import { SimulatorResults } from "@/components/simulator/simulator-results";
import { WhatsAppForm } from "@/components/contact/WhatsAppForm";
import { runSimulator } from "@/lib/simulator";
import { solarZones } from "@/lib/data/mock-zones";
import type { SimulatorInput, SimulatorResult, Region, PropertyType, Priority } from "@/types";

type FlowStep = "quiz" | "profile" | "simulator" | "results";

const STEP_LABELS = ["Perfil", "Simulador", "Resultados"];

function getRegionFromCommune(commune: string): Region {
  const zone = solarZones.find((z) => z.name === commune);
  return (zone?.region as Region) ?? "V";
}

function billRangeToNumber(range: string): number {
  const map: Record<string, number> = {
    "<50k": 40000,
    "50k-100k": 75000,
    "100k-200k": 150000,
    "200k-500k": 300000,
    ">500k": 600000,
  };
  return map[range] ?? 100000;
}

function installTypeToPropType(type: string): PropertyType {
  const map: Record<string, PropertyType> = {
    casa: "hogar",
    parcela: "parcela",
    pyme: "pyme",
    agro: "agricola",
    cabaña: "turismo",
    bodega: "pyme",
  };
  return map[type] ?? "hogar";
}

function concernToPriority(concern: string): Priority {
  const map: Record<string, Priority> = {
    cuenta: "ahorro",
    cortes: "respaldo",
    independencia: "independencia",
    retorno: "ahorro",
    continuidad: "respaldo",
  };
  return map[concern] ?? "ahorro";
}

export default function SimuladorPage() {
  const [step, setStep] = useState<FlowStep>("quiz");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [quizProfile, setQuizProfile] = useState<EnergyProfile | null>(null);
  const [simulatorInput, setSimulatorInput] = useState<SimulatorInput | null>(null);
  const [simulatorResult, setSimulatorResult] = useState<SimulatorResult | null>(null);
  const [waOpen, setWaOpen] = useState(false);

  const handleQuizComplete = (answers: QuizAnswers, profile: EnergyProfile) => {
    setQuizAnswers(answers);
    setQuizProfile(profile);
    setStep("profile");
  };

  const handleGoToSimulator = () => {
    setStep("simulator");
  };

  const handleSimulatorResult = (input: SimulatorInput) => {
    setSimulatorInput(input);
    setSimulatorResult(runSimulator(input));
    setStep("results");
    setTimeout(() => {
      document.getElementById("results-top")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setStep("quiz");
    setQuizAnswers(null);
    setQuizProfile(null);
    setSimulatorInput(null);
    setSimulatorResult(null);
  };

  const simulatorPrefill = quizAnswers
    ? {
        commune: quizAnswers.commune,
        region: getRegionFromCommune(quizAnswers.commune),
        propertyType: installTypeToPropType(quizAnswers.installType),
        monthlyBill: billRangeToNumber(quizAnswers.monthlyBillRange),
        priority: concernToPriority(quizAnswers.mainConcern),
        hasPool: quizAnswers.extraConsumers.includes("piscina"),
        hasWaterPump: quizAnswers.extraConsumers.includes("bomba"),
        workFromHome: quizAnswers.extraConsumers.includes("camaras"),
      }
    : undefined;

  const waPreFill = quizAnswers
    ? {
        commune: quizAnswers.commune,
        region: getRegionFromCommune(quizAnswers.commune) as string,
        profile: quizProfile?.label,
      }
    : undefined;

  const progressStep = step === "quiz" || step === "profile" ? 0 : step === "simulator" ? 1 : 2;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Simulador solar</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-white">
            Calcula tu{" "}
            <span className="gradient-text-solar">independencia energética</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Completa tu perfil energético y obtén un análisis personalizado con tres escenarios de ahorro, retorno y recomendación de sistema.
          </p>
        </div>

        {/* Step progress indicator */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-0">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  i === progressStep
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : i < progressStep
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < progressStep ? "bg-amber-500 text-slate-900" :
                    i === progressStep ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                    "bg-slate-800 text-slate-600 border border-slate-700"
                  }`}>
                    {i < progressStep ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`w-8 h-px mx-1 ${i < progressStep ? "bg-amber-500/50" : "bg-slate-800"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* QUIZ STEP */}
          {(step === "quiz" || step === "profile") && (
            <motion.div
              key="quiz-flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto"
            >
              <div className="glass rounded-2xl p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {step === "quiz" ? (
                    <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <EnergyQuiz onComplete={handleQuizComplete} />
                    </motion.div>
                  ) : (
                    <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {quizProfile && quizAnswers && (
                        <ProfileResult
                          profile={quizProfile}
                          answers={quizAnswers}
                          onGoToSimulator={handleGoToSimulator}
                          onWhatsApp={() => setWaOpen(true)}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {step === "quiz" && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={handleGoToSimulator}
                    className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                  >
                    Ir directamente al simulador →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* SIMULATOR STEP */}
          {step === "simulator" && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-3 lg:mx-auto lg:w-full">
                  <div className="glass rounded-2xl p-6 lg:p-8">
                    <div className="mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-amber-300 text-sm font-medium">
                        ☀️ Simulador de estimación energética
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Los resultados son estimaciones orientativas. El valor real varía según consumo, orientación y hábitos específicos.
                      </p>
                    </div>
                    <SimulatorForm onResult={handleSimulatorResult} prefill={simulatorPrefill} />
                  </div>
                </div>

                {/* Independence teaser */}
                <div className="lg:col-span-2">
                  <div className="glass rounded-2xl p-6 mb-4">
                    <h3 className="font-semibold text-white mb-4">Niveles de independencia</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { level: "Básico", pct: "30–50%", icon: "💡", color: "border-slate-600" },
                        { level: "Intermedio", pct: "51–70%", icon: "⚡", color: "border-blue-500/30" },
                        { level: "Avanzado", pct: "71–85%", icon: "🔋", color: "border-amber-500/30" },
                        { level: "Premium", pct: "86–95%", icon: "🌟", color: "border-green-500/30" },
                      ].map((l) => (
                        <div key={l.level} className={`glass rounded-xl p-4 text-center border ${l.color}`}>
                          <div className="text-2xl mb-1">{l.icon}</div>
                          <div className="font-bold text-white text-sm">{l.level}</div>
                          <div className="text-amber-400 font-semibold">{l.pct}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {quizProfile && (
                    <div className="glass rounded-2xl p-5 border-amber-500/20">
                      <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Tu perfil detectado</p>
                      <p className="font-bold text-white mb-1">{quizProfile.label}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{quizProfile.opportunity}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS STEP */}
          {step === "results" && simulatorResult && simulatorInput && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div id="results-top" />
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-2">
                  <div className="glass rounded-2xl p-6 lg:p-8 sticky top-24">
                    <button
                      type="button"
                      onClick={() => setStep("simulator")}
                      className="text-sm text-slate-500 hover:text-slate-300 mb-4 block transition-colors"
                    >
                      ← Modificar parámetros
                    </button>
                    <SimulatorForm onResult={handleSimulatorResult} prefill={simulatorPrefill} />
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <SimulatorResults
                    result={simulatorResult}
                    input={simulatorInput}
                    onReset={handleReset}
                    profile={quizProfile?.label}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WhatsAppForm isOpen={waOpen} onClose={() => setWaOpen(false)} prefill={waPreFill} />
    </div>
  );
}
