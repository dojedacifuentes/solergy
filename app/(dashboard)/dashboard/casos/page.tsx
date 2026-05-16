"use client";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { referenceScenarios } from "@/lib/data/mock-scenarios";
import { formatCLP } from "@/lib/utils";

const REGION_LABELS: Record<string, string> = { RM: "Región Metropolitana", V: "V Región", VI: "VI Región" };

export default function CasosPage() {
  return (
    <div>
      <DashboardHeader
        title="Escenarios de Referencia"
        subtitle="Resultados representativos por tipo de cliente y zona"
      />

      <div className="p-6 space-y-6">
        <div className="glass rounded-2xl p-5 border-amber-500/20 bg-amber-500/3">
          <p className="text-amber-300/90 text-sm">
            Los escenarios siguientes representan resultados típicos para cada tipo de cliente. Los valores reales dependen del consumo específico, orientación de techumbre, hábitos de uso y configuración del sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {referenceScenarios.map((sc, i) => {
            const saving = sc.billBefore - sc.billAfter;
            return (
              <motion.div
                key={sc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl overflow-hidden hover:border-amber-500/20 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl">{sc.icon}</span>
                        <h3 className="font-bold text-white text-lg">{sc.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">{sc.location}</span>
                        <span className="text-slate-700">·</span>
                        <span className="text-xs text-slate-500">{REGION_LABELS[sc.region]}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 text-xs font-bold">
                      ROI {sc.roiYears} años
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="glass-light rounded-xl p-3 text-center">
                      <div className="text-red-400 text-lg font-bold">{formatCLP(sc.billBefore)}</div>
                      <div className="text-slate-500 text-xs mt-0.5">Antes/mes</div>
                    </div>
                    <div className="glass-light rounded-xl p-3 text-center">
                      <div className="text-green-400 text-lg font-bold">{formatCLP(sc.billAfter)}</div>
                      <div className="text-slate-500 text-xs mt-0.5">Después/mes</div>
                    </div>
                    <div className="glass-light rounded-xl p-3 text-center">
                      <div className="text-amber-400 text-lg font-bold">{sc.savingPercent}%</div>
                      <div className="text-slate-500 text-xs mt-0.5">Ahorro</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Cobertura solar</span>
                      <span className="text-amber-400 font-bold">{formatCLP(saving)}/mes ahorrado</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sc.savingPercent}%` }}
                        transition={{ delay: i * 0.07 + 0.3, duration: 0.8 }}
                        className="h-2 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                      />
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{sc.detail}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-800">
                    <span>⚙️</span>
                    <span>{sc.system}</span>
                  </div>
                </div>

                <div className="px-6 py-3 bg-slate-900/40 border-t border-slate-800">
                  <p className="text-amber-400/80 text-xs font-medium">✓ {sc.mainBenefit}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
