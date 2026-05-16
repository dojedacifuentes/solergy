"use client";
import { motion } from "framer-motion";

export function TrustModule() {
  return (
    <section id="confianza" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Transparencia</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            ¿Por qué se solicita{" "}
            <span className="gradient-text-solar">anticipo?</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Entendemos que pagar antes de ver la instalación genera dudas. Esta es la explicación real.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Explanation card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold text-white mb-6">La realidad del proceso</h3>
            <div className="space-y-5">
              {[
                {
                  icon: "📦",
                  title: "Los equipos se compran antes de instalar",
                  desc: "Paneles, baterías e inversores se adquieren para TU proyecto específico. El anticipo cubre esa compra.",
                },
                {
                  icon: "🔗",
                  title: "No es riesgo: es compromiso mutuo",
                  desc: "El anticipo asegura que el cliente está comprometido y nos permite reservar equipos y mano de obra.",
                },
                {
                  icon: "📋",
                  title: "Todo queda documentado",
                  desc: "Contrato, especificaciones técnicas y condiciones de garantía firmadas antes de cualquier pago.",
                },
                {
                  icon: "🛡️",
                  title: "Garantías reales en equipos",
                  desc: "Todos los equipos tienen garantía de fábrica. La instalación tiene garantía técnica de nuestra parte.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-medium text-white text-sm">{item.title}</p>
                    <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment models */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <div className="glass rounded-2xl p-6 border-amber-500/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">A</span>
                <h4 className="font-semibold text-white">Modelo 50 / 50</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-amber-600 to-amber-400" />
                  </div>
                  <span className="text-sm text-amber-400 font-medium w-12">50%</span>
                </div>
                <p className="text-slate-400 text-sm">50% al confirmar el proyecto → compra de equipos</p>
                <p className="text-slate-400 text-sm">50% al completar la instalación y revisión final</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">B</span>
                <h4 className="font-semibold text-white">Modelo 30 / 40 / 30</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-full bg-slate-800 rounded-full h-2.5 flex gap-0.5">
                    <div className="h-full rounded-l-full bg-amber-400" style={{ width: "30%" }} />
                    <div className="h-full bg-amber-500" style={{ width: "40%" }} />
                    <div className="h-full rounded-r-full bg-amber-600" style={{ width: "30%" }} />
                  </div>
                </div>
                <p className="text-slate-400 text-sm"><strong className="text-white">30%</strong> al firmar → reserva de materiales</p>
                <p className="text-slate-400 text-sm"><strong className="text-white">40%</strong> al iniciar instalación</p>
                <p className="text-slate-400 text-sm"><strong className="text-white">30%</strong> al entregar sistema funcionando</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 bg-green-500/5 border border-green-500/20">
              <p className="text-green-300 text-sm font-medium">
                ✅ Nunca pagás el total hasta ver el sistema instalado y funcionando.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
