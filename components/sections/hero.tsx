"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/3 rounded-full blur-[100px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(245,158,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-amber-500/20 text-sm text-amber-400 font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Independencia Energética Inteligente · V · VI · RM
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight"
        >
          Deja de pagar por{" "}
          <span className="gradient-text-solar">energía que podrías generar.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Solergy te muestra exactamente cuánto podrías ahorrar, en cuánto tiempo recuperas la inversión
          y qué tan independiente puedes ser de la red. Sin sorpresas, sin letra chica.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/simulador">
            <button className="btn-solar text-base px-8 py-4 rounded-2xl solar-glow flex items-center gap-2">
              <SunIcon />
              Simular mi ahorro gratis
            </button>
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <button className="btn-outline text-base px-8 py-4 rounded-2xl flex items-center gap-2">
              <WhatsAppIcon />
              Hablar con un asesor
            </button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
        >
          {[
            { icon: "⚡", label: "Sin pago hasta instalación confirmada" },
            { icon: "🔋", label: "Garantía en equipos incluida" },
            { icon: "📍", label: "Cobertura V · VI · RM" },
            { icon: "☀️", label: "+50 instalaciones exitosas" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-16 relative mx-auto max-w-3xl"
        >
          <div className="glass rounded-3xl p-6 solar-glow">
            <div className="grid grid-cols-3 gap-4">
              <StatPill icon="💰" label="Ahorro promedio" value="70–85%" sub="de la cuenta mensual" color="amber" />
              <StatPill icon="📅" label="Retorno típico" value="3.2–5 años" sub="después, energía gratis" color="green" />
              <StatPill icon="🔋" label="Autonomía" value="24h" sub="con sistema de respaldo" color="blue" />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Rangos de referencia para hogares con cuenta $80.000–$200.000 CLP/mes · Evalúa tu caso específico en el simulador
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatPill({ icon, label, value, sub, color }: { icon: string; label: string; value: string; sub: string; color: string }) {
  const colors: Record<string, string> = { amber: "text-amber-400", green: "text-green-400", blue: "text-blue-400" };
  return (
    <div className="glass-light rounded-2xl p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-xl font-bold ${colors[color]} leading-tight`}>{value}</div>
      <div className="text-xs text-slate-300 font-medium mt-1">{label}</div>
      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
