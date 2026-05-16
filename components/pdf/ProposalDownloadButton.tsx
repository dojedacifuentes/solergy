"use client";
import { useState } from "react";
import type { ProposalData } from "@/lib/pdf-generator";

interface Props {
  data: ProposalData;
  className?: string;
  label?: string;
}

export function ProposalDownloadButton({ data, className, label = "Descargar propuesta solar" }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { generateProposalPDF } = await import("@/lib/pdf-generator");
      await generateProposalPDF(data);
    } catch (err) {
      // Silently fail — user stays on page
      console.warn("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={
        className ??
        "w-full py-3.5 rounded-2xl border border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-300 font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      }
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
          Generando PDF...
        </>
      ) : (
        <>
          📄 {label}
        </>
      )}
    </button>
  );
}
