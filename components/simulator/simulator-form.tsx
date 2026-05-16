"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { SimulatorInput, Region, PropertyType, Priority, NightConsumption } from "@/types";
import { solarZones } from "@/lib/data/mock-zones";
import { formatCLP } from "@/lib/utils";

interface QuizPrefill {
  region?: Region;
  commune?: string;
  propertyType?: PropertyType;
  monthlyBill?: number;
  priority?: Priority;
  nightConsumption?: NightConsumption;
  hasPool?: boolean;
  hasWaterPump?: boolean;
  workFromHome?: boolean;
}

interface Props {
  onResult: (input: SimulatorInput) => void;
  prefill?: QuizPrefill;
}

function getCommuneOptions(region: Region) {
  const zones = solarZones
    .filter((z) => z.region === region)
    .sort((a, b) => b.solarScore - a.solarScore);
  return zones.map((z) => ({
    value: z.name,
    label: `${z.name} · ${z.solarScore}/100`,
  }));
}

function getZoneForCommune(region: Region, commune: string) {
  return solarZones.find(
    (z) => z.region === region && z.name.toLowerCase() === commune.toLowerCase()
  );
}

export function SimulatorForm({ onResult, prefill }: Props) {
  const [region, setRegion] = useState<Region>(prefill?.region ?? "V");
  const [commune, setCommune] = useState(prefill?.commune ?? "Casablanca");
  const [propertyType, setPropertyType] = useState<PropertyType>(prefill?.propertyType ?? "hogar");
  const [monthlyBill, setMonthlyBill] = useState(prefill?.monthlyBill ?? 100000);
  const [people, setPeople] = useState(4);
  const [hasPool, setHasPool] = useState(prefill?.hasPool ?? false);
  const [hasWaterPump, setHasWaterPump] = useState(prefill?.hasWaterPump ?? false);
  const [workFromHome, setWorkFromHome] = useState(prefill?.workFromHome ?? false);
  const [nightConsumption, setNightConsumption] = useState<NightConsumption>(prefill?.nightConsumption ?? "medio");
  const [priority, setPriority] = useState<Priority>(prefill?.priority ?? "ahorro");
  const [resilience, setResilience] = useState(false);

  useEffect(() => {
    if (prefill) {
      if (prefill.region) setRegion(prefill.region);
      if (prefill.commune) setCommune(prefill.commune);
      if (prefill.propertyType) setPropertyType(prefill.propertyType);
      if (prefill.monthlyBill) setMonthlyBill(prefill.monthlyBill);
      if (prefill.priority) setPriority(prefill.priority);
      if (prefill.nightConsumption) setNightConsumption(prefill.nightConsumption);
      if (prefill.hasPool !== undefined) setHasPool(prefill.hasPool);
      if (prefill.hasWaterPump !== undefined) setHasWaterPump(prefill.hasWaterPump);
      if (prefill.workFromHome !== undefined) setWorkFromHome(prefill.workFromHome);
    }
  }, [prefill]);

  const handleRegionChange = (r: Region) => {
    setRegion(r);
    const opts = getCommuneOptions(r);
    setCommune(opts[0]?.value ?? "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResult({ region, commune, propertyType, monthlyBill, people, hasPool, hasWaterPump, workFromHome, nightConsumption, priority, resilience });
  };

  const communeOptions = getCommuneOptions(region);
  const selectedZone = getZoneForCommune(region, commune);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location */}
      <div>
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">📍 Ubicación</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Región"
            value={region}
            onChange={(e) => handleRegionChange(e.target.value as Region)}
            options={[
              { value: "V", label: "V Región — Valparaíso" },
              { value: "VI", label: "VI Región — O'Higgins" },
              { value: "RM", label: "Región Metropolitana" },
            ]}
          />
          <Select
            label="Comuna"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            options={communeOptions}
          />
        </div>

        {/* Zone opportunity card */}
        {selectedZone && (
          <motion.div
            key={selectedZone.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 p-3.5 rounded-xl border text-sm ${
              selectedZone.opportunity === "alta"
                ? "bg-green-500/5 border-green-500/20"
                : selectedZone.opportunity === "media"
                ? "bg-amber-500/5 border-amber-500/20"
                : "bg-slate-800/40 border-slate-700/50"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-white">{selectedZone.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  selectedZone.opportunity === "alta"
                    ? "bg-green-500/20 text-green-400"
                    : selectedZone.opportunity === "media"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-slate-700/60 text-slate-400"
                }`}>
                  {selectedZone.solarScore}/100
                </span>
                <span className="text-xs text-slate-500">{selectedZone.profileLabel}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedZone.narrative}
            </p>
            {selectedZone.opportunity === "exploratoria" && (
              <p className="text-xs text-slate-500 mt-1.5 italic">
                Zona en etapa exploratoria. Estimaciones indicativas — recomendamos evaluación en terreno.
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Property */}
      <div>
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">🏠 Tipo de propiedad</h3>
        <Select
          label="Tipo"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value as PropertyType)}
          options={[
            { value: "hogar", label: "Casa / Departamento" },
            { value: "parcela", label: "Parcela / Fundo" },
            { value: "pyme", label: "PyME / Oficina" },
            { value: "negocio", label: "Negocio / Comercio" },
            { value: "turismo", label: "Turismo / Cabañas" },
            { value: "agricola", label: "Agrícola" },
          ]}
        />
      </div>

      {/* Consumption */}
      <div>
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">⚡ Consumo</h3>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-medium text-slate-300">Cuenta eléctrica mensual</label>
              <span className="text-amber-400 font-bold text-base">{formatCLP(monthlyBill)}</span>
            </div>
            <input
              type="range"
              min={30000}
              max={800000}
              step={5000}
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 rounded-full bg-slate-700 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1.5">
              <span>$30.000</span>
              <span>$800.000+</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-medium text-slate-300">Personas en el hogar / equipo</label>
              <span className="text-amber-400 font-bold">{people}</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 rounded-full bg-slate-700 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Habits */}
      <div>
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">🔌 Hábitos y equipos</h3>
        <div className="space-y-2.5">
          {[
            { key: "hasPool", label: "🏊 Tiene piscina", desc: "Bomba de piscina activa en horario solar", state: hasPool, set: setHasPool },
            { key: "hasWaterPump", label: "💧 Bomba de agua / riego", desc: "Sistema de riego o bomba (consumo diurno)", state: hasWaterPump, set: setHasWaterPump },
            { key: "workFromHome", label: "💻 Teletrabaja desde casa", desc: "Equipos encendidos de día (mejora autoconsumo)", state: workFromHome, set: setWorkFromHome },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => item.set(!item.state)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm ${
                item.state
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              }`}
            >
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-slate-600 mt-0.5">{item.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${item.state ? "bg-amber-400 border-amber-400" : "border-slate-600"}`}>
                {item.state && <div className="w-2 h-2 rounded-full bg-slate-900" />}
              </div>
            </button>
          ))}

          <Select
            label="Consumo nocturno estimado"
            value={nightConsumption}
            onChange={(e) => setNightConsumption(e.target.value as NightConsumption)}
            options={[
              { value: "bajo", label: "Bajo — poco uso nocturno" },
              { value: "medio", label: "Medio — uso normal de noche" },
              { value: "alto", label: "Alto — mucho uso nocturno (reduce cobertura)" },
            ]}
          />
        </div>
      </div>

      {/* Priority */}
      <div>
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">🎯 Prioridad</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "ahorro", label: "💰 Máximo ahorro", desc: "Reducir cuenta mensual" },
            { value: "respaldo", label: "🔋 Respaldo", desc: "Cero cortes eléctricos" },
            { value: "independencia", label: "⚡ Independencia", desc: "Salir de la red" },
            { value: "plusvalia", label: "🏠 Plusvalía", desc: "Valorizar propiedad" },
          ].map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value as Priority)}
              className={`p-3 rounded-xl border text-left transition-all ${
                priority === p.value
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600"
              }`}
            >
              <div className="text-sm font-medium">{p.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Resilience mode — prominent */}
      <div>
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">🛡️ Modo resiliencia</h3>
        <button
          type="button"
          onClick={() => setResilience(!resilience)}
          className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border transition-all text-sm ${
            resilience
              ? "bg-blue-500/10 border-blue-500/40 text-blue-300"
              : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
          }`}
        >
          <div className="text-left">
            <div className="font-semibold text-base">Dimensionar con batería de respaldo</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Incluye batería en todos los escenarios para continuidad ante cortes. Recomendado para zonas con cortes frecuentes.
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${resilience ? "bg-blue-400 border-blue-400" : "border-slate-600"}`}>
            {resilience && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
          </div>
        </button>
      </div>

      <Button type="submit" size="lg" className="w-full text-base py-4 rounded-2xl">
        ☀️ Calcular mi escenario energético
      </Button>

      <p className="text-center text-xs text-slate-600">
        Estimación de referencia — no constituye oferta comercial
      </p>
    </form>
  );
}
