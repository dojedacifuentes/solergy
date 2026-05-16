"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { SimulatorResult, SimulatorInput } from "@/types";
import { formatCLP } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { mockHabits } from "@/lib/mock-data";
import { WhatsAppForm } from "@/components/contact/WhatsAppForm";
import { ProposalDownloadButton } from "@/components/pdf/ProposalDownloadButton";
import { useCompanyConfig } from "@/lib/hooks/useCompanyConfig";
import { COMPANY_CONFIG_DEFAULTS } from "@/lib/config";
import { solarZones } from "@/lib/data/mock-zones";
import type { ProposalData } from "@/lib/pdf-generator";

interface Props {
  result: SimulatorResult;
  input: SimulatorInput;
  onReset: () => void;
  profile?: string;
}

function getRegionLabel(region: string): string {
  const map: Record<string, string> = {
    V: "V Región — Valparaíso",
    RM: "Región Metropolitana",
    VI: "VI Región — O'Higgins",
  };
  return map[region] ?? region;
}

function getPropertyLabel(type: string): string {
  const map: Record<string, string> = {
    hogar: "Casa / Departamento",
    parcela: "Parcela / Fundo",
    pyme: "PyME / Oficina",
    negocio: "Negocio / Comercio",
    turismo: "Turismo / Cabañas",
    agricola: "Agrícola",
  };
  return map[type] ?? type;
}

