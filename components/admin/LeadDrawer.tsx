"use client";
import { useState, useEffect } from "react";
import {
  type AdminLead,
  type LeadStatus,
  useLeads,
} from "@/lib/hooks/useLeads";
import { useCompanyConfig } from "@/lib/hooks/useCompanyConfig";
import { solarZones } from "@/lib/data/mock-zones";
import { WA_TEMPLATES, fillTemplate, normalizeChileanPhone } from "@/lib/wa-templates";
import { formatCLP } from "@/lib/utils";
import { X, Copy, RefreshCw, Phone, MessageCircle, Trash2 } from "lucide-react";
import { STATUS_CONFIG } from "./LeadTable";

type DrawerTab = "resumen" | "notas" | "cotizacion" | "whatsapp" | "seguimiento";

const DRAWER_TABS: { id: DrawerTab; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "notas", label: "Notas" },
  { id: "cotizacion", label: "Cotización" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "seguimiento", label: "Seguimiento" },
];

interface SummaryModalProps {
  lead: AdminLead;
  config: { whatsapp: string; email: string; companyName: string };
  onClose: () => void;
}

function SummaryModal({ lead, config, onClose }: SummaryModalProps) {
  const annualSaving = lead.estimatedAnnualSaving ?? (lead.estimatedSaving ? lead.estimatedSaving * 12 : 0);
  const projectVal = lead.quotation?.projectValue ?? lead.projectValue ?? 0;

  const text = `Resumen preliminar Solergy
──────────────────────────
Cliente: ${lead.name}
Comuna: ${lead.commune}${lead.region ? `, ${lead.region}` : ""}
Tipo de propiedad: ${lead.propertyType}
Cuenta mensual aproximada: ${formatCLP(lead.monthlyBill)}
Prioridad energética: ${lead.priority}
Perfil energético: ${lead.profileLabel ?? "–"}
Score comercial preliminar: ${lead.score !== undefined ? `${lead.score}/100` : "–"}

Ahorro estimado mensual: ${lead.estimatedSaving ? formatCLP(lead.estimatedSaving) : "–"}
Ahorro estimado anual: ${annualSaving > 0 ? formatCLP(annualSaving) : "–"}
Sistema sugerido: ${lead.kit ?? "Por definir"}
Retorno referencial: ${lead.roiEstimate ?? "4–6 años"}
Valor estimado proyecto: ${projectVal > 0 ? formatCLP(projectVal) : "–"}

Próxima acción: ${lead.nextAction ?? "Solicitar boleta eléctrica y coordinar evaluación técnica."}

──────────────────────────
${config.companyName} · Independencia Energética Inteligente
${config.whatsapp} · ${config.email}
Valores referenciales. Requieren evaluación técnica.`;

  const [editedText, setEditedText] = useState(text);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWA = () => {
    if (!lead.phone) return;
    const num = normalizeChileanPhone(lead.phone);
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(editedText)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-2xl p-6 flex flex-col gap-4 max-h-[90vh]">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Resumen del cliente</h3>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          rows={18}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none overflow-y-auto"
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-all"
          >
            <Copy className="w-4 h-4" />
            {copied ? "¡Copiado!" : "Copiar resumen"}
          </button>
          {lead.phone && (
            <button
              type="button"
              onClick={handleWA}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 text-sm font-medium transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Resumen Tab ----
function ResumenTab({
  lead,
  onAutoScore,
  onShowSummary,
}: {
  lead: AdminLead;
  onAutoScore: () => void;
  onShowSummary: () => void;
}) {
  const [scoring, setScoring] = useState(false);
  const zone = solarZones.find((z) => z.name.toLowerCase() === lead.commune.toLowerCase());
  const annualSaving = lead.estimatedAnnualSaving ?? (lead.estimatedSaving ? lead.estimatedSaving * 12 : 0);

  const handleScore = async () => {
    setScoring(true);
    onAutoScore();
    setTimeout(() => setScoring(false), 600);
  };

  return (
    <div className="space-y-4">
      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Comuna", value: lead.commune },
          { label: "Región", value: lead.region },
          { label: "Tipo de propiedad", value: lead.propertyType },
          { label: "Cuenta mensual", value: formatCLP(lead.monthlyBill) },
          { label: "Prioridad energética", value: lead.priority },
          { label: "Fuente", value: lead.source ?? "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-800/40 rounded-xl p-3">
            <span className="text-xs text-slate-500 block mb-0.5">{label}</span>
            <span className="text-sm text-white capitalize">{value}</span>
          </div>
        ))}
      </div>

      {/* Score */}
      <div className="bg-slate-800/40 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">Score comercial</span>
          <button
            type="button"
            onClick={handleScore}
            disabled={scoring}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${scoring ? "animate-spin" : ""}`} />
            Calcular
          </button>
        </div>
        {lead.score !== undefined && lead.score !== null ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-2xl font-bold ${lead.score >= 70 ? "text-green-400" : lead.score >= 50 ? "text-amber-400" : "text-slate-400"}`}>
                {lead.score}
              </span>
              <span className="text-slate-500 text-sm">/100</span>
              {lead.profileLabel && (
                <span className="ml-auto text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  {lead.profileLabel}
                </span>
              )}
            </div>
            {lead.scoreBreakdown && (
              <div className="space-y-1.5">
                {(Object.entries(lead.scoreBreakdown) as [string, number][]).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-28 capitalize">{k}</span>
                    <div className="flex-1 bg-slate-700/50 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-amber-500"
                        style={{ width: `${Math.min(100, (v / 30) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-4 text-right">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-slate-500 text-xs">Sin score. Haz clic en &quot;Calcular&quot;.</p>
        )}
      </div>

      {/* Financial */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/40 rounded-xl p-3">
          <span className="text-xs text-slate-500 block mb-0.5">Ahorro mensual est.</span>
          <span className="text-sm font-semibold text-green-400">
            {lead.estimatedSaving ? formatCLP(lead.estimatedSaving) : "—"}
          </span>
        </div>
        <div className="bg-slate-800/40 rounded-xl p-3">
          <span className="text-xs text-slate-500 block mb-0.5">Ahorro anual est.</span>
          <span className="text-sm font-semibold text-green-400">
            {annualSaving > 0 ? formatCLP(annualSaving) : "—"}
          </span>
        </div>
        <div className="bg-slate-800/40 rounded-xl p-3">
          <span className="text-xs text-slate-500 block mb-0.5">ROI referencial</span>
          <span className="text-sm text-white">{lead.roiEstimate ?? "4–6 años"}</span>
        </div>
        <div className="bg-slate-800/40 rounded-xl p-3">
          <span className="text-xs text-slate-500 block mb-0.5">Kit sugerido</span>
          <span className="text-sm text-white">{lead.kit ?? "—"}</span>
        </div>
      </div>

      {/* Zone card */}
      {zone && (
        <div className="bg-slate-800/40 rounded-xl p-3 border border-amber-500/10">
          <span className="text-xs text-amber-400 font-medium block mb-1">Zona solar: {zone.name}</span>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-slate-400">Score solar: <span className="text-amber-400 font-semibold">{zone.solarScore}/100</span></span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              zone.opportunity === "alta" ? "bg-green-500/20 text-green-300 border-green-500/30" :
              zone.opportunity === "media" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
              "bg-slate-600/20 text-slate-400 border-slate-600/30"
            }`}>
              Oportunidad {zone.opportunity}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{zone.narrative.slice(0, 120)}...</p>
        </div>
      )}

      {/* Actions */}
      <button
        type="button"
        onClick={onShowSummary}
        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-all"
      >
        Generar resumen del cliente
      </button>
    </div>
  );
}

// ---- Notas Tab ----
function NotasTab({
  lead,
  onAddNote,
  onDeleteNote,
}: {
  lead: AdminLead;
  onAddNote: (text: string) => void;
  onDeleteNote: (noteId: string) => void;
}) {
  const [noteText, setNoteText] = useState("");

  const handleSave = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setNoteText("");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-CL") + " " + d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  };

  const notes = lead.notesHistory ?? [];
  const hasLegacy = lead.notes && notes.length === 0;

  return (
    <div className="flex flex-col gap-4 h-full">
      {notes.length === 0 && !hasLegacy && (
        <div className="py-8 text-center text-slate-500 text-sm">
          Sin notas. Agrega la primera nota sobre este cliente.
        </div>
      )}

      {hasLegacy && (
        <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Nota heredada</span>
          </div>
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{lead.notes}</p>
        </div>
      )}

      {notes.map((n) => (
        <div key={n.id} className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-slate-300 flex-1 whitespace-pre-wrap">{n.text}</p>
            <button
              type="button"
              onClick={() => onDeleteNote(n.id)}
              className="shrink-0 p-1 rounded hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-1.5">{formatDate(n.createdAt)}</p>
        </div>
      ))}

      {/* Add note */}
      <div className="mt-auto pt-3 border-t border-slate-800/60">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={3}
          placeholder="Escribe una nota..."
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none mb-2"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={!noteText.trim()}
          className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guardar nota
        </button>
      </div>
    </div>
  );
}

// ---- Cotizacion Tab ----
function CotizacionTab({
  lead,
  onSave,
}: {
  lead: AdminLead;
  onSave: (q: AdminLead["quotation"]) => void;
}) {
  const [form, setForm] = useState<NonNullable<AdminLead["quotation"]>>({
    proposalName: lead.quotation?.proposalName ?? `Propuesta ${lead.name}`,
    kitName: lead.quotation?.kitName ?? (lead.kit ?? ""),
    panelCount: lead.quotation?.panelCount ?? Math.ceil(lead.monthlyBill / 30000),
    batteryCount: lead.quotation?.batteryCount ?? 1,
    inverterType: lead.quotation?.inverterType ?? "Inversor string monofásico",
    projectValue: lead.quotation?.projectValue ?? (lead.projectValue ?? 0),
    paymentMethod: lead.quotation?.paymentMethod ?? "Contado",
    advanceAmount: lead.quotation?.advanceAmount ?? 0,
    balanceAmount: lead.quotation?.balanceAmount ?? 0,
    proposalValidity: lead.quotation?.proposalValidity ?? "30 días",
    observations: lead.quotation?.observations ?? "",
    conditions: lead.quotation?.conditions ?? "",
    warranty: lead.quotation?.warranty ?? "25 años paneles, 10 años inversor, 5 años batería",
    estimatedInstallTime: lead.quotation?.estimatedInstallTime ?? "2–3 semanas",
  });

  const [saved, setSaved] = useState(false);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Nombre propuesta</label>
          <input type="text" value={form.proposalName ?? ""} onChange={(e) => set("proposalName", e.target.value)} className={inp} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Kit recomendado</label>
          <input type="text" value={form.kitName ?? ""} onChange={(e) => set("kitName", e.target.value)} className={inp} />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Paneles</label>
          <input type="number" value={form.panelCount ?? 0} onChange={(e) => set("panelCount", Number(e.target.value))} className={inp} />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Baterías</label>
          <input type="number" value={form.batteryCount ?? 0} onChange={(e) => set("batteryCount", Number(e.target.value))} className={inp} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Tipo inversor</label>
          <input type="text" value={form.inverterType ?? ""} onChange={(e) => set("inverterType", e.target.value)} className={inp} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Valor proyecto ($)</label>
          <input type="number" value={form.projectValue ?? 0} onChange={(e) => set("projectValue", Number(e.target.value))} className={inp} />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Modalidad de pago</label>
          <select value={form.paymentMethod ?? "Contado"} onChange={(e) => set("paymentMethod", e.target.value)} className={inp + " appearance-none"}>
            <option className="bg-slate-900">Contado</option>
            <option className="bg-slate-900">Crédito</option>
            <option className="bg-slate-900">Leasing</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Vigencia propuesta</label>
          <input type="text" value={form.proposalValidity ?? ""} onChange={(e) => set("proposalValidity", e.target.value)} className={inp} />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Anticipo ($)</label>
          <input type="number" value={form.advanceAmount ?? 0} onChange={(e) => set("advanceAmount", Number(e.target.value))} className={inp} />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Saldo ($)</label>
          <input type="number" value={form.balanceAmount ?? 0} onChange={(e) => set("balanceAmount", Number(e.target.value))} className={inp} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Plazo instalación</label>
          <input type="text" value={form.estimatedInstallTime ?? ""} onChange={(e) => set("estimatedInstallTime", e.target.value)} className={inp} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Garantía</label>
          <input type="text" value={form.warranty ?? ""} onChange={(e) => set("warranty", e.target.value)} className={inp} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Observaciones</label>
          <textarea value={form.observations ?? ""} onChange={(e) => set("observations", e.target.value)} rows={2} className={inp + " resize-none"} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Condiciones</label>
          <textarea value={form.conditions ?? ""} onChange={(e) => set("conditions", e.target.value)} rows={2} className={inp + " resize-none"} />
        </div>
      </div>

      <p className="text-xs text-slate-600 italic">Los valores son referencias. La propuesta definitiva requiere evaluación técnica.</p>

      <button
        type="button"
        onClick={handleSave}
        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-all"
      >
        {saved ? "✓ Cotización guardada" : "Guardar cotización"}
      </button>
    </div>
  );
}

// ---- WhatsApp Tab ----
function WhatsAppTab({ lead, onUpdatePhone }: { lead: AdminLead; onUpdatePhone: (phone: string) => void }) {
  const [phone, setPhone] = useState(lead.phone ?? "");
  const [templateId, setTemplateId] = useState(WA_TEMPLATES[0].id);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const template = WA_TEMPLATES.find((t) => t.id === templateId) ?? WA_TEMPLATES[0];
  const normalized = phone ? normalizeChileanPhone(phone) : "";

  const vars: Record<string, string> = {
    nombre: lead.name,
    comuna: lead.commune,
    tipoPropiedad: lead.propertyType,
    cuentaMensual: formatCLP(lead.monthlyBill),
    ahorroEstimado: lead.estimatedSaving ? String(lead.estimatedSaving) : "–",
    score: lead.score !== undefined ? String(lead.score) : "–",
    kitSugerido: lead.kit ?? "–",
    valorProyecto: lead.quotation?.projectValue
      ? String(lead.quotation.projectValue)
      : (lead.projectValue ? String(lead.projectValue) : "–"),
    region: lead.region,
  };

  useEffect(() => {
    setMessage(fillTemplate(template, vars));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, lead.name, lead.commune, lead.propertyType, lead.estimatedSaving, lead.score, lead.kit]);

  const handlePhoneBlur = () => {
    if (phone !== lead.phone) onUpdatePhone(phone);
  };

  const handleOpenWA = () => {
    if (!normalized) return;
    window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Phone */}
      <div>
        <label className="text-xs text-slate-400 block mb-1.5 flex items-center gap-1.5">
          <Phone className="w-3 h-3" /> Número de teléfono
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={handlePhoneBlur}
          placeholder="+56 9 XXXX XXXX"
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        />
        {phone && (
          <p className="text-xs text-slate-500 mt-1">
            Normalizado: <span className="text-amber-400 font-mono">{normalized}</span>
          </p>
        )}
        {!phone && (
          <p className="text-xs text-amber-400 mt-1">
            Agrega un número de teléfono para enviar por WhatsApp.
          </p>
        )}
      </div>

      {/* Template selector */}
      <div>
        <label className="text-xs text-slate-400 block mb-1.5">Plantilla de mensaje</label>
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none"
        >
          {WA_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id} className="bg-slate-900">{t.name}</option>
          ))}
        </select>
      </div>

      {/* Preview */}
      <div>
        <label className="text-xs text-slate-400 block mb-1.5">Vista previa (editable)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleOpenWA}
          disabled={!normalized}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <MessageCircle className="w-4 h-4" />
          Abrir WhatsApp
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-all"
        >
          <Copy className="w-4 h-4" />
          {copied ? "¡Copiado!" : "Copiar mensaje"}
        </button>
      </div>
    </div>
  );
}

