"use client";
import { useCallback } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

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
  };
}
