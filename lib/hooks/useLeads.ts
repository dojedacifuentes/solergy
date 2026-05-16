"use client";
import { useCallback } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { scoreLeadInput } from "@/lib/scoring";

export type LeadStatus =
  | "nuevo"
  | "contactado"
  | "evaluando"
  | "propuesta_enviada"
  | "seguimiento"
  | "cerrado"
  | "perdido";

export interface AdminLead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  commune: string;
  region: string;
  propertyType: string;
  monthlyBill: number;
  priority: string;
  score?: number;
  estimatedSaving?: number;
  kit?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Financial
  estimatedAnnualSaving?: number;
  roiEstimate?: string;
  projectValue?: number;

  // Scoring
  scoreBreakdown?: {
    consumo: number;
    radiacion: number;
    continuidad: number;
    capacidadPago: number;
    saturacion: number;
  };
  profileLabel?: string;

  // Lead tracking
  leadPriority?: "alta" | "media" | "baja";
  nextAction?: string;
  followUpDate?: string;
  source?: string;

  // Quotation
  quotation?: {
    proposalName?: string;
    kitName?: string;
    panelCount?: number;
    batteryCount?: number;
    inverterType?: string;
    projectValue?: number;
    paymentMethod?: string;
    advanceAmount?: number;
    balanceAmount?: number;
    proposalValidity?: string;
    observations?: string;
    conditions?: string;
    warranty?: string;
    estimatedInstallTime?: string;
    updatedAt?: string;
  };

  // Notes history
  notesHistory?: Array<{
    id: string;
    text: string;
    createdAt: string;
  }>;
}

export function useLeads() {
  const [leads, setLeads] = useLocalStorage<AdminLead[]>("solergy_leads", []);

  const addLead = useCallback(
    (lead: Omit<AdminLead, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newLead: AdminLead = {
        ...lead,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      setLeads([newLead, ...leads]);
    },
    [leads, setLeads]
  );

  const updateLead = useCallback(
    (id: string, updates: Partial<Omit<AdminLead, "id" | "createdAt">>) => {
      setLeads(
        leads.map((l) =>
          l.id === id
            ? { ...l, ...updates, updatedAt: new Date().toISOString() }
            : l
        )
      );
    },
    [leads, setLeads]
  );

  const deleteLead = useCallback(
    (id: string) => {
      setLeads(leads.filter((l) => l.id !== id));
    },
    [leads, setLeads]
  );

  const updateStatus = useCallback(
    (id: string, status: LeadStatus) => {
      updateLead(id, { status });
    },
    [updateLead]
  );

  const filterByStatus = useCallback(
    (status: LeadStatus) => leads.filter((l) => l.status === status),
    [leads]
  );

  const filterByRegion = useCallback(
    (region: string) => leads.filter((l) => l.region === region),
    [leads]
  );

  const exportLeads = useCallback(() => {
    const blob = new Blob([JSON.stringify(leads, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solergy_leads_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [leads]);

  const importLeads = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json) as AdminLead[];
        if (!Array.isArray(parsed)) return;
        const existingIds = new Set(leads.map((l) => l.id));
        const newOnes = parsed.filter((l) => !existingIds.has(l.id));
        setLeads([...newOnes, ...leads]);
      } catch {
        // invalid JSON — ignore
      }
    },
    [leads, setLeads]
  );

  const addNote = useCallback(
    (leadId: string, text: string) => {
      const note = {
        id: crypto.randomUUID(),
        text,
        createdAt: new Date().toISOString(),
      };
      setLeads(
        leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                notesHistory: [note, ...(l.notesHistory ?? [])],
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );
    },
    [leads, setLeads]
  );

  const deleteNote = useCallback(
    (leadId: string, noteId: string) => {
      setLeads(
        leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                notesHistory: (l.notesHistory ?? []).filter((n) => n.id !== noteId),
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );
    },
    [leads, setLeads]
  );

  const updateQuotation = useCallback(
    (leadId: string, quotation: AdminLead["quotation"]) => {
      setLeads(
        leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                quotation: { ...quotation, updatedAt: new Date().toISOString() },
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );
    },
    [leads, setLeads]
  );

  const autoScore = useCallback(
    (leadId: string) => {
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return;
      const result = scoreLeadInput({
        monthlyBill: lead.monthlyBill,
        region: lead.region,
        commune: lead.commune,
        propertyType: lead.propertyType,
        nightConsumption: "medio",
        hasPool: false,
        hasWaterPump: false,
        workFromHome: false,
        priority: lead.priority || "ahorro",
      });
      setLeads(
        leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                score: result.total,
                scoreBreakdown: result.breakdown,
                profileLabel: result.profileLabel,
                leadPriority: result.priority,
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );
    },
    [leads, setLeads]
  );

  return {
    leads,
    setLeads,
    addLead,
    updateLead,
    deleteLead,
    updateStatus,
    filterByStatus,
    filterByRegion,
    exportLeads,
    importLeads,
    addNote,
    deleteNote,
    updateQuotation,
    autoScore,
  };
}
