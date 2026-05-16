"use client";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { mockCases } from "@/lib/mock-data";
import { formatCLP } from "@/lib/utils";

export default function CasosPage() {
  return (
    <div>
      <DashboardHeader title="Casos de Éxito" subtitle="Instalaciones con resultados documentados" />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockCases.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-amber-500/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs text-amber-400 font-medium uppercase tracking-wider mb-1 capitalize">{c.type}</div>
                  <h3 className="font-bold text-white text-lg">{c.title}</h3>
                  <p className="text-slate-500 text-sm">{c.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-400">
                    {Math.round(((c.monthlyBillBefore - c.monthlyBillAfter) / c.monthlyBillBefore) * 100)}%
                  </div>
                  <div className="text-xs text-slate-500">menos en cuenta</div>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-5">{c.description}</p>

              {/* Before/after visual */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="glass-light rounded-xl p-3 text-center">
                  <div className="text-xs text-red-400 mb-1">Antes</div>
                  <div className="font-bold text-white">{formatCLP(c.monthlyBillBefore)}</div>
                  <div className="text-xs text-slate-500">/mes</div>
                </div>
                <div className="glass-light rounded-xl p-3 text-center border border-amber-500/20">
                  <div className="text-xs text-amber-400 mb-1">Después</div>
                  <div className="font-bold text-amber-300">{formatCLP(c.monthlyBillAfter)}</div>
                  <div className="text-xs text-slate-500">/mes</div>
                </div>
                <div className="glass-light rounded-xl p-3 text-center border border-green-500/20">
                  <div className="text-xs text-green-400 mb-1">Retorno</div>
                  <div className="font-bold text-green-300">{c.roiYears} años</div>
                  <div className="text-xs text-slate-500">estimado</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span>⚙️</span>
                <span>{c.system}</span>
              </div>

              <div className="px-3 py-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300 font-medium">
                ✨ {c.mainBenefit}
              </div>

              {/* Annual savings projection */}
              <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between text-sm">
                <span className="text-slate-400">Ahorro anual proyectado</span>
                <span className="text-green-400 font-semibold">{formatCLP(c.saving * 12)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
