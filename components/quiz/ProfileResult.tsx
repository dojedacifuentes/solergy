"use client";
import { motion } from "framer-motion";
import type { EnergyProfile, QuizAnswers } from "./EnergyQuiz";
import { solarZones } from "@/lib/data/mock-zones";

interface Props {
  profile: EnergyProfile;
  answers: QuizAnswers;
  onGoToSimulator: () => void;
  onWhatsApp: () => void;
}

function getBillMid(range: string): number {
  const map: Record<string, number> = {
    "<50k": 40000,
    "50k-100k": 75000,
    "100k-200k": 150000,
    "200k-500k": 300000,
    ">500k": 600000,
  };
  return map[range] ?? 100000;
}

export function ProfileResult({ profile, answers, onGoToSimulator, onWhatsApp }: Props) {
  const zone = solarZones.find(
    (z) => z.name === answers.commune
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Profile header */}
      <div className="text-center">
        <div className="inline-flex px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
          Tu perfil energético
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{profile.label}</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">{profile.diagnosis}</p>
      </div>

      {/* Zone score badge */}
      {zone && (
        <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{zone.solarScore}/100</div>
            <div className="text-xs text-slate-500">Puntaje solar</div>
          </div>
          <div className="w-px h-10 bg-slate-700" />
          <div className="text-left">
            <div className="font-medium text-white text-sm">{answers.commune}</div>
            <div className="text-xs text-slate-400">{zone.narrative.split(".")[0]}.</div>
          </div>
        </div>
      )}

      {/* Profile details */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div>
          <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Oportunidad</p>
          <p className="text-slate-300 text-sm">{profile.opportunity}</p>
        </div>
        <div>
          <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Sistema sugerido</p>
          <p className="text-slate-300 text-sm">{profile.suggestedSystem}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-slate-800/60 text-center">
            <div className="text-lg font-bold text-amber-400">{profile.estimatedSavingRange}</div>
            <div className="text-xs text-slate-500 mt-0.5">Ahorro estimado</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 text-center">
            <div className="text-lg font-bold text-green-400">{profile.roiRange}</div>
            <div className="text-xs text-slate-500 mt-0.5">Retorno estimado</div>
          </div>
        </div>
        {profile.habitsToImprove.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Hábitos que aceleran el retorno</p>
            <ul className="space-y-1.5">
              {profile.habitsToImprove.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">→</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onGoToSimulator}
          className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/25"
        >
          ☀️ Calcular mi escenario en el simulador
        </button>
        <button
          type="button"
          onClick={onWhatsApp}
          className="w-full py-3.5 rounded-2xl border border-green-600/40 bg-green-600/10 text-green-400 hover:bg-green-600/20 font-medium text-sm transition-all"
        >
          💬 Enviar evaluación por WhatsApp
        </button>
      </div>

      <p className="text-center text-xs text-slate-600">
        Estimación preliminar basada en tu perfil. El análisis definitivo requiere evaluación técnica presencial.
      </p>
    </motion.div>
  );
}