// ---- Seguimiento Tab ----
function SeguimientoTab({
  lead,
  onSave,
}: {
  lead: AdminLead;
  onSave: (data: Partial<AdminLead>) => void;
}) {
  const [nextAction, setNextAction] = useState(lead.nextAction ?? "");
  const [followUpDate, setFollowUpDate] = useState(lead.followUpDate ?? "");
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [priority, setPriority] = useState<"alta" | "media" | "baja">(lead.leadPriority ?? "media");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ nextAction, followUpDate, status, leadPriority: priority });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40";

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-400 block mb-1.5">Próxima acción</label>
        <input type="text" value={nextAction} onChange={(e) => setNextAction(e.target.value)} placeholder="Ej. Llamar para coordinar visita" className={inp} />
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-1.5">Fecha de seguimiento</label>
        <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className={inp} />
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-1.5">Estado actual</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} className={inp + " appearance-none"}>
          {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
            <option key={s} value={s} className="bg-slate-900">{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-1.5">Prioridad comercial</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value as "alta" | "media" | "baja")} className={inp + " appearance-none"}>
          <option value="alta" className="bg-slate-900">Alta</option>
          <option value="media" className="bg-slate-900">Media</option>
          <option value="baja" className="bg-slate-900">Baja</option>
        </select>
      </div>

      {/* Quick checklist */}
      <div className="bg-slate-800/40 rounded-xl p-3">
        <p className="text-xs text-slate-400 font-medium mb-2">Lista de verificación</p>
        <div className="space-y-1.5 text-xs text-slate-400">
          {[
            "Boleta eléctrica recibida",
            "Visita técnica coordinada",
            "Propuesta enviada",
            "Anticipo discutido",
            "Fecha instalación definida",
          ].map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/40" />
              {item}
            </label>
          ))}
        </div>
      </div>

      {lead.updatedAt && (
        <p className="text-xs text-slate-600">Última actualización: {new Date(lead.updatedAt).toLocaleDateString("es-CL")}</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-all"
      >
        {saved ? "✓ Guardado" : "Guardar seguimiento"}
      </button>
    </div>
  );
}

