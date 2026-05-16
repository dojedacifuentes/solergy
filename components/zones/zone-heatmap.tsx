"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarZones, type SolarZone } from "@/lib/data/mock-zones";
import { formatCLP } from "@/lib/utils";

type RegionFilter = "all" | "RM" | "V" | "VI";

function scoreToColor(score: number): string {
  if (score >= 82) return "bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.6)]";
  if (score >= 78) return "bg-amber-500/80 shadow-[0_0_12px_rgba(251,191,36,0.4)]";
  if (score >= 74) return "bg-orange-500/70 shadow-[0_0_8px_rgba(249,115,22,0.3)]";
  return "bg-slate-600/80";
}

function scoreToTextColor(score: number): string {
  if (score >= 78) return "text-amber-400";
  if (score >= 74) return "text-orange-400";
  return "text-slate-400";
}

function opportunityBadge(opp: string): string {
  if (opp === "alta") return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  if (opp === "media") return "bg-blue-500/20 text-blue-300 border-blue-500/30";
  return "bg-slate-500/20 text-slate-400 border-slate-500/30";
}

const REGION_LABELS: Record<string, string> = {
  RM: "Metropolitana",
  V: "Valparaíso",
  VI: "O'Higgins",
};

export function ZoneHeatmap() {
  const [activeRegion, setActiveRegion] = useState<RegionFilter>("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<SolarZone | null>(null);

  const filtered = activeRegion === "all"
    ? solarZones
    : solarZones.filter((z) => z.region === activeRegion);

  const sorted = [...filtered].sort((a, b) => b.solarScore - a.solarScore);

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "RM", "V", "VI"] as RegionFilter[]).map((r) => (
          <button
            key={r}
            onClick={() => setActiveRegion(r)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeRegion === r
                ? "bg-amber-500 text-slate-900"
                : "glass-light text-slate-400 hover:text-white"
            }`}
          >
            {r === "all" ? "Todas las zonas" : `R. ${REGION_LABELS[r]}`}
          </button>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {sorted.map((zone) => (
          <motion.button
            key={zone.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setSelected(selected?.id === zone.id ? null : zone)}
            onMouseEnter={() => setHovered(zone.id)}
            onMouseLeave={() => setHovered(null)}
            className={`relative glass rounded-2xl p-4 text-left transition-all cursor-pointer border ${
              selected?.id === zone.id
                ? "border-amber-500/60 bg-amber-500/5"
                : hovered === zone.id
                ? "border-slate-600 bg-slate-800/40"
                : "border-slate-800/60"
            }`}
          >
            {/* Score indicator dot */}
            <div className="flex items-start justify-between mb-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${scoreToColor(zone.solarScore)}`} />
              <span className={`text-xs font-bold ${scoreToTextColor(zone.solarScore)}`}>
                {zone.solarScore}
              </span>
            </div>

            <div className="font-semibold text-white text-sm mb-1 leading-tight">{zone.name}</div>
            <div className="text-slate-500 text-xs mb-2">{REGION_LABELS[zone.region]}</div>

            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${opportunityBadge(zone.opportunity)}`}>
              {zone.opportunity}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass rounded-2xl p-6 border border-amber-500/20 bg-amber-500/3"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${opportunityBadge(selected.opportunity)}`}>
                    {selected.opportunity.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                    {selected.profileLabel}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{REGION_LABELS[selected.region]}{selected.corridor ? ` · ${selected.corridor}` : ""}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-slate-400 text-xl leading-none">×</button>
            </div>

            <p className="text-slate-300 text-sm mb-5 leading-relaxed">{selected.narrative}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div className="glass-light rounded-xl p-3 text-center">
                <div className={`text-2xl font-bold ${scoreToTextColor(selected.solarScore)}`}>{selected.solarScore}</div>
                <div className="text-slate-500 text-xs mt-1">Puntaje solar</div>
              </div>
              <div className="glass-light rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{selected.potentialLeads}</div>
                <div className="text-slate-500 text-xs mt-1">Leads potenciales</div>
              </div>
              <div className="glass-light rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{formatCLP(selected.avgBill)}</div>
                <div className="text-slate-500 text-xs mt-1">Cuenta promedio</div>
              </div>
              <div className="glass-light rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">{selected.radiationScore}</div>
                <div className="text-slate-500 text-xs mt-1">Puntaje radiación</div>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="space-y-2">
              <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider mb-3">Desglose de puntaje</p>
              {[
                { label: "Consumo (30%)", value: selected.demandScore, max: 100 },
                { label: "Radiación (20%)", value: selected.radiationScore, max: 100 },
                { label: "Continuidad (15%)", value: selected.continuityScore, max: 100 },
                { label: "Cap. de pago (20%)", value: selected.paymentScore, max: 100 },
                { label: "Saturación inversa (15%)", value: 100 - selected.saturationScore, max: 100 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs w-40 flex-shrink-0">{item.label}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-amber-500/70"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-slate-400 text-xs w-8 text-right">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
              {selected.clientProfiles.map((p) => (
                <span key={p} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs capitalize">
                  {p}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-500">
        <span className="font-medium text-slate-400">Intensidad solar:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          <span>≥82 · Óptimo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span>78–81 · Alto</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500/70" />
          <span>74–77 · Bueno</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-600/80" />
          <span>{"<"}74 · Moderado</span>
        </div>
      </div>
    </div>
  );
}
