"use client";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: "💰",
    title: "Ahorro real desde mes 1",
    desc: "Reduce entre 50% y 90% de tu cuenta eléctrica. El ahorro comienza desde el primer día de operación.",
    color: "from-amber-500/20 to-yellow-500/5",
    border: "border-amber-500/20",
  },
  {
    icon: "🔋",
    title: "Respaldo ante cortes",
    desc: "Con baterías de respaldo, tu hogar o negocio sigue funcionando aunque la red falle. Cero interrupciones.",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    icon: "🏠",
    title: "Valorización de propiedad",
    desc: "Una propiedad con sistema solar vale entre 8% y 15% más en el mercado inmobiliario chileno.",
    color: "from-green-500/20 to-green-500/5",
    border: "border-green-500/20",
  },
  {
    icon: "📈",
    title: "Retorno garantizado",
    desc: "Con un consumo de $100.000/mes, el retorno de inversión llega entre 4 y 6 años. Después, es ahorro puro.",
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/20",
  },
  {
    icon: "🌱",
    title: "Independencia energética",
    desc: "Deja de depender del precio de la energía que siempre sube. Produce tu propia electricidad.",
    color: "from-teal-500/20 to-teal-500/5",
    border: "border-teal-500/20",
  },
  {
    icon: "⚙️",
    title: "Soluciones a medida",
    desc: "Desde kits básicos hasta sistemas industriales. Diseñamos la solución exacta para tu consumo y espacio.",
    color: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/20",
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">¿Por qué solar?</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            No es solo ahorro.{" "}
            <span className="gradient-text-solar">Es inteligencia.</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            La energía solar no es un gasto. Es la única inversión que te paga mes a mes durante décadas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`glass rounded-2xl p-6 bg-gradient-to-br ${b.color} border ${b.border} hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="text-3xl mb-4">{b.icon}</div>
              <h3 className="font-semibold text-white text-lg mb-2">{b.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
