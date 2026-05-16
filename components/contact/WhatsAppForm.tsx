"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarZones } from "@/lib/data/mock-zones";
import { useCompanyConfig } from "@/lib/hooks/useCompanyConfig";

interface PreFillData {
  name?: string;
  commune?: string;
  region?: string;
  propertyType?: string;
  monthlyBill?: number;
  priority?: string;
  profile?: string;
  solarScore?: number;
  estimatedSaving?: number;
  scenario?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  prefill?: PreFillData;
}

const COMMUNES_ALL = solarZones.map((z) => ({ name: z.name, region: z.region })).sort((a, b) => a.name.localeCompare(b.name));

function sanitizeForWA(text: string): string {
  // strip control characters and limit length
  return text.replace(/[\x00-\x1F\x7F]/g, " ").slice(0, 500).trim();
}

function getRegionFromCommune(commune: string): string {
  const zone = solarZones.find((z) => z.name === commune);
  if (!zone) return "V";
  const labels: Record<string, string> = { V: "V Región — Valparaíso", RM: "Región Metropolitana", VI: "VI Región — O'Higgins" };
  return labels[zone.region] ?? zone.region;
}

export function WhatsAppForm({ isOpen, onClose, prefill }: Props) {
  const [config] = useCompanyConfig();
  const [name, setName] = useState(prefill?.name ?? "");
  const [commune, setCommune] = useState(prefill?.commune ?? "");
  const [propertyType, setPropertyType] = useState(prefill?.propertyType ?? "");
  const [billRange, setBillRange] = useState("");
  const [energyPriority, setEnergyPriority] = useState(prefill?.priority ?? "");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefill?.commune) setCommune(prefill.commune);
    if (prefill?.name) setName(prefill.name);
    if (prefill?.propertyType) setPropertyType(prefill.propertyType);
    if (prefill?.priority) setEnergyPriority(prefill.priority);
    if (prefill?.monthlyBill) {
      const b = prefill.monthlyBill;
      if (b < 50000) setBillRange("Menos de $50.000");
      else if (b < 100000) setBillRange("$50.000 – $100.000");
      else if (b < 200000) setBillRange("$100.000 – $200.000");
      else if (b < 500000) setBillRange("$200.000 – $500.000");
      else setBillRange("Más de $500.000");
    }
  }, [prefill]);

  const regionLabel = commune ? getRegionFromCommune(commune) : "";

  const buildMessage = (): string => {
    const safeName = sanitizeForWA(name || "un cliente interesado");
    const safeCommune = sanitizeForWA(commune);
    const safeRegion = sanitizeForWA(regionLabel);
    const safeType = sanitizeForWA(propertyType);
    const safeBill = sanitizeForWA(billRange);
    const safePriority = sanitizeForWA(energyPriority);
    const safeProfile = prefill?.profile ? sanitizeForWA(prefill.profile) : "";
    const safeScore = prefill?.solarScore ? String(prefill.solarScore) : "";
    const safeSaving = prefill?.estimatedSaving
      ? new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(prefill.estimatedSaving)
      : "";
    const safeScenario = prefill?.scenario ? sanitizeForWA(prefill.scenario) : "";
    const safeContact = contact ? sanitizeForWA(contact) : "";
    const safeComment = comment ? sanitizeForWA(comment) : "";

    let msg = `Hola Solergy, soy ${safeName}.\nMe interesa una evaluación solar para mi propiedad.\n\nMis datos:`;
    if (safeCommune) msg += `\n• Comuna: ${safeCommune}${safeRegion ? `, ${safeRegion}` : ""}`;
    if (safeType) msg += `\n• Tipo de propiedad: ${safeType}`;
    if (safeBill) msg += `\n• Cuenta mensual: ${safeBill}`;
    if (safePriority) msg += `\n• Prioridad energética: ${safePriority}`;
    if (safeProfile) msg += `\n• Perfil estimado: ${safeProfile}`;
    if (safeScore) msg += `\n• Score de oportunidad solar: ${safeScore}/100`;
    if (safeSaving) msg += `\n• Ahorro mensual estimado: ${safeSaving}`;
    if (safeScenario) msg += `\n• Escenario recomendado: ${safeScenario}`;
    if (safeContact) msg += `\n• Contacto: ${safeContact}`;
    if (safeComment) msg += `\n\n${safeComment}`;
    msg += `\n\nQuedo atento/a a su orientación.`;
    return msg;
  };

  const handleSendWA = () => {
    const msg = buildMessage();
    const url = `https://wa.me/${config.waNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silently
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto bg-slate-900 border border-slate-700/60 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Consulta por WhatsApp</h2>
                <p className="text-slate-500 text-xs mt-0.5">Completa tus datos para un mensaje personalizado</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Tu nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre completo"
                  maxLength={100}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Comuna</label>
                <select
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all appearance-none"
                >
                  <option value="" className="bg-slate-900">Selecciona tu comuna...</option>
                  {COMMUNES_ALL.map((c) => (
                    <option key={c.name} value={c.name} className="bg-slate-900">{c.name}</option>
                  ))}
                </select>
                {regionLabel && (
                  <p className="text-xs text-slate-600 mt-1">{regionLabel}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Tipo de propiedad</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all appearance-none"
                >
                  <option value="" className="bg-slate-900">Selecciona...</option>
                  <option value="Casa / Departamento" className="bg-slate-900">Casa / Departamento</option>
                  <option value="Parcela / Fundo" className="bg-slate-900">Parcela / Fundo</option>
                  <option value="PyME / Oficina" className="bg-slate-900">PyME / Oficina</option>
                  <option value="Negocio / Comercio" className="bg-slate-900">Negocio / Comercio</option>
                  <option value="Turismo / Cabañas" className="bg-slate-900">Turismo / Cabañas</option>
                  <option value="Agrícola" className="bg-slate-900">Agrícola</option>
                  <option value="Bodega / Logística" className="bg-slate-900">Bodega / Logística</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Cuenta mensual aproximada</label>
                <select
                  value={billRange}
                  onChange={(e) => setBillRange(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all appearance-none"
                >
                  <option value="" className="bg-slate-900">Selecciona rango...</option>
                  <option value="Menos de $50.000" className="bg-slate-900">Menos de $50.000</option>
                  <option value="$50.000 – $100.000" className="bg-slate-900">$50.000 – $100.000</option>
                  <option value="$100.000 – $200.000" className="bg-slate-900">$100.000 – $200.000</option>
                  <option value="$200.000 – $500.000" className="bg-slate-900">$200.000 – $500.000</option>
                  <option value="Más de $500.000" className="bg-slate-900">Más de $500.000</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Prioridad energética</label>
                <select
                  value={energyPriority}
                  onChange={(e) => setEnergyPriority(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all appearance-none"
                >
                  <option value="" className="bg-slate-900">Selecciona tu prioridad...</option>
                  <option value="Reducir cuenta eléctrica" className="bg-slate-900">Reducir cuenta eléctrica</option>
                  <option value="Eliminar cortes eléctricos" className="bg-slate-900">Eliminar cortes eléctricos</option>
                  <option value="Independencia energética" className="bg-slate-900">Independencia energética</option>
                  <option value="Retorno de inversión" className="bg-slate-900">Retorno de inversión</option>
                  <option value="Continuidad operacional" className="bg-slate-900">Continuidad operacional</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Teléfono o correo (opcional)</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+56 9 XXXX XXXX o correo@ejemplo.cl"
                  maxLength={100}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Comentario adicional (opcional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cuéntanos más sobre tu situación..."
                  rows={3}
                  maxLength={300}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                type="button"
                onClick={handleSendWA}
                className="w-full py-3.5 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all"
              >
                💬 Abrir WhatsApp con mi consulta
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 font-medium text-sm transition-all"
              >
                {copied ? "✓ Copiado al portapapeles" : "📋 Copiar resumen"}
              </button>
            </div>

            <p className="text-xs text-slate-600 text-center mt-4">
              {config.whatsapp} · {config.email}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
