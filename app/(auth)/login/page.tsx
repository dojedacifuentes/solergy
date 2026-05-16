"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";

const DEMO_USER = "admin@solergy.cl";
const DEMO_PASS = "demo123";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (email === DEMO_USER && password === DEMO_PASS) {
      router.push("/dashboard");
    } else {
      setError("Credenciales incorrectas. Usa: admin@solergy.cl / demo123");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <div className="text-center mb-8">
          <Link href="/">
            <Logo size="lg" className="justify-center" />
          </Link>
          <p className="mt-3 text-slate-400 text-sm">Panel Comercial Solergy</p>
        </div>

        <div className="glass rounded-3xl p-8 solar-glow">
          <h1 className="text-2xl font-bold text-white mb-2">Acceder</h1>
          <p className="text-slate-400 text-sm mb-6">Demo exclusiva para equipo Solergy</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@solergy.cl"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
                required
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-solar py-3.5 rounded-2xl text-base font-semibold disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                  Verificando...
                </span>
              ) : "Acceder al panel"}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
            <p className="text-amber-300/80 text-xs font-medium mb-1">Credenciales de demo:</p>
            <p className="text-slate-400 text-xs">
              <strong className="text-slate-300">Email:</strong> admin@solergy.cl
            </p>
            <p className="text-slate-400 text-xs">
              <strong className="text-slate-300">Contraseña:</strong> demo123
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    </div>
  );
}
