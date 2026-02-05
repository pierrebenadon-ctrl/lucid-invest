
import React from 'react';
import { LucidityScore } from '../types';

interface Props {
  scoreData: LucidityScore;
}

export const LucidityScoreGauge: React.FC<Props> = ({ scoreData }) => {
  const score = scoreData.total;
  
  const getScoreColor = (s: number) => {
    if (s >= 75) return 'text-emerald-600';
    if (s >= 50) return 'text-amber-500';
    return 'text-rose-600';
  };

  const getScoreBg = (s: number) => {
    if (s >= 75) return 'bg-emerald-50';
    if (s >= 50) return 'bg-amber-50';
    return 'bg-rose-50';
  };

  const getBarColor = (s: number) => {
    if (s >= 75) return 'bg-emerald-500';
    if (s >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className={`p-6 rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300`}>
      <div className={`flex flex-col items-center justify-center p-6 rounded-2xl mb-6 ${getScoreBg(score)}`}>
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="stroke-slate-200 fill-none"
              strokeWidth="3"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`stroke-current ${getScoreColor(score)} fill-none transition-all duration-1000 ease-out`}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
          </div>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Score de Lucidité Global</p>
      </div>

      {/* Détails des piliers */}
      <div className="space-y-4 mb-8">
        {[
          { label: 'Lisibilité Business', value: scoreData.readability },
          { label: 'Stabilité Financière', value: scoreData.financialStability },
          { label: 'Dépendance Externe', value: scoreData.externalDependency },
          { label: 'Volatilité Narrative', value: scoreData.narrativeVolatility },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-500">{item.label}</span>
              <span className="text-xs font-bold text-slate-700">{item.value}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${getBarColor(item.value)} transition-all duration-1000`} 
                style={{ width: `${item.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Guide d'interprétation */}
      <div className="pt-6 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Comprendre la note</h4>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-1 h-8 bg-emerald-500 rounded-full flex-shrink-0"></div>
            <p className="text-[11px] leading-tight text-slate-600">
              <span className="font-bold text-emerald-600 block mb-0.5">75+ : Lucidité Élevée</span>
              Business prévisible, thèse robuste et risques maîtrisés.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-1 h-8 bg-amber-500 rounded-full flex-shrink-0"></div>
            <p className="text-[11px] leading-tight text-slate-600">
              <span className="font-bold text-amber-500 block mb-0.5">50-74 : Lucidité Modérée</span>
              Incertitudes notables. Demande un suivi des hypothèses clés.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-1 h-8 bg-rose-500 rounded-full flex-shrink-0"></div>
            <p className="text-[11px] leading-tight text-slate-600">
              <span className="font-bold text-rose-600 block mb-0.5">&lt; 50 : Lucidité Faible</span>
              Pari spéculatif. Environnement complexe ou narratif instable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
