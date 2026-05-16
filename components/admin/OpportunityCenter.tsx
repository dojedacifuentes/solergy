"use client";
import { useState } from "react";
import { solarZones } from "@/lib/data/mock-zones";
import { type AdminLead } from "@/lib/hooks/useLeads";
import { formatCLP } from "@/lib/utils";
import { Plus } from "lucide-react";

const OPPORTUNITY_COLORS: Record<string, string> = {
  alta: "bg-green-500/20 text-green-300 border-green-500/30",
  media: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  baja: "bg-slate-600/20 text-slate-400 border-slate-600/30",
  exploratoria: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const OPPORTUNITY_LABELS: Record<string, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
  exploratoria: "Exploratoria",
};

interface OpportunityCenterProps {
  leads: AdminLead[];
  onAddLeadForZone: (commune: string, region: string) => void;
}

export function OpportunityCenter({ leads, onAddLeadForZone }: OpportunityCenterProps) {
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterOpportunity, setFilterOpportunity] = useState("all");

  const filteredZones = solarZones.filter((z) => {
    if (filterRegion !== "all" && z.region !== filterRegion) return false;
    if (filterOpportunity !== "all" && z.opportunity !== filterOpportunity) return false;
    return true;
  });

  const leadsPerCommune = leads.reduce<Record<string, number>>((acc, l) => {
    const key = l.commune.toLowerCase().trim();
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const opportunityCounts = solarZones.reduce<Record<string, number>>((acc, z) => {
    acc[z.opportunity] = (acc[z.opportunity] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["alta", "media", "baja", "exploratoria"] as const).map((opp) => (
          <div key={opp} className="bg-slate-900 border border-slate-800/60 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{opportunityCounts[opp] ?? 0}</div>
            <div className={`text-xs font-medium mt-0.5 inline-flex px-2 py-0.5 rounded-full border ${OPPORTUNITY_COLORS[opp]}`}>
              {OPPORTUNITY_LABELS[opp]}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
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
          value={filterOpportunity}
          onChange={(e) => setFilterOpportunity(e.target.value)}
          className="bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none"
        >
          <option value="all" className="bg-slate-900">Todas las oportunidades</option>
          <option value="alta" className="bg-slate-900">Alta</option>
          <option value="media" className="bg-slate-900">Media</option>
          <option value="baja" className="bg-slate-900">Baja</option>
          <option value="exploratoria" className="bg-slate-900">Exploratoria</option>
        </select>

        <span className="text-slate-500 text-xs ml-auto">{filteredZones.length} zonas</span>
      </div>

      {/* Zone grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredZones.map((zone) => {
          const leadsHere = leadsPerCommune[zone.name.toLowerCase().trim()] ?? 0;
          return (
            <div key={zone.id} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-white font-bold text-base">{zone.name}</h3>
                  <span className="text-xs text-slate-500">{zone.region === "RM" ? "R. Metropolitana" : zone.region === "V" ? "V Región" : "VI Región"}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-semibold ${zone.solarScore >= 80 ? "text-amber-400" : "text-slate-400"}`}>
                    ☀ {zone.solarScore}/100
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${OPPORTUNITY_COLORS[zone.opportunity]}`}>
                    {OPPORTUNITY_LABELS[zone.opportunity]}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/40 rounded-lg p-2">
                  <span className="text-slate-500 block">Cuenta prom.</span>
                  <span className="text-slate-300 font-medium">{formatCLP(zone.avgBill)}</span>
                </div>
                <div className="bg-slate-800/40 rounded-lg p-2">
                  <span className="text-slate-500 block">Leads pot.</span>
                  <span className="text-slate-300 font-medium">{zone.potentialLeads}</span>
                </div>
              </div>

              {/* Profiles */}
              <div className="flex flex-wrap gap-1">
                {zone.clientProfiles.map((p) => (
                  <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">{p}</span>
                ))}
              </div>

              {/* Narrative snippet */}
              <p className="text-xs text-slate-500 line-clamp-2">{zone.narrative.slice(0, 100)}{zone.narrative.length > 100 ? "..." : ""}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
                <span className="text-xs text-slate-500">
                  {leadsHere > 0
                    ? `${leadsHere} lead${leadsHere !== 1 ? "s" : ""} en tu panel`
                    : "Sin leads aún"}
                </span>
                <button
                  type="button"
                  onClick={() => onAddLeadForZone(zone.name, zone.region)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  Agregar lead
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredZones.length === 0 && (
        <div className="py-16 text-center text-slate-600 text-sm">
          No hay zonas con este filtro.
        </div>
      )}
    </div>
  );
}
