"use client";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/mock-data";

interface Props {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: Props) {
  return (
    <header className="flex items-center justify-between py-5 px-6 border-b border-slate-700/50 glass sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Demo activa
        </span>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-600/10 border border-green-600/20 text-green-400 text-xs font-medium hover:bg-green-600/20 transition-all">
          WhatsApp
        </a>
        <Link href="/login" className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 text-xs hover:border-slate-600 hover:text-white transition-all">
          Salir
        </Link>
      </div>
    </header>
  );
}
