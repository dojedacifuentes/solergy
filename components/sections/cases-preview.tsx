"use client";
import { motion } from "framer-motion";
import { mockCases } from "@/lib/mock-data";
import { formatCLP } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  parcela: "Parcela",
  hogar: "Hogar",
  turismo: "Turismo / Cabañas",
  negocio: "Negocio",
  pyme: "PyME",
  agricola: "Agrícola",
};

const typeColors: Record<string, string> = {
  parcela: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  hogar: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  turismo: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  negocio: "text-green-400 bg-green-500/10 border-green-500/20",
};

export function CasesPreview() {
  return (
    <section id="casos" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Casos reales</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Lo que cambia cuando{" "}
            <span className="gradient-text-solar">decides actuar.</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm">
            Resultados reales de clientes en nuestra zona de cobertura. Nombres ficcionalizados, datos reales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockCases.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-amber-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColors[c.type] ?? "text-slate-400 bg-slate-500/10 border-slate-500/20"}`}>
                    {typeLabels[c.type]}
                  </span>
                  <h3 className="mt-2 font-semibold text-white text-lg">{c.title}</h3>
                  <p className="text-slate-500 text-sm">{c.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{Math.round((c.saving / c.monthlyBillBefore) * 100)}%</div>
                  <div className="text-xs text-slate-500">reducción</div>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-5">{c.description}</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="glass-light rounded-xl p-3 text-center">
                  <div className="text-xs text-slate-500 mb-1">Antes</div>
                  <div className="font-semibold text-white text-sm">{formatCLP(c.monthlyBillBefore)}</div>
                  <div className="text-xs text-slate-500">/mes</div>
                </div>
                <div className="glass-light rounded-xl p-3 text-center border border-amber-500/20">
                  <div className="text-xs text-amber-400/70 mb-1">Ahorra</div>
                  <div className="font-bold text-amber-400 text-sm">{formatCLP(c.saving)}</div>
                  <div className="text-xs text-slate-500">/mes</div>
                </div>
                <div className="glass-light rounded-xl p-3 text-center">
                  <div className="text-xs text-slate-500 mb-1">Retorno</div>
                  <div className="font-semibold text-green-400 text-sm">{c.roiYears} años</div>
                  <div className="text-xs text-slate-500">estimado</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className="text-amber-400">⚙️</span>
                <span>{c.system}</span>
              </div>

              <div className="mt-3 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-300 font-medium">
                ✨ {c.mainBenefit}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