export function SimulatorResults({ result, input, onReset, profile }: Props) {
  const { conservative, smart, optimized } = result;
  const [waOpen, setWaOpen] = useState(false);
  const [config] = useCompanyConfig();

  const scenarios = [
    {
      data: conservative,
      color: "border-blue-500/30 bg-blue-500/5",
      accent: "text-blue-400",
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      barColor: "blue",
    },
    {
      data: smart,
      color: "border-amber-500/40 bg-amber-500/8",
      accent: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      barColor: "solar",
      recommended: true,
    },
    {
      data: optimized,
      color: "border-green-500/30 bg-green-500/5",
      accent: "text-green-400",
      badge: "bg-green-500/20 text-green-300 border-green-500/30",
      barColor: "green",
    },
  ];

  const chartData = scenarios.map((s) => ({
    name: s.data.label,
    "Ahorro/año": Math.round(s.data.yearlySaving / 1000),
    "Inversión": Math.round(s.data.investmentMin / 1000),
  }));

  const zone = solarZones.find(
    (z) => z.region === input.region && z.name.toLowerCase() === input.commune.toLowerCase()
  );

  const proposalData: ProposalData = {
    commune: input.commune,
    region: getRegionLabel(input.region),
    propertyType: getPropertyLabel(input.propertyType),
    monthlyBill: input.monthlyBill,
    priority: input.priority,
    profile,
    conservadorSavingRange: conservative.monthlySavingRange,
    optimizadoSavingRange: optimized.monthlySavingRange,
    conservadorRoiRange: conservative.roiRange,
    optimizadoRoiRange: optimized.roiRange,
    coverageRange: [conservative.coverageRange[0], optimized.coverageRange[1]],
    independenceLevel:
      smart.coveragePercent >= 85
        ? "Premium"
        : smart.coveragePercent >= 70
        ? "Avanzado"
        : smart.coveragePercent >= 55
        ? "Intermedio"
        : "Básico",
    solarScore: result.zoneScore,
    kitName: smart.kitName,
    habits: {
      nocturnalConsumption: input.nightConsumption,
      hasPool: input.hasPool,
      hasPump: input.hasWaterPump,
      telework: input.workFromHome,
    },
    companyConfig: config ?? COMPANY_CONFIG_DEFAULTS,
  };

  const waPreFill = {
    commune: input.commune,
    region: getRegionLabel(input.region),
    propertyType: getPropertyLabel(input.propertyType),
    monthlyBill: input.monthlyBill,
    priority: input.priority,
    profile,
    solarScore: result.zoneScore,
    estimatedSaving: smart.monthlySaving,
    scenario: smart.label,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Tu análisis energético</h2>
          <p className="text-slate-400 text-sm mt-1">
            Cuenta: {formatCLP(input.monthlyBill)}/mes · {input.commune}
            {result.zoneScore && (
              <span className="ml-2 text-amber-400 font-medium">
                · Puntaje solar: {result.zoneScore}/100
              </span>
            )}
          </p>
          {zone && (
            <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-medium border ${
              zone.opportunity === "alta" ? "bg-green-500/10 text-green-400 border-green-500/30" :
              zone.opportunity === "media" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
              "bg-slate-500/10 text-slate-400 border-slate-500/30"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {zone.profileLabel}
              {zone.opportunity === "alta" ? " · Oportunidad alta" :
               zone.opportunity === "media" ? " · Oportunidad media" : " · Zona exploratoria"}
            </div>
          )}
        </div>
        <button onClick={onReset} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
          ← Modificar
        </button>
      </div>

      {/* System recommendation */}
      <div className="glass rounded-2xl p-5 border-amber-500/20 bg-amber-500/5">
        <p className="text-amber-300 text-sm font-medium leading-relaxed">{result.systemRec}</p>
      </div>

      {/* Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {scenarios.map((s, i) => (
          <motion.div
            key={s.data.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass rounded-2xl p-6 border ${s.color} relative`}
          >
            {s.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">RECOMENDADO</span>
              </div>
            )}

            <div className="text-center mb-4">
              <h3 className="font-bold text-white text-lg">{s.data.label}</h3>
              <div className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${s.badge}`}>
                {s.data.kitName}
              </div>
              <p className="text-slate-400 text-xs mt-2">{s.data.description}</p>
            </div>

            <div className="text-center mb-5">
              <div className={`text-3xl font-bold ${s.accent}`}>{formatCLP(s.data.monthlySaving)}</div>
              <div className="text-slate-500 text-xs">ahorro estimado/mes</div>
              <div className="text-slate-600 text-xs mt-0.5">
                rango: {formatCLP(s.data.monthlySavingRange[0])} – {formatCLP(s.data.monthlySavingRange[1])}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Cobertura solar</span>
                <span className="text-white font-medium">
                  {s.data.coverageRange[0]}–{s.data.coverageRange[1]}%
                </span>
              </div>

              {/* Independence bar */}
              <div className="relative">
                <Progress
                  value={s.data.coveragePercent}
                  color={i === 0 ? "blue" : i === 1 ? "solar" : "green"}
                  className="h-2.5"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>0%</span>
                  <span className={`font-medium ${s.accent}`}>{s.data.coveragePercent}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="pt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ahorro anual</span>
                  <span className="text-white font-medium">{formatCLP(s.data.yearlySaving)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inversión referencial</span>
                  <span className="text-white font-medium text-right text-xs leading-snug">
                    {formatCLP(s.data.investmentMin)}<br />
                    <span className="text-slate-500">hasta {formatCLP(s.data.investmentMax)}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Retorno estimado</span>
                  <span className={`font-bold ${s.accent}`}>
                    {s.data.roiRange[0]}–{s.data.roiRange[1]} años
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-1 text-xs text-slate-500">
              <div>⚙️ {s.data.panels} paneles · {s.data.batteries} batería{s.data.batteries !== 1 ? "s" : ""}</div>
              <div className="text-slate-600 leading-relaxed">{s.data.recommendation}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Habit impact */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-2">Impacto de tus hábitos</h3>
        <p className="text-amber-300 text-sm mb-4">{result.habitImpact}</p>
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-5">
          <p className="text-slate-400 text-xs leading-relaxed">
            El retorno no depende solo del equipo instalado, también depende de cómo usa la energía. Trasladar consumos al horario solar puede acelerar el retorno.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockHabits.map((h) => (
            <div key={h.id} className="glass-light rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{h.icon}</span>
                <span className="font-medium text-white text-sm">{h.appliance}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-slate-400">Día solar: {h.timeDay}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  <span className="text-slate-500">Nocturno: {h.timeNight}</span>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={h.impactPercent} max={30} color="solar" className="h-1.5" />
                <p className="text-xs text-amber-400 mt-1 font-medium">{h.impactLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Before/after mini-card */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Comparativa antes / después</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sin solar</div>
            <div className="text-2xl font-bold text-red-400">{formatCLP(input.monthlyBill)}</div>
            <div className="text-xs text-slate-500 mt-0.5">al mes</div>
          </div>
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Con solar (Inteligente)</div>
            <div className="text-2xl font-bold text-green-400">{formatCLP(input.monthlyBill - smart.monthlySaving)}</div>
            <div className="text-xs text-slate-500 mt-0.5">estimado/mes</div>
          </div>
        </div>
        <div className="text-center">
          <span className="text-amber-400 font-bold text-lg">{formatCLP(smart.yearlySaving)}</span>
          <span className="text-slate-400 text-sm ml-2">de ahorro anual estimado</span>
        </div>
      </div>

      {/* Chart */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Comparativa de escenarios</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${v}K`} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px", color: "#f8fafc" }}
              formatter={(v) => [`$${Number(v).toLocaleString("es-CL")}K CLP`]}
            />
            <Bar dataKey="Ahorro/año" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Inversión" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-600 mt-2">
          Valores en miles de pesos CLP. Escenario referencial — el valor real depende de evaluación técnica presencial.
        </p>
      </div>

      {/* CTA */}
      <div className="glass rounded-2xl p-6 text-center bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
        <p className="text-white font-semibold text-lg mb-2">
          Recibe una propuesta personalizada gratuita
        </p>
        <p className="text-slate-400 text-sm mb-5">
          Un asesor Solergy te contacta con tu análisis real, sin compromiso.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => setWaOpen(true)}
            className="btn-solar px-8 py-3 rounded-xl"
          >
            💬 Enviar por WhatsApp
          </button>
          <ProposalDownloadButton
            data={proposalData}
            className="px-8 py-3 rounded-xl border border-slate-600 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            label="Descargar propuesta"
          />
        </div>
        <p className="text-xs text-slate-600 mt-4">
          * Todos los valores son estimaciones de referencia. El ahorro real depende de consumo, orientación, hábitos y configuración del sistema.
        </p>
      </div>

      <WhatsAppForm isOpen={waOpen} onClose={() => setWaOpen(false)} prefill={waPreFill} />
    </motion.div>
  );
}
