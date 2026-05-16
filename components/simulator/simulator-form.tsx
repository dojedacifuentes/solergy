"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { SimulatorInput, Region, PropertyType, Priority, NightConsumption } from "@/types";
import { solarZones } from "@/lib/data/mock-zones";

function getCommuneOptions(region: Region) {
  const zones = solarZones
    .filter((z) => z.region === region)
    .sort((a, b) => b.solarScore - a.solarScore);
  return zones.map((z) => ({ value: z.name, label: z.name }));
}

interface Props {
  onResult: (input: SimulatorInput) => void;
}

export function SimulatorForm({ onResult }: Props) {
  const [region, setRegion] = useState<Region>("V");
  const [commune, setCommune] = useState("Casablanca");
  const [propertyType, setPropertyType] = useState<PropertyType>("hogar");
  const [monthlyBill, setMonthlyBill] = useState(100000);
  const [people, setPeople] = useState(4);
  const [hasPool, setHasPool] = useState(false);
  const [hasWaterPump, setHasWaterPump] = useState(false);
  const [workFromHome, setWorkFromHome] = useState(false);
  const [nightConsumption, setNightConsumption] = useState<NightConsumption>("medio");
  const [priority, setPriority] = useState<Priority>("ahorro");
  const [resilience, setResilience] = useState(false);

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
              <span className="text-amber-400 font-bold text-base">${monthlyBill.toLocaleString("es-CL")}</span>
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
              <label className="text-sm font-medium text-slate-300">Personas en el hogar</label>
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
            { key: "hasPool", label: "🏊 Tiene piscina", desc: "Bomba de piscina activa", state: hasPool, set: setHasPool },
            { key: "hasWaterPump", label: "💧 Bomba de agua / riego", desc: "Sistema de riego o bomba", state: hasWaterPump, set: setHasWaterPump },
            { key: "workFromHome", label: "💻 Teletrabaja desde casa", desc: "Equipos encendidos de día", state: workFromHome, set: setWorkFromHome },
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
            label="Consumo nocturno"
            value={nightConsumption}
            onChange={(e) => setNightConsumption(e.target.value as NightConsumption)}
            options={[
              { value: "bajo", label: "Bajo — poco uso nocturno" },
              { value: "medio", label: "Medio — uso normal de noche" },
              { value: "alto", label: "Alto — mucho uso nocturno" },
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

      {/* Resilience mode */}
      <div>
        <button
          type="button"
          onClick={() => setResilience(!resilience)}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-sm ${
            resilience
              ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
              : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
          }`}
        >
          <div className="text-left">
            <div className="font-medium">🛡️ Modo resiliencia</div>
            <div className="text-xs text-slate-500 mt-0.5">Dimensionar con batería de respaldo en todos los escenarios</div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${resilience ? "bg-blue-400 border-blue-400" : "border-slate-600"}`}>
            {resilience && <div className="w-2 h-2 rounded-full bg-slate-900" />}
          </div>
        </button>
      </div>

      <Button type="submit" size="lg" className="w-full text-base py-4 rounded-2xl">
        ☀️ Calcular mi escenario energético
      </Button>
    </form>
  );
}