// ---- Lead Edit Modal ----
interface LeadEditModalProps {
  lead: AdminLead;
  onSave: (data: Partial<Omit<AdminLead, "id" | "createdAt">>) => void;
  onClose: () => void;
}

function LeadEditModal({ lead, onSave, onClose }: LeadEditModalProps) {
  const [form, setForm] = useState({
    name: lead.name,
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    commune: lead.commune,
    region: lead.region,
    propertyType: lead.propertyType,
    monthlyBill: lead.monthlyBill,
    priority: lead.priority,
    status: lead.status,
    source: lead.source ?? "",
    kit: lead.kit ?? "",
    estimatedSaving: lead.estimatedSaving ?? 0,
  });

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const inp = "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: form.name,
      phone: form.phone || undefined,
      email: form.email || undefined,
      commune: form.commune,
      region: form.region,
      propertyType: form.propertyType,
      monthlyBill: form.monthlyBill,
      priority: form.priority,
      status: form.status as LeadStatus,
      source: form.source || undefined,
      kit: form.kit || undefined,
      estimatedSaving: form.estimatedSaving || undefined,
      estimatedAnnualSaving: form.estimatedSaving ? form.estimatedSaving * 12 : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white">Editar lead</h3>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Nombre *</label>
              <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Teléfono</label>
              <input type="text" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Comuna</label>
              <input type="text" value={form.commune} onChange={(e) => set("commune", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Región</label>
              <select value={form.region} onChange={(e) => set("region", e.target.value)} className={inp + " appearance-none"}>
                <option value="V" className="bg-slate-900">V Región</option>
                <option value="RM" className="bg-slate-900">RM</option>
                <option value="VI" className="bg-slate-900">VI Región</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Tipo propiedad</label>
              <select value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)} className={inp + " appearance-none"}>
                {["hogar","parcela","pyme","negocio","turismo","agricola"].map((t) => (
                  <option key={t} value={t} className="bg-slate-900 capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Cuenta mensual ($)</label>
              <input type="number" value={form.monthlyBill} onChange={(e) => set("monthlyBill", Number(e.target.value))} className={inp} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Prioridad energética</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className={inp + " appearance-none"}>
                {["ahorro","respaldo","independencia","plusvalia"].map((p) => (
                  <option key={p} value={p} className="bg-slate-900">{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Estado</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value as LeadStatus)} className={inp + " appearance-none"}>
                {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
                  <option key={s} value={s} className="bg-slate-900">{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Fuente</label>
              <input type="text" value={form.source} onChange={(e) => set("source", e.target.value)} placeholder="Ej. referido, web" className={inp} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Kit sugerido</label>
              <input type="text" value={form.kit} onChange={(e) => set("kit", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Ahorro mensual est. ($)</label>
              <input type="number" value={form.estimatedSaving} onChange={(e) => set("estimatedSaving", Number(e.target.value))} className={inp} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-sm font-medium transition-all">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-all">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Main Drawer ----
interface LeadDrawerProps {
  lead: AdminLead | null;
  onClose: () => void;
}

export function LeadDrawer({ lead, onClose }: LeadDrawerProps) {
  const { updateLead, addNote, deleteNote, updateQuotation, autoScore } = useLeads();
  const [config] = useCompanyConfig();
  const [activeTab, setActiveTab] = useState<DrawerTab>("resumen");
  const [showSummary, setShowSummary] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Keep a stable reference — re-fetch from the hook so updates are reflected
  if (!lead) return null;

  const handleAutoScore = () => autoScore(lead.id);
  const handleAddNote = (text: string) => addNote(lead.id, text);
  const handleDeleteNote = (noteId: string) => deleteNote(lead.id, noteId);
  const handleSaveQuotation = (q: AdminLead["quotation"]) => updateQuotation(lead.id, q);
  const handleSaveSeguimiento = (data: Partial<AdminLead>) => updateLead(lead.id, data);
  const handleUpdatePhone = (phone: string) => updateLead(lead.id, { phone: phone || undefined });
  const handleSaveEdit = (data: Partial<Omit<AdminLead, "id" | "createdAt">>) => updateLead(lead.id, data);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 bg-slate-900 border-l border-slate-800/60 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800/60 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{lead.name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[lead.status]?.classes ?? "bg-slate-700 text-slate-400"}`}>
                {STATUS_CONFIG[lead.status]?.label ?? lead.status}
              </span>
              {lead.leadPriority && (
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                  lead.leadPriority === "alta" ? "bg-red-500/20 text-red-300 border-red-500/30" :
                  lead.leadPriority === "media" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                  "bg-slate-600/20 text-slate-400 border-slate-600/30"
                }`}>
                  Prioridad {lead.leadPriority}
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowEdit(true)}
                className="text-xs text-slate-500 hover:text-amber-400 transition-colors"
              >
                Editar →
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="border-b border-slate-800/60 bg-slate-900/50">
          <div className="flex overflow-x-auto scrollbar-hide">
            {DRAWER_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "resumen" && (
            <ResumenTab lead={lead} onAutoScore={handleAutoScore} onShowSummary={() => setShowSummary(true)} />
          )}
          {activeTab === "notas" && (
            <NotasTab lead={lead} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} />
          )}
          {activeTab === "cotizacion" && (
            <CotizacionTab lead={lead} onSave={handleSaveQuotation} />
          )}
          {activeTab === "whatsapp" && (
            <WhatsAppTab lead={lead} onUpdatePhone={handleUpdatePhone} />
          )}
          {activeTab === "seguimiento" && (
            <SeguimientoTab lead={lead} onSave={handleSaveSeguimiento} />
          )}
        </div>
      </div>

      {/* Modals */}
      {showSummary && (
        <SummaryModal
          lead={lead}
          config={config}
          onClose={() => setShowSummary(false)}
        />
      )}
      {showEdit && (
        <LeadEditModal
          lead={lead}
          onSave={handleSaveEdit}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}
