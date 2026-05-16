"use client";
import { useState } from "react";
import { SimulatorForm } from "@/components/simulator/simulator-form";
import { SimulatorResults } from "@/components/simulator/simulator-results";
import { runSimulator } from "@/lib/simulator";
import type { SimulatorInput, SimulatorResult } from "@/types";

export default function SimuladorPage() {
  const [result, setResult] = useState<SimulatorResult | null>(null);
  const [input, setInput] = useState<SimulatorInput | null>(null);

  const handleResult = (data: SimulatorInput) => {
    setInput(data);
    setResult(runSimulator(data));
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setResult(null);
    setInput(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Simulador</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-white">
            Calcula tu{" "}
            <span className="gradient-text-solar">independencia energética</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Ingresa tus datos y obtén tres escenarios con ahorro estimado, retorno y
            recomendación de sistema. Gratis y sin compromiso.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form column */}
          <div className={`${result ? "lg:col-span-2" : "lg:col-span-3 lg:mx-auto lg:w-full"}`}>
            <div className="glass rounded-2xl p-6 lg:p-8 sticky top-24">
              {!result && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <p className="text-amber-300 text-sm font-medium">
                    ☀️ Simulador de referencia
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Los resultados son estimaciones orientativas. El retorno real varía según consumo, orientación y hábitos específicos.
                  </p>
                </div>
              )}
              <SimulatorForm onResult={handleResult} />
            </div>
          </div>

          {/* Results column */}
          {result && input && (
            <div id="results" className="lg:col-span-3">
              <SimulatorResults result={result} input={input} onReset={handleReset} />
            </div>
          )}
        </div>

        {/* Independence levels teaser (when no result yet) */}
        {!result && (
          <div className="mt-16">
            <h2 className="text-center text-2xl font-bold text-white mb-8">
              Niveles de{" "}
              <span className="gradient-text-solar">independencia</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { level: "Básico", pct: "30–50%", icon: "💡", desc: "Reducción parcial", color: "border-slate-600" },
                { level: "Intermedio", pct: "51–70%", icon: "⚡", desc: "Ahorro significativo", color: "border-blue-500/30" },
                { level: "Avanzado", pct: "71–85%", icon: "🔋", desc: "Alta autonomía", color: "border-amber-500/30" },
                { level: "Premium", pct: "86–95%", icon: "🌟", desc: "Independencia total", color: "border-green-500/30" },
              ].map((l) => (
                <div key={l.level} className={`glass rounded-2xl p-5 text-center border ${l.color} hover:-translate-y-1 transition-all duration-300`}>
                  <div className="text-3xl mb-2">{l.icon}</div>
                  <div className="font-bold text-white">{l.level}</div>
                  <div className="text-amber-400 font-semibold text-lg">{l.pct}</div>
                  <div className="text-xs text-slate-400 mt-1">{l.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
