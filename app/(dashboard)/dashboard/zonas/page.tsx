"use client";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { mockZones } from "@/lib/mock-data";
import { formatCLP } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const typeLabels: Record<string, string> = {
  parcela: "Parcela", hogar: "Hogar", turismo: "Turismo", negocio: "Negocio", pyme: "PyME", agricola: "Agrícola",
};

const oppColors = {
  alta: "text-green-400 bg-green-500/10 border-green-500/20",
  media: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  baja: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

const regionLabels: Record<string, string> = { RM: "Región Metropolitana", V: "V Región", VI: "VI Región" };

export default function ZonasPage() {
  const totalLeads = mockZones.reduce((a, z) => a + z.potentialLeads, 0);
  const highOpp = mockZones.filter((z) => z.opportunity === "alta").length;

  const chartData = mockZones
    .sort((a, b) => b.potentialLeads - a.potentialLeads)
    .slice(0, 8)
    .map((z) => ({ name: z.name, leads: z.potentialLeads, cuenta: z.avgBill / 1000 }));

  return (
    <div>
      <DashboardHeader title="Mapa de Zonas" subtitle={`${totalLeads} leads potenciales · ${highOpp} zonas de alta oportunidad`} />

      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {(["V", "RM", "VI"] as const).map((r) => {
            const zones = mockZones.filter((z) => z.region === r);
            const leads = zones.reduce((a, z) => a + z.potentialLeads, 0);
            return (
              <div key={r} className="glass rounded-2xl p-5">
                <div className="text-amber-400 font-bold text-xl">{leads}</div>
                <div className="text-white text-sm font-medium mt-1">{regionLabels[r]}</div>
                <div className="text-slate-500 text-xs mt-0.5">{zones.length} comunas</div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Top comunas por potencial</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px" }} />
              <Bar dataKey="leads" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Leads potenciales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Zone cards by region */}
        {(["V", "VI", "RM"] as const).map((region) => {
          const zones = mockZones.filter((z) => z.region === region);
          return (
            <div key={region}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {regionLabels[region]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {zones.map((z, i) => (
                  <motion.div
                    key={z.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl p-5 hover:border-amber-500/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{z.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${oppColors[z.opportunity]}`}>
                        {z.opportunity.charAt(0).toUpperCase() + z.opportunity.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-amber-400/80 mb-3">{z.mainNeed}</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Leads potenciales</span>
                        <span className="text-white font-medium">{z.potentialLeads}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Cuenta promedio</span>
                        <span className="text-white font-medium">{formatCLP(z.avgBill)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {z.clientType.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded-md bg-slate-700/50 text-slate-400 text-xs">
                          {typeLabels[t]}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
