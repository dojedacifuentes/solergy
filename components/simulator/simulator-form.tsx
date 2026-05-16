"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { SimulatorInput, Region, PropertyType, Priority, NightConsumption } from "@/types";

const COMMUNES: Record<Region, { value: string; label: string }[]> = {
  V: [
    { value: "limache", label: "Limache" },
    { value: "olmue", label: "Olmué" },
    { value: "casablanca", label: "Casablanca" },
    { value: "algarrobo", label: "Algarrobo" },
    { value: "vina_del_mar", label: "Viña del Mar" },
    { value: "quilpue", label: "Quilpué" },
    { value: "santo_domingo", label: "Santo Domingo" },
  ],
  VI: [
    { value: "rancagua", label: "Rancagua" },
    { value: "machali", label: "Machalí" },
    { value: "requinoa", label: "Requínoa" },
    { value: "graneros", label: "Graneros" },
  ],
  RM: [
    { value: "maipu", label: "Maipú" },
    { value: "chicureo", label: "Chicureo" },
    { value: "colina", label: "Colina" },
    { value: "lampa", label: "Lampa" },
    { value: "buin", label: "Buín" },
    { value: "peñaflor", label: "Peñaflor" },
    { value: "talagante", label: "Talagante" },
  ],
};

interface Props {
  onResult: (input: SimulatorInput) => void;
}

export function SimulatorForm({ onResult }: Props) {
  const [region, setRegion] = useState<Region>("V");
  const [commune, setCommune] = useState("limache");
  const [propertyType, setPropertyType] = useState<PropertyType>("hogar");
  const [monthlyBill, setMonthlyBill] = useState(100000);
  const [people, setPeople] = useState(4);
  const [hasPool, setHasPool] = useState(false);
  const [hasWaterPump, setHasWaterPump] = useState(false);
  const [workFromHome, setWorkFromHome] = useState(false);
  const [nightConsumption, setNightConsumption] = useState<NightConsumption>("medio");
  const [priority, setPriority] = useState<Priority>("ahorro");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResult({ region, commune, propertyType, monthlyBill, people, hasPool, hasWaterPump, workFromHome, nightConsumption, priority });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Location */}
      <div>
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4">📍 Ubicación</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Región"
            value={region}
            onChange={(e) => {
              const r = e.target.value as Region;
              setRegion(r);
              setCommune(COMMUNES[r][0].value);
            }}
            options={[
              { value: "V", label: "V Región" },
              { value: "VI", label: "VI Región" },
              { value: "RM", label: "Región Metropolitana" },
            ]}
          />
          <Select
            label="Comuna"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            options={COMMUNES[region]}
          />
        </div>
      </div>

      {/* Section 2: Property */}
      <div>
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4">🏠 Tu propiedad</h3>
        <Select
          label="Tipo de propiedad"
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

      {/* Section 3: Consumption */}
      <div>
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4">⚡ Consumo</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Cuenta eléctrica mensual
              <span className="ml-2 text-amber-400 font-bold">
                ${monthlyBill.toLocaleString("es-CL")}
              </span>
            </label>
            <input
              type="range"
              min={30000}
              max={800000}
              step={5000}
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 rounded-full bg-slate-700 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>$30.000</span>
              <span>$800.000+</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Personas en el hogar: <span className="text-amber-400 font-bold">{people}</span>
            </label>
            <input
              type="range"
              min={1}
              max={12}
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 rounded-full bg-slate-700 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Habits */}
      <div>
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4">🔌 Hábitos y equipos</h3>
        <div className="space-y-3">
          {[
            { key: "hasPool", label: "🏊 Tiene piscina", state: hasPool, set: setHasPool },
            { key: "hasWaterPump", label: "💧 Bomba de agua / riego", state: hasWaterPump, set: setHasWaterPump },
            { key: "workFromHome", label: "💻 Teletrabaja desde casa", state: workFromHome, set: setWorkFromHome },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => item.set(!item.state)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                item.state
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
              }`}
            >
              <span>{item.label}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${item.state ? "bg-amber-400 border-amber-400" : "border-slate-600"}`}>
                {item.state && <div className="w-2 h-2 rounded-full bg-slate-900" />}
              </div>
            </button>
          ))}

          <Select
            label="Consumo nocturno"
            value={nightConsumption}
            onChange={(e) => setNightConsumption(e.target.value as NightConsumption)}
            options={[
              { value: "bajo", label: "Bajo — duermo temprano, poco uso nocturno" },
              { value: "medio", label: "Medio — uso normal de noche" },
              { value: "alto", label: "Alto — trabajo de noche, mucho uso nocturno" },
            ]}
          />
        </div>
      </div>

      {/* Section 5: Priority */}
      <div>
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4">🎯 Prioridad</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "ahorro", label: "💰 Máximo ahorro", desc: "Reducir cuenta" },
            { value: "respaldo", label: "🔋 Respaldo", desc: "Cero cortes" },
            { value: "independencia", label: "⚡ Independencia", desc: "Salir de la red" },
            { value: "plusvalia", label: "🏠 Plusvalía", desc: "Valorizar propiedad" },
          ].map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value as Priority)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
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

      <Button type="submit" size="lg" className="w-full text-base py-4 rounded-2xl">
        ☀️ Calcular mi escenario
      </Button>
    </form>
  );
}
