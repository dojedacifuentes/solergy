"use client";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { ZoneHeatmap } from "@/components/zones/zone-heatmap";
import { solarZones, corridors } from "@/lib/data/mock-zones";
import { regionStats, sectorBreakdown } from "@/lib/data/mock-regions";
import { formatCLP } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const REGION_COLORS: Record<string, string> = { RM: "#3b82f6", V: "#f59e0b", VI: "#10b981" };

export default function ZonasPage() {
  const totalLeads = solarZones.reduce((a, z) => a + z.potentialLeads, 0);
  const topZones = [...solarZones].sort((a, b) => b.solarScore - a.solarScore).slice(0, 10);

  const chartData = topZones.map((z) => ({
    name: z.name,
    score: z.solarScore,
    leads: z.potentialLeads,
    fill: REGION_COLORS[z.region] ?? "#f59e0b",
  }));

  return (
    <div>
      <DashboardHeader
        title="Mapa Estratégico de Zonas"
        subtitle={`${solarZones.length} comunas analizadas · ${totalLeads} leads potenciales identificados`}
      />

      <div className="p-6 space-y-8">
        {/* Regional KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {regionStats.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  r.id === "RM" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                  r.id === "V" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                  "bg-green-500/20 text-green-300 border-green-500/30"
                }`}>{r.id}</span>
                <span className="text-green-400 text-xs font-bold">+{r.avgGrowthPct}% crecimiento</span>
              </div>
              <div className="text-white font-semibold text-sm mb-1">{r.name}</div>
              <div className={`text-2xl font-bold ${r.color} mb-1`}>
                {(r.installedKw / 1000).toFixed(0)} MW
              </div>
              <div className="text-slate-500 text-xs">{r.installations.toLocaleString("es-CL")} instalaciones · CNE ene 2026</div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
                {r.opportunity}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">Top zonas por puntaje solar</h3>
            <p className="text-slate-500 text-xs mb-4">Score 0–100 basado en radiación, consumo, saturación y capacidad de pago</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} layout="vertical" barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" domain={[60, 90]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px" }}
                  formatter={(v) => [`${v}/100`, "Puntaje"]}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} name="Score solar">
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">Mercado por sector</h3>
            <p className="text-slate-500 text-xs mb-4">Distribución instalaciones Chile central</p>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={sectorBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="percent" paddingAngle={3}>
                  {sectorBreakdown.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px" }} formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1">
              {sectorBreakdown.map((s) => (
                <div key={s.sector} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-slate-400">{s.sector}</span>
                  </div>
                  <span className="text-white font-medium">{s.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic corridors */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-1">Corredores estratégicos Solergy</h3>
          <p className="text-slate-500 text-xs mb-5">Zonas de prioridad concentrada con mayor retorno por km de prospección</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {corridors.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl p-4 border ${
                  c.region === "RM" ? "bg-blue-500/5 border-blue-500/20" :
                  c.region === "V" ? "bg-amber-500/5 border-amber-500/20" :
                  "bg-green-500/5 border-green-500/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    c.region === "RM" ? "bg-blue-500/20 text-blue-300" :
                    c.region === "V" ? "bg-amber-500/20 text-amber-300" :
                    "bg-green-500/20 text-green-300"
                  }`}>{c.region}</span>
                  <span className="text-white text-xs font-semibold">Score: {c.avgScore}/100</span>
                </div>
                <div className="font-semibold text-white text-sm mb-2">{c.name}</div>
                <p className="text-slate-400 text-xs leading-relaxed">{c.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive heatmap */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-1">Mapa de calor solar</h3>
          <p className="text-slate-500 text-xs mb-5">Haz clic en una zona para ver el análisis detallado · Ordenado por puntaje solar</p>
          <ZoneHeatmap />
        </div>
      </div>
    </div>
  );
}
