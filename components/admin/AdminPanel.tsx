"use client";
import { useState, useRef } from "react";
import { useLeads, type AdminLead, type LeadStatus } from "@/lib/hooks/useLeads";
import { useCompanyConfig } from "@/lib/hooks/useCompanyConfig";
import { COMPANY_CONFIG_DEFAULTS } from "@/lib/config";
import { AdminDashboard } from "./AdminDashboard";
import { LeadTable, STATUS_CONFIG } from "./LeadTable";
import { OpportunityCenter } from "./OpportunityCenter";
import { LeadDrawer } from "./LeadDrawer";
import { Sun } from "lucide-react";

type Tab = "dashboard" | "leads" | "oportunidades" | "config" | "datos";

const EMPTY_LEAD: Omit<AdminLead, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  commune: "",
  region: "V",
  propertyType: "hogar",
  monthlyBill: 100000,
  priority: "ahorro",
  status: "nuevo",
};

interface NewLeadModalProps {
  defaultCommune?: string;
  defaultRegion?: string;
  onSave: (data: Omit<AdminLead, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}

function NewLeadModal({ defaultCommune, defaultRegion, onSave, onClose }: NewLeadModalProps) {
  const [form, setForm] = useState<Omit<AdminLead, "id" | "createdAt" | "updatedAt">>({
    ...EMPTY_LEAD,
    commune: defaultCommune ?? "",
    region: defaultRegion ?? "V",
  });

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const inp = "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white">Nuevo lead</h3>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Nombre *</label>
              <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Teléfono</label>
              <input type="text" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value || undefined)} className={inp} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Email</label>
              <input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value || undefined)} className={inp} />
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
            <div className="col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Notas</label>
              <textarea
                value={form.notes ?? ""}
                onChange={(e) => set("notes", e.target.value || undefined)}
                rows={2}
                className={inp + " resize-none"}
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
  const { leads, addLead, updateLead, deleteLead, updateStatus, autoScore, exportLeads, importLeads } = useLeads();
  const [config, setConfig] = useCompanyConfig();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [drawerLead, setDrawerLead] = useState<AdminLead | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);
  const [newLeadDefaults, setNewLeadDefaults] = useState<{ commune?: string; region?: string }>({});
  const [configSaved, setConfigSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // When drawer is open, keep synced lead
  const openDrawerLead = drawerLead
    ? (leads.find((l) => l.id === drawerLead.id) ?? drawerLead)
    : null;

  const handleSaveConfig = () => {
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

  const handleExportAll = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      leads,
      config,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solergy_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddLeadForZone = (commune: string, region: string) => {
    setNewLeadDefaults({ commune, region });
    setShowNewLead(true);
    setTab("leads");
  };

  const TAB_LABELS: Record<Tab, string> = {
    dashboard: "Dashboard",
    leads: "Leads",
    oportunidades: "Oportunidades",
    config: "Configuración",
    datos: "Datos",
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-bold text-white text-sm">Panel Solergy</span>
            <span className="text-slate-600 text-xs hidden sm:block">· Gestión comercial</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Sitio público →</a>
            <button
              type="button"
              onClick={onLogout}
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
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`shrink-0 px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  tab === t
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ===== DASHBOARD ===== */}
        {tab === "dashboard" && (
          <AdminDashboard leads={leads} onGoToLeads={() => setTab("leads")} />
        )}

        {/* ===== LEADS ===== */}
        {tab === "leads" && (
          <LeadTable
            leads={leads}
            onOpenDrawer={(lead) => setDrawerLead(lead)}
            onUpdateStatus={(id, status) => updateStatus(id, status)}
            onDeleteLead={(id) => deleteLead(id)}
            onAutoScore={(id) => autoScore(id)}
            onNewLead={() => { setNewLeadDefaults({}); setShowNewLead(true); }}
          />
        )}

        {/* ===== OPORTUNIDADES ===== */}
        {tab === "oportunidades" && (
          <OpportunityCenter leads={leads} onAddLeadForZone={handleAddLeadForZone} />
        )}

        {/* ===== CONFIG ===== */}
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

              <div className="flex gap-3">
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
                  className="px-5 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 font-medium text-sm transition-all"
                >
                  Restablecer valores por defecto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== DATOS ===== */}
        {tab === "datos" && (
          <div className="max-w-xl space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">
                Los datos se almacenan localmente en este navegador.
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
                  onClick={handleExportAll}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-400/80 text-sm font-medium transition-all flex items-center gap-3 px-4"
                >
                  <span>📦</span>
                  <span>Exportar respaldo completo (leads + config)</span>
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
                    <p className="text-red-300 text-sm font-medium">¿Confirmar eliminación de todos los leads?</p>
                    <p className="text-slate-500 text-xs">Esta acción no se puede deshacer.</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setResetConfirm(false)}
                        className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
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
                    <span>🗑️</span>
                    <span>Eliminar todos los leads</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead Drawer */}
      {openDrawerLead && (
        <LeadDrawer
          lead={openDrawerLead}
          onClose={() => setDrawerLead(null)}
        />
      )}

      {/* New lead modal */}
      {showNewLead && (
        <NewLeadModal
          defaultCommune={newLeadDefaults.commune}
          defaultRegion={newLeadDefaults.region}
          onSave={(data) => { addLead(data); }}
          onClose={() => { setShowNewLead(false); setNewLeadDefaults({}); }}
        />
      )}
    </div>
  );
}
