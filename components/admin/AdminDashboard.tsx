"use client";
import { type AdminLead, type LeadStatus } from "@/lib/hooks/useLeads";
import { formatCLP } from "@/lib/utils";
import { Users, TrendingUp, FileText, CheckCircle } from "lucide-react";

const STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  evaluando: "Evaluando",
  propuesta_enviada: "Propuesta enviada",
  seguimiento: "Seguimiento",
  cerrado: "Cerrado",
  perdido: "Perdido",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  nuevo: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  contactado: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  evaluando: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  propuesta_enviada: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  seguimiento: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  cerrado: "bg-green-500/20 text-green-300 border-green-500/30",
  perdido: "bg-red-900/20 text-red-400 border-red-900/30",
};

const INACTIVE_STATUSES: LeadStatus[] = ["cerrado", "perdido"];

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
}

function KpiCard({ label, value, sub, icon, accent = "text-amber-400" }: KpiCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        <span className={`${accent}`}>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white leading-none">{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

interface AdminDashboardProps {
  leads: AdminLead[];
  onGoToLeads: () => void;
}

export function AdminDashboard({ leads, onGoToLeads }: AdminDashboardProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center">
          <Users className="w-8 h-8 text-amber-400" />
        </div>
        <div className="text-center">
          <p className="text-slate-300 font-semibold text-lg mb-1">No hay leads aún</p>
          <p className="text-slate-500 text-sm">Agrega tu primer cliente desde la pestaña Leads.</p>
        </div>
        <button
          type="button"
          onClick={onGoToLeads}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm rounded-xl transition-all"
        >
          + Nuevo lead
        </button>
      </div>
    );
  }

  const activeLeads = leads.filter((l) => !INACTIVE_STATUSES.includes(l.status));
  const proposalLeads = leads.filter((l) => l.status === "propuesta_enviada");
  const closedLeads = leads.filter((l) => l.status === "cerrado");

  const totalAnnualSaving = activeLeads.reduce(
    (sum, l) => sum + (l.estimatedAnnualSaving ?? (l.estimatedSaving ? l.estimatedSaving * 12 : 0)),
    0
  );
  const pipelineValue = activeLeads.reduce(
    (sum, l) => sum + (l.quotation?.projectValue ?? l.projectValue ?? 0),
    0
  );

  const leadsWithScore = leads.filter((l) => l.score !== undefined && l.score !== null);
  const avgScore =
    leadsWithScore.length > 0
      ? Math.round(leadsWithScore.reduce((s, l) => s + (l.score ?? 0), 0) / leadsWithScore.length)
      : null;

  const mostRecent = [...leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  const statusCount = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});
  const topStatus = Object.entries(statusCount).sort((a, b) => b[1] - a[1])[0];

  const communeCount = leads.reduce<Record<string, number>>((acc, l) => {
    if (l.commune) acc[l.commune] = (acc[l.commune] ?? 0) + 1;
    return acc;
  }, {});
  const topCommune = Object.entries(communeCount).sort((a, b) => b[1] - a[1])[0];

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Row 1 — Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          label="Total leads"
          value={leads.length}
          icon={<Users className="w-5 h-5" />}
        />
        <KpiCard
          label="Pipeline activo"
          value={activeLeads.length}
          sub="sin cerrados ni perdidos"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <KpiCard
          label="Propuestas enviadas"
          value={proposalLeads.length}
          icon={<FileText className="w-5 h-5" />}
          accent="text-purple-400"
        />
        <KpiCard
          label="Cerrados"
          value={closedLeads.length}
          icon={<CheckCircle className="w-5 h-5" />}
          accent="text-green-400"
        />
      </div>

      {/* Row 2 — Financial */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Ahorro anual potencial"
          value={formatCLP(totalAnnualSaving)}
          sub="leads activos"
          icon={<span className="text-lg">💰</span>}
        />
        <KpiCard
          label="Valor pipeline"
          value={formatCLP(pipelineValue)}
          sub="leads activos"
          icon={<span className="text-lg">⚡</span>}
        />
        <KpiCard
          label="Score promedio"
          value={avgScore !== null ? `${avgScore}/100` : "—"}
          sub={avgScore !== null ? `${leadsWithScore.length} leads con score` : "Sin scores calculados"}
          icon={<span className="text-lg">📊</span>}
        />
      </div>

      {/* Row 3 — Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Lead más reciente</span>
          {mostRecent ? (
            <>
              <p className="text-white font-semibold">{mostRecent.name}</p>
              <p className="text-slate-400 text-sm">{mostRecent.commune}{mostRecent.region ? `, ${mostRecent.region}` : ""}</p>
              <p className="text-slate-600 text-xs mt-1">{new Date(mostRecent.createdAt).toLocaleDateString("es-CL")}</p>
            </>
          ) : (
            <p className="text-slate-600 text-sm">—</p>
          )}
        </div>
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Estado más frecuente</span>
          {topStatus ? (
            <>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[topStatus[0] as LeadStatus] ?? "bg-slate-700 text-slate-300"}`}>
                {STATUS_LABELS[topStatus[0] as LeadStatus] ?? topStatus[0]}
              </span>
              <p className="text-slate-500 text-xs mt-2">{topStatus[1]} leads</p>
            </>
          ) : (
            <p className="text-slate-600 text-sm">—</p>
          )}
        </div>
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Comuna top</span>
          {topCommune ? (
            <>
              <p className="text-white font-semibold">{topCommune[0]}</p>
              <p className="text-slate-500 text-xs mt-1">{topCommune[1]} leads</p>
            </>
          ) : (
            <p className="text-slate-600 text-sm">—</p>
          )}
        </div>
      </div>

      {/* Status summary */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Distribución por estado</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => {
            const count = statusCount[s] ?? 0;
            if (count === 0) return null;
            return (
              <span
                key={s}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[s]}`}
              >
                {STATUS_LABELS[s]}
                <span className="font-bold">{count}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800/60">
          <h3 className="text-sm font-semibold text-slate-300">Leads recientes</h3>
        </div>
        <div className="divide-y divide-slate-800/40">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                <p className="text-xs text-slate-500">{lead.commune}{lead.region ? `, ${lead.region}` : ""}</p>
              </div>
              <span className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[lead.status]}`}>
                {STATUS_LABELS[lead.status]}
              </span>
              {lead.score !== undefined && lead.score !== null ? (
                <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                  lead.score >= 70 ? "bg-green-500/20 text-green-300" :
                  lead.score >= 50 ? "bg-amber-500/20 text-amber-300" :
                  "bg-slate-700 text-slate-400"
                }`}>
                  {lead.score}/100
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
