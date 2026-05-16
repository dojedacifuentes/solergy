"use client";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { DashboardHeader } from "@/components/dashboard/header";
import { mockMonthlyData, mockLeads } from "@/lib/mock-data";
import { formatCLP } from "@/lib/utils";

export default function AnalyticsPage() {
  const totalSavings = mockMonthlyData.reduce((a, m) => a + m.savings, 0);
  const totalKwh = mockMonthlyData.reduce((a, m) => a + m.kwhGenerated, 0);
  const totalLeads = mockMonthlyData.reduce((a, m) => a + m.leads, 0);
  const avgROI = mockLeads.reduce((a, l) => a + l.projectValue, 0) / mockLeads.length;

  const cumulativeData = mockMonthlyData.map((d, i, arr) => ({
    ...d,
    cumulativeSavings: arr.slice(0, i + 1).reduce((sum, x) => sum + x.savings, 0),
    cumulativeKwh: arr.slice(0, i + 1).reduce((sum, x) => sum + x.kwhGenerated, 0),
  }));

  return (
    <div>
      <DashboardHeader title="Analytics" subtitle="Proyecciones y métricas del portfolio" />

      <div className="p-6 space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Ahorro total anual", value: formatCLP(totalSavings), icon: "💰", color: "text-amber-400" },
            { label: "kWh generados/año", value: totalKwh.toLocaleString("es-CL"), icon: "⚡", color: "text-yellow-400" },
            { label: "Leads en el año", value: totalLeads, icon: "👥", color: "text-blue-400" },
            { label: "Proyecto promedio", value: formatCLP(avgROI), icon: "📈", color: "text-green-400" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-5"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className={`text-2xl font-bold ${item.color} mt-2`}>{item.value}</div>
              <div className="text-slate-400 text-sm mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Area chart: cumulative savings */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-1">Ahorro acumulado proyectado</h3>
          <p className="text-xs text-slate-500 mb-4">Crecimiento acumulado del portfolio (CLP)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px" }}
                formatter={(v) => [formatCLP(Number(v)), "Ahorro acumulado"]}
              />
              <Area type="monotone" dataKey="cumulativeSavings" stroke="#f59e0b" strokeWidth={2} fill="url(#savingsGrad)" name="Ahorro acumulado" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Two charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* kWh by month */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">kWh generados por mes</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px" }} />
                <Bar dataKey="kwhGenerated" fill="#fbbf24" radius={[4, 4, 0, 0]} name="kWh" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leads by month */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Leads nuevos por mes</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px" }} />
                <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} name="Leads" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline by property type */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Pipeline por tipo de cliente</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(
              mockLeads.reduce<Record<string, { count: number; value: number }>>((acc, l) => {
                if (!acc[l.propertyType]) acc[l.propertyType] = { count: 0, value: 0 };
                acc[l.propertyType].count++;
                acc[l.propertyType].value += l.projectValue;
                return acc;
              }, {})
            ).map(([type, data]) => (
              <div key={type} className="glass-light rounded-xl p-4 text-center">
                <div className="text-amber-400 text-2xl font-bold">{data.count}</div>
                <div className="text-white text-sm capitalize mt-1">{type}</div>
                <div className="text-green-400 text-xs mt-1">{formatCLP(data.value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
