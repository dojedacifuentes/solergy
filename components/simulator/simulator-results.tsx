"use client";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { SimulatorResult, SimulatorInput } from "@/types";
import { formatCLP, formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { mockHabits } from "@/lib/mock-data";
import { WHATSAPP_URL } from "@/lib/mock-data";

interface Props {
  result: SimulatorResult;
  input: SimulatorInput;
  onReset: () => void;
}

export function SimulatorResults({ result, input, onReset }: Props) {
  const { conservative, smart, optimized } = result;
  const scenarios = [
    { data: conservative, color: "border-blue-500/30 bg-blue-500/5", accent: "text-blue-400", badge: "bg-blue-500/20 text-blue-300" },
    { data: smart, color: "border-amber-500/40 bg-amber-500/8", accent: "text-amber-400", badge: "bg-amber-500/20 text-amber-300", recommended: true },
    { data: optimized, color: "border-green-500/30 bg-green-500/5", accent: "text-green-400", badge: "bg-green-500/20 text-green-300" },
  ];

  const chartData = scenarios.map((s) => ({
    name: s.data.label,
    "Ahorro/año": s.data.yearlySaving / 1000,
    "Inversión": s.data.investmentMin / 1000,
  }));

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
            Cuenta: {formatCLP(input.monthlyBill)}/mes · {input.people} personas
          </p>
        </div>
        <button onClick={onReset} className="text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
          ← Modificar
        </button>
      </div>

      {/* System recommendation */}
      <div className="glass rounded-2xl p-5 border-amber-500/20 bg-amber-500/5">
        <p className="text-amber-300 text-sm font-medium">{result.systemRec}</p>
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
                <span className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">RECOMENDADO</span>
              </div>
            )}

            <div className="text-center mb-5">
              <h3 className="font-bold text-white text-lg">{s.data.label}</h3>
              <p className="text-slate-400 text-xs mt-1">{s.data.description}</p>
            </div>

            <div className="text-center mb-5">
              <div className={`text-4xl font-bold ${s.accent}`}>{formatCLP(s.data.monthlySaving)}</div>
              <div className="text-slate-500 text-xs">ahorro estimado/mes</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Cobertura</span>
                <span className="text-white font-medium">{s.data.coveragePercent}%</span>
              </div>
              <Progress value={s.data.coveragePercent} color={i === 0 ? "blue" : i === 1 ? "solar" : "green"} className="h-2" />

              <div className="pt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ahorro anual</span>
                  <span className="text-white font-medium">{formatCLP(s.data.yearlySaving)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inversión estimada</span>
                  <span className="text-white font-medium">{formatCLP(s.data.investmentMin)} – {formatCLP(s.data.investmentMax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Retorno en</span>
                  <span className={`font-bold ${s.accent}`}>{s.data.roiYears} años</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-1 text-xs text-slate-500">
              <div>⚙️ {s.data.panels} paneles · {s.data.batteries} baterías</div>
              <div className="text-slate-600">{s.data.recommendation}</div>
            </div>
          </motion.div>
        ))}
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
        <p className="text-xs text-slate-600 mt-2">Valores en miles de pesos CLP. Estimaciones de referencia.</p>
      </div>

      {/* Habit impact */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-2">🔌 Impacto de tus hábitos</h3>
        <p className="text-amber-300 text-sm mb-5">{result.habitImpact}</p>

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

      {/* CTA */}
      <div className="glass rounded-2xl p-6 text-center bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
        <p className="text-white font-semibold text-lg mb-2">
          Recibe una propuesta personalizada gratuita
        </p>
        <p className="text-slate-400 text-sm mb-5">
          Un asesor Solergy te contacta con tu análisis real, sin compromiso.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <button className="btn-solar px-8 py-3 rounded-xl">
              💬 Hablar por WhatsApp
            </button>
          </a>
          <a href="mailto:Solergy.soluciones@gmail.com">
            <button className="btn-outline px-8 py-3 rounded-xl">
              📧 Enviar por correo
            </button>
          </a>
        </div>
        <p className="text-xs text-slate-600 mt-4">
          * Todos los valores son estimaciones de referencia. El ahorro real depende de consumo, orientación, hábitos y configuración del sistema.
        </p>
      </div>
    </motion.div>
  );
}
