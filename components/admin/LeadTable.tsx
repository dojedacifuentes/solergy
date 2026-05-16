"use client";
import { useState } from "react";
import { type AdminLead, type LeadStatus } from "@/lib/hooks/useLeads";
import { formatCLP } from "@/lib/utils";
import { Search, RefreshCw, Eye, Trash2 } from "lucide-react";

export const STATUS_CONFIG: Record<LeadStatus, { label: string; classes: string }> = {
  nuevo: { label: "Nuevo", classes: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  contactado: { label: "Contactado", classes: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  evaluando: { label: "Evaluando", classes: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  propuesta_enviada: { label: "Propuesta enviada", classes: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  seguimiento: { label: "Seguimiento", classes: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  cerrado: { label: "Cerrado", classes: "bg-green-500/20 text-green-300 border-green-500/30" },
  perdido: { label: "Perdido", classes: "bg-red-900/20 text-red-400 border-red-900/30" },
};

const PRIORITY_COLORS: Record<string, string> = {
  alta: "bg-red-500",
  media: "bg-amber-500",
  baja: "bg-slate-500",
};

interface LeadTableProps {
  leads: AdminLead[];
  onOpenDrawer: (lead: AdminLead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  onAutoScore: (id: string) => void;
  onNewLead: () => void;
}

export function LeadTable({
  leads,
  onOpenDrawer,
  onUpdateStatus,
  onDeleteLead,
  onAutoScore,
  onNewLead,
}: LeadTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = leads.filter((l) => {
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    if (filterRegion !== "all" && l.region !== filterRegion) return false;
    if (filterPriority !== "all" && l.leadPriority !== filterPriority) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        (l.phone ?? "").toLowerCase().includes(q) ||
        l.commune.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <button
          type="button"
          onClick={onNewLead}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm rounded-xl transition-all"
        >
          + Nuevo lead
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre, teléfono, comuna..."
            className="bg-slate-800/60 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-56"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none"
        >
          <option value="all" className="bg-slate-900">Todos los estados</option>
          {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
            <option key={s} value={s} className="bg-slate-900">{STATUS_CONFIG[s].label}</option>
          ))}
        </select>

        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          className="bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none"
        >
          <option value="all" className="bg-slate-900">Todas las regiones</option>
          <option value="V" className="bg-slate-900">V Región</option>
          <option value="RM" className="bg-slate-900">RM</option>
          <option value="VI" className="bg-slate-900">VI Región</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none"
        >
          <option value="all" className="bg-slate-900">Todas las prioridades</option>
          <option value="alta" className="bg-slate-900">Alta</option>
          <option value="media" className="bg-slate-900">Media</option>
          <option value="baja" className="bg-slate-900">Baja</option>
        </select>

        <span className="text-slate-500 text-xs ml-auto">{filtered.length} leads</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800/60 bg-slate-900/50">
              {["Nombre / Contacto", "Comuna", "Tipo", "Cuenta", "Score", "Prioridad", "Estado", "Acciones"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-600 text-sm">
                  No hay leads con este filtro
                </td>
              </tr>
            )}
            {filtered.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors cursor-pointer"
                onClick={() => onOpenDrawer(lead)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="font-medium text-white">{lead.name}</div>
                  {lead.phone && <div className="text-xs text-slate-500">{lead.phone}</div>}
                  {lead.email && <div className="text-xs text-slate-500">{lead.email}</div>}
                </td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                  {lead.commune}
                  <br />
                  <span className="text-xs text-slate-600">{lead.region}</span>
                </td>
                <td className="px-4 py-3 text-slate-400 capitalize">{lead.propertyType}</td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{formatCLP(lead.monthlyBill)}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    {lead.score !== undefined && lead.score !== null ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        lead.score >= 70 ? "bg-green-500/20 text-green-300" :
                        lead.score >= 50 ? "bg-amber-500/20 text-amber-300" :
                        "bg-slate-700 text-slate-400"
                      }`}>
                        {lead.score}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                    <button
                      type="button"
                      title="Recalcular score"
                      onClick={(e) => { e.stopPropagation(); onAutoScore(lead.id); }}
                      className="p-0.5 rounded hover:bg-slate-700 text-slate-500 hover:text-amber-400 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {lead.leadPriority ? (
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[lead.leadPriority] ?? "bg-slate-500"}`} />
                      <span className="text-xs text-slate-400 capitalize">{lead.leadPriority}</span>
                    </div>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                    className={`border rounded-lg px-2 py-1 text-xs font-medium appearance-none focus:outline-none cursor-pointer ${STATUS_CONFIG[lead.status].classes} bg-transparent`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
                      <option key={s} value={s} className="bg-slate-900 text-white">{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      title="Ver detalles"
                      onClick={(e) => { e.stopPropagation(); onOpenDrawer(lead); }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {deleteConfirm === lead.id ? (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onDeleteLead(lead.id); setDeleteConfirm(null); }}
                          className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs"
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                          className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        title="Eliminar"
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(lead.id); }}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
