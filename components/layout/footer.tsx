import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { WHATSAPP_URL, CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/mock-data";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-sm">
              Plataforma inteligente de independencia energética para hogares,
              parcelas y negocios en Chile. V Región, VI Región y Región Metropolitana.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
              >
                <span>WhatsApp</span>
                <span className="text-xs text-green-500/70">{WHATSAPP_NUMBER}</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {["Paneles solares", "Kits solares", "Baterías de respaldo", "Inversores", "Soluciones personalizadas", "Eficiencia energética"].map((s) => (
                <li key={s} className="hover:text-white transition-colors cursor-pointer">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/simulador" className="hover:text-white transition-colors">Simulador de ahorro</Link></li>
              <li><Link href="/#casos" className="hover:text-white transition-colors">Casos reales</Link></li>
              <li><Link href="/#confianza" className="hover:text-white transition-colors">¿Por qué confiar?</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Panel comercial</Link></li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Solergy. Energía solar inteligente para Chile.</p>
          <div className="flex items-center gap-4">
            <p>V Región · VI Región · Región Metropolitana</p>
            <Link href="/admin" className="text-slate-700 hover:text-slate-500 transition-colors">
              Acceso Solergy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
