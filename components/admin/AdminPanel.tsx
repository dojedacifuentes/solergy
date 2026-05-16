"use client";
import { useState, useRef } from "react";
import { useLeads, type AdminLead, type LeadStatus } from "@/lib/hooks/useLeads";
import { useCompanyConfig } from "@/lib/hooks/useCompanyConfig";
import { COMPANY_CONFIG_DEFAULTS } from "@/lib/config";
import { formatCLP } from "@/lib/utils";

type Tab = "leads" | "config" | "datos";

const STATUS_CONFIG: Record<LeadStatus, { label: string; classes: string }> = {
  nuevo: { label: "Nuevo", classes: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  contactado: { label: "Contactado", classes: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  evaluando: { label: "Evaluando", classes: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  propuesta_enviada: { label: "Propuesta enviada", classes: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  seguimiento: { label: "Seguimiento", classes: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  cerrado: { label: "Cerrado", classes: "bg-green-500/20 text-green-300 border-green-500/30" },
  perdido: { label: "Perdido", classes: "bg-red-900/20 text-red-400 border-red-900/30" },
};

const EMPTY_LEAD: Omit<AdminLead, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  commune: "",
  region: "V",
  propertyType: "hogar",
  monthlyBill: 100000,
  priority: "ahorro",
  status: "nuevo",
  notes: "",
};

interface LeadModalProps {
  lead?: AdminLead;
  onSave: (data: Omit<AdminLead, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}

function LeadModal({ lead, onSave, onClose }: LeadModalProps) {
  const [form, setForm] = useState<Omit<AdminLead, "id" | "createdAt" | "updatedAt">>(
    lead
      ? {
          name: lead.name,
          commune: lead.commune,
          region: lead.region,
          propertyType: lead.propertyType,
          monthlyBill: lead.monthlyBill,
          priority: lead.priority,
          status: lead.status,
          notes: lead.notes ?? "",
          phone: lead.phone,
          email: lead.email,
          score: lead.score,
          estimatedSaving: lead.estimatedSaving,
          kit: lead.kit,
        }
      : EMPTY_LEAD
  );

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white">{lead ? "Editar lead" : "Nuevo lead"}</h3>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Comuna</label>
              <input
                type="text"
                value={form.commune}
                onChange={(e) => set("commune", e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Región</label>
              <select
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none"
              >
                <option value="V" className="bg-slate-900">V Región</option>
                <option value="RM" className="bg-slate-900">RM</option>
                <option value="VI" className="bg-slate-900">VI Región</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Tipo</label>
              <select
                value={form.propertyType}
                onChange={(e) => set("propertyType", e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none"
              >
                <option value="hogar" className="bg-slate-900">Hogar</option>
                <option value="parcela" className="bg-slate-900">Parcela</option>
                <option value="pyme" className="bg-slate-900">PyME</option>
                <option value="negocio" className="bg-slate-900">Negocio</option>
                <option value="turismo" className="bg-slate-900">Turismo</option>
                <option value="agricola" className="bg-slate-900">Agrícola</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Cuenta mensual ($)</label>
              <input
                type="number"
                value={form.monthlyBill}
                onChange={(e) => set("monthlyBill", Number(e.target.value))}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Estado</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as LeadStatus)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none"
              >
                {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
                  <option key={s} value={s} className="bg-slate-900">{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Teléfono</label>
              <input
                type="text"
                value={form.phone ?? ""}
                onChange={(e) => set("phone", e.target.value || undefined)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(e) => set("email", e.target.value || undefined)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Notas internas</label>
              <textarea
                value={form.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
              />
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

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const logout = onLogout;
  const { leads, addLead, updateLead, deleteLead, updateStatus, exportLeads, importLeads } = useLeads();
  const [config, setConfig] = useCompanyConfig();
  const [tab, setTab] = useState<Tab>("leads");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [editLead, setEditLead] = useState<AdminLead | undefined>();
  const [showNewLead, setShowNewLead] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredLeads = leads.filter((l) => {
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    if (filterRegion !== "all" && l.region !== filterRegion) return false;
    return true;
  });

  const handleSaveLead = (data: Omit<AdminLead, "id" | "createdAt" | "updatedAt">) => {
    if (editLead) {
      updateLead(editLead.id, data);
    } else {
      addLead(data);
    }
    setEditLead(undefined);
  };

  const handleSaveConfig = () => {
    // config is already bound to state; just show feedback
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      importLeads(text);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solergy_config_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm">Solergy Admin</span>
            <span className="text-slate-600 text-xs hidden sm:block">· Panel interno</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Sitio público →</a>
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-xs font-medium transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800/60 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1">
            {(["leads", "config", "datos"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-all capitalize ${
                  tab === t
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "leads" ? "Leads" : t === "config" ? "Configuración" : "Datos"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ===== LEADS TAB ===== */}
        {tab === "leads" && (
          <div>
            {/* Filter bar */}
            <div className="flex flex-wrap gap-3 mb-5 items-center">
              <button
                type="button"
                onClick={() => setShowNewLead(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm rounded-xl transition-all"
              >
                + Nuevo lead
              </button>
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
              <span className="text-slate-500 text-xs ml-auto">{filteredLeads.length} leads</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/60 bg-slate-900/50">
                    {["Nombre", "Comuna", "Tipo", "Cuenta", "Estado", "Fecha", "Acciones"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-600 text-sm">
                        No hay leads con este filtro
                      </td>
                    </tr>
                  )}
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{lead.name}</div>
                        {lead.phone && <div className="text-xs text-slate-500">{lead.phone}</div>}
                        {lead.email && <div className="text-xs text-slate-500">{lead.email}</div>}
                        {lead.notes && (
                          <div className="text-xs text-slate-600 mt-0.5 max-w-xs truncate">{lead.notes}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{lead.commune}<br /><span className="text-xs text-slate-600">{lead.region}</span></td>
                      <td className="px-4 py-3 text-slate-400 capitalize">{lead.propertyType}</td>
                      <td className="px-4 py-3 text-slate-300">{formatCLP(lead.monthlyBill)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                          className={`border rounded-lg px-2 py-1 text-xs font-medium appearance-none focus:outline-none cursor-pointer ${STATUS_CONFIG[lead.status].classes} bg-transparent`}
                        >
                          {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
                            <option key={s} value={s} className="bg-slate-900 text-white">{STATUS_CONFIG[s].label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString("es-CL")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditLead(lead)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
                          >
                            Editar
                          </button>
                          {deleteConfirm === lead.id ? (
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => { deleteLead(lead.id); setDeleteConfirm(null); }}
                                className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs"
                              >Confirmar</button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                              >×</button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(lead.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-all"
                            >
                              Eliminar
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
        )}

        {/* ===== CONFIG TAB ===== */}
        {tab === "config" && (
          <div className="max-w-2xl">
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6">
              <p className="text-amber-300 text-xs">
                Los cambios se guardan localmente en este navegador. Para persistir en otros dispositivos, usa Exportar respaldo en la pestaña Datos.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { key: "companyName", label: "Nombre de empresa" },
                { key: "tagline", label: "Tagline" },
                { key: "whatsapp", label: "WhatsApp (display)" },
                { key: "waNumber", label: "Número WA (sin +, sin espacios)" },
                { key: "email", label: "Email de contacto" },
                { key: "waMessageBase", label: "Mensaje base WhatsApp" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={config[key as keyof typeof config] as string}
                    onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "kitBasePrice", label: "Precio base kit ($)" },
                  { key: "kitBasePanels", label: "Paneles base" },
                  { key: "kitBaseCoverageMin", label: "Cobertura mín. (%)" },
                  { key: "kitBaseCoverageMax", label: "Cobertura máx. (%)" },
                  { key: "roiYearsMin", label: "ROI mín. (años)" },
                  { key: "roiYearsMax", label: "ROI máx. (años)" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5">{label}</label>
                    <input
                      type="number"
                      value={config[key as keyof typeof config] as number}
                      onChange={(e) => setConfig({ ...config, [key]: Number(e.target.value) })}
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-all"
              >
                {configSaved ? "✓ Configuración guardada" : "Guardar configuración"}
              </button>

              <button
                type="button"
                onClick={() => setConfig(COMPANY_CONFIG_DEFAULTS)}
                className="ml-3 px-5 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 font-medium text-sm transition-all"
              >
                Restablecer valores por defecto
              </button>
            </div>
          </div>
        )}

        {/* ===== DATOS TAB ===== */}
        {tab === "datos" && (
          <div className="max-w-xl space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">
                Panel interno Solergy · Acceso restringido · Los datos se almacenan localmente en este navegador.
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={exportLeads}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-all flex items-center gap-3 px-4"
                >
                  <span>📥</span>
                  <span>Exportar leads (JSON)</span>
                  <span className="text-slate-500 text-xs ml-auto">{leads.length} leads</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportConfig}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-all flex items-center gap-3 px-4"
                >
                  <span>⚙️</span>
                  <span>Exportar configuración (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-all flex items-center gap-3 px-4"
                >
                  <span>📤</span>
                  <span>Importar respaldo (JSON)</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />

                {resetConfirm ? (
                  <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3">
                    <p className="text-red-300 text-sm font-medium">¿Confirmar restablecer datos de ejemplo?</p>
                    <p className="text-slate-500 text-xs">Se eliminarán todos los leads actuales.</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => { setResetConfirm(false); }}
                        className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Clear leads
                          if (typeof window !== "undefined") {
                            localStorage.removeItem("solergy_leads");
                          }
                          window.location.reload();
                        }}
                        className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-sm font-medium"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setResetConfirm(true)}
                    className="w-full py-3 rounded-xl border border-red-500/20 text-red-400/70 text-sm font-medium transition-all flex items-center gap-3 px-4 hover:border-red-500/40 hover:text-red-400"
                  >
                    <span>🔄</span>
                    <span>Restablecer datos de ejemplo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead modals */}
      {(showNewLead || editLead) && (
        <LeadModal
          lead={editLead}
          onSave={handleSaveLead}
          onClose={() => { setShowNewLead(false); setEditLead(undefined); }}
        />
      )}
    </div>
  );
}
