"use client";
import { motion } from "framer-motion";
import { solarZones } from "@/lib/data/mock-zones";
import { regionStats } from "@/lib/data/mock-regions";
import { formatCLP } from "@/lib/utils";

const REGION_LABELS: Record<string, string> = { RM: "Región Metropolitana", V: "V Región", VI: "VI Región" };

function scoreGlow(score: number): string {
  if (score >= 82) return "border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.15)]";
  if (score >= 78) return "border-amber-500/25";
  return "border-slate-700/50";
}

export function Zones() {
  const highPriority = [...solarZones]
    .filter((z) => z.opportunity === "alta")
    .sort((a, b) => b.solarScore - a.solarScore)
    .slice(0, 9);

  return (
    <section id="zonas" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Cobertura</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Operamos donde el{" "}
            <span className="gradient-text-solar">potencial es más alto.</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Cubrimos más de 25 comunas en tres regiones, priorizando las zonas con mayor irradiación solar, cuentas elevadas y menor saturación del mercado.
          </p>
        </motion.div>

        {/* Regional stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {regionStats.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass rounded-2xl p-5 border ${
                r.id === "RM" ? "border-blue-500/20" : r.id === "V" ? "border-amber-500/20" : "border-green-500/20"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  r.id === "RM" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                  r.id === "V" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                  "bg-green-500/20 text-green-300 border-green-500/30"
                }`}>{r.id}</span>
                <span className="text-green-400 text-xs font-bold">+{r.avgGrowthPct}%</span>
              </div>
              <div className={`text-3xl font-bold ${r.color} mb-1`}>{(r.installedKw / 1000).toFixed(0)} MW</div>
              <div className="text-slate-300 text-sm font-medium">{r.name}</div>
              <div className="text-slate-500 text-xs mt-1">{r.installations.toLocaleString("es-CL")} instalaciones · crecimiento anual</div>
            </motion.div>
          ))}
        </div>

        {/* Top zones heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Zonas de mayor oportunidad</h3>
          <p className="text-slate-500 text-xs mb-6">Las comunas con mayor puntaje solar, más alta demanda y menor saturación del mercado. El punto de partida ideal.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highPriority.map((z, i) => (
            <motion.div
              key={z.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`glass rounded-xl p-5 border hover:-translate-y-0.5 transition-all duration-200 ${scoreGlow(z.solarScore)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{z.name}</h4>
                  <div className="text-slate-500 text-xs mt-0.5">{REGION_LABELS[z.region]}</div>
                </div>
                <div className="text-right">
                  <div className="text-amber-400 font-bold text-lg leading-none">{z.solarScore}</div>
                  <div className="text-slate-600 text-xs">puntaje</div>
                </div>
              </div>

              <p className="text-xs text-amber-400/80 mb-3 leading-relaxed">{z.narrative.slice(0, 80)}…</p>

              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Cuenta promedio</span>
                  <span className="text-slate-300 font-medium">{formatCLP(z.avgBill)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Leads identificados</span>
                  <span className="text-slate-300 font-medium">{z.potentialLeads}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-1">
                {z.clientProfiles.slice(0, 3).map((p) => (
                  <span key={p} className="px-1.5 py-0.5 rounded-md bg-slate-700/50 text-slate-400 text-xs capitalize">
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
