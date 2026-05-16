"use client";
import { motion } from "framer-motion";
import { mockZones } from "@/lib/mock-data";
import { formatCLP } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  parcela: "Parcela",
  hogar: "Hogar",
  turismo: "Turismo",
  negocio: "Negocio",
  pyme: "PyME",
  agricola: "Agrícola",
};

const opportunityConfig = {
  alta: { label: "Alta", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  media: { label: "Media", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  baja: { label: "Baja", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
};

const regionLabels = { RM: "Región Metropolitana", V: "V Región", VI: "VI Región" };

export function Zones() {
  const grouped = mockZones.reduce<Record<string, typeof mockZones>>((acc, z) => {
    if (!acc[z.region]) acc[z.region] = [];
    acc[z.region].push(z);
    return acc;
  }, {});

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
            Zonas de{" "}
            <span className="gradient-text-solar">mayor oportunidad.</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm">
            Operamos en tres regiones con foco en las comunas de mayor potencial solar e interés energético.
          </p>
        </motion.div>

        <div className="space-y-10">
          {(["V", "VI", "RM"] as const).map((region) => (
            <motion.div
              key={region}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {regionLabels[region]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {grouped[region]?.map((z) => {
                  const opp = opportunityConfig[z.opportunity];
                  return (
                    <div
                      key={z.name}
                      className="glass rounded-xl p-4 hover:border-amber-500/20 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{z.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${opp.color}`}>
                          {opp.label}
                        </span>
                      </div>
                      <p className="text-xs text-amber-400/80 mb-2">{z.mainNeed}</p>
                      <div className="space-y-1 text-xs text-slate-500">
                        <div className="flex justify-between">
                          <span>Leads potenciales</span>
                          <span className="text-slate-300">{z.potentialLeads}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cuenta promedio</span>
                          <span className="text-slate-300">{formatCLP(z.avgBill)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {z.clientType.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded-md bg-slate-700/50 text-slate-400">
                              {typeLabels[t]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
