"use client";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    icon: "🔍",
    title: "Diagnóstico gratuito",
    desc: "Evaluamos tu consumo, orientación, espacio y objetivos energéticos. Sin costo ni compromiso.",
    detail: "Visita técnica o evaluación remota con tu última cuenta eléctrica.",
  },
  {
    num: "02",
    icon: "📊",
    title: "Propuesta personalizada",
    desc: "Diseñamos un sistema a tu medida con escenarios de ahorro, retorno estimado y opciones de financiamiento.",
    detail: "3 escenarios: conservador, inteligente y optimizado.",
  },
  {
    num: "03",
    icon: "🤝",
    title: "Acuerdo y anticipo",
    desc: "Confirmado el proyecto, se solicita anticipo para la compra de equipos. Proceso claro y transparente.",
    detail: "Modelos 50/50 o 30/40/30 según proyecto.",
  },
  {
    num: "04",
    icon: "🔧",
    title: "Instalación profesional",
    desc: "Equipo técnico certificado realiza la instalación según normas SEP y especificaciones del proyecto.",
    detail: "Tiempo estimado: 1-3 días según complejidad.",
  },
  {
    num: "05",
    icon: "✅",
    title: "Revisión y garantía",
    desc: "Revisión final del sistema, puesta en marcha y entrega de documentación con garantías.",
    detail: "Soporte post-instalación y seguimiento de producción.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">El proceso</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            De evaluación a{" "}
            <span className="gradient-text-solar">independencia.</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Line connector */}
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-transparent -translate-x-1/2" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex items-start gap-6 lg:gap-12 ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={`flex-1 ${i % 2 !== 0 ? "lg:text-right" : ""}`}>
                  <div className="glass rounded-2xl p-6 hover:border-amber-500/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="text-amber-400/60 text-sm font-mono font-bold">{step.num}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                    <p className="mt-2 text-xs text-amber-400/70 font-medium">{step.detail}</p>
                  </div>
                </div>

                {/* Center node */}
                <div className="hidden lg:flex w-12 h-12 rounded-full glass border-2 border-amber-500/40 items-center justify-center flex-shrink-0 mt-6 solar-glow">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                </div>

                <div className="hidden lg:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
