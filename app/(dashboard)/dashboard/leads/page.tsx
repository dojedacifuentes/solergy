"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { mockLeads } from "@/lib/mock-data";
import { formatCLP, getStatusColor, getPriorityIcon } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types";

const statusOptions: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "nuevo", label: "Nuevos" },
  { value: "contactado", label: "Contactados" },
  { value: "evaluacion", label: "En evaluación" },
  { value: "propuesta", label: "Propuesta" },
  { value: "cerrado", label: "Cerrados" },
];

export default function LeadsPage() {
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = mockLeads.filter((l) => {
    const matchStatus = filter === "all" || l.status === filter;
    const matchSearch = search === "" || l.name.toLowerCase().includes(search.toLowerCase()) || l.commune.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPipeline = filtered.reduce((acc, l) => acc + l.projectValue, 0);

  return (
    <div>
      <DashboardHeader title="Leads" subtitle={`${filtered.length} oportunidades · Pipeline: ${formatCLP(totalPipeline)}`} />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre o comuna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((s) => (
              <button
                key={s.value}
                onClick={() => setFilter(s.value)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filter === s.value ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "glass text-slate-400 hover:text-white"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leads table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tipo</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cuenta</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Prioridad</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ahorro pot.</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Proyecto</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-semibold flex-shrink-0">
                          {lead.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{lead.name}</div>
                          <div className="text-xs text-slate-500">{lead.commune} · {lead.region === "RM" ? "RM" : `${lead.region} Reg.`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="capitalize text-slate-400 text-sm">{lead.propertyType}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-white text-sm font-medium">{formatCLP(lead.monthlyBill)}</span>
                      <div className="text-xs text-slate-600">/mes</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-slate-400">
                        {getPriorityIcon(lead.priority)}
                        <span className="capitalize">{lead.priority}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-green-400 font-semibold text-sm">{formatCLP(lead.potentialSaving)}</span>
                      <div className="text-xs text-slate-600">/mes</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-white font-medium text-sm">{formatCLP(lead.projectValue)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                Sin leads que coincidan con los filtros aplicados.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
