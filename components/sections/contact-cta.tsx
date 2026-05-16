"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { WHATSAPP_URL, CONTACT_EMAIL } from "@/lib/mock-data";

export function ContactCTA() {
  return (
    <section id="contacto" className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 sm:p-14 relative overflow-hidden solar-glow"
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-3xl mb-6 solar-glow">
              ☀️
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tu próximo paso hacia la{" "}
              <span className="gradient-text-solar">independencia energética</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
              Una evaluación gratuita. Sin compromiso. Con todos los números claros.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/simulador">
                <button className="btn-solar text-base px-8 py-4 rounded-2xl">
                  ⚡ Simular mi ahorro
                </button>
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <button className="btn-outline text-base px-8 py-4 rounded-2xl">
                  💬 WhatsApp directo
                </button>
              </a>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-amber-400 transition-colors">
                📧 {CONTACT_EMAIL}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                📱 +56 9 9501 9476
              </a>
            </div>

            <p className="mt-6 text-xs text-slate-600">
              Cobertura: V Región · VI Región · Región Metropolitana
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
