"use client";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DashboardHeader } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { mockKPIs, mockMonthlyData, mockLeads } from "@/lib/mock-data";
import { formatCLP, getStatusColor } from "@/lib/utils";
import Link from "next/link";

const PIE_COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444", "#06b6d4"];

export default function DashboardPage() {
  const statusCount = mockLeads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  const recentLeads = mockLeads.slice(0, 5);

  return (
    <div>
      <DashboardHeader title="Panel Comercial Solergy" subtitle="Vista general del pipeline y oportunidades" />

      <div className="p-6 space-y-8">
        {/* KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          {mockKPIs.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <StatsCard
                label={kpi.label}
                value={kpi.value}
                unit={kpi.unit}
                trend={kpi.trend}
                icon={kpi.icon}
                color={kpi.color}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly savings */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">kWh generados y ahorro mensual</h3>
            <p className="text-slate-500 text-xs mb-4">Proyección acumulada año</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px" }}
                  labelStyle={{ color: "#f8fafc" }}
                />
                <Line type="monotone" dataKey="kwhGenerated" stroke="#f59e0b" strokeWidth={2} dot={false} name="kWh" />
                <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} dot={false} name="Leads" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pipeline by status */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">Pipeline por estado</h3>
            <p className="text-slate-500 text-xs mb-4">Distribución de leads</p>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1">
              {pieData.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="capitalize text-slate-400">{p.name}</span>
                  </div>
                  <span className="text-white font-medium">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly savings bar */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-1">Ahorro acumulado proyectado</h3>
          <p className="text-slate-500 text-xs mb-4">CLP total por mes</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px" }}
                formatter={(v) => [formatCLP(Number(v)), "Ahorro"]}
              />
              <Bar dataKey="savings" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Ahorro" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent leads */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-white">Leads recientes</h3>
              <p className="text-slate-500 text-xs mt-0.5">Últimas oportunidades registradas</p>
            </div>
            <Link href="/dashboard/leads" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-4 p-3 rounded-xl glass-light hover:border-slate-600 transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-semibold text-sm flex-shrink-0">
                  {lead.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm truncate">{lead.name}</div>
                  <div className="text-slate-500 text-xs">{lead.commune} · {formatCLP(lead.monthlyBill)}/mes</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-green-400 text-sm font-semibold">{formatCLP(lead.potentialSaving)}</div>
                  <div className="text-slate-600 text-xs">ahorro/mes</div>
                </div>
                <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
