
import React from 'react';
import { StockAnalysis } from '../types';

interface Props {
  opportunities: StockAnalysis[];
  onBack: () => void;
}

export const AlphaOpportunitiesView: React.FC<Props> = ({ opportunities, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-6 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Radar Alpha.
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl font-medium leading-relaxed">
              Sélection exclusive du mois. {opportunities.filter(o => o.sector !== 'CRYPTO').length} Actions & {opportunities.filter(o => o.sector === 'CRYPTO').length} Cryptos.
            </p>
          </div>
          <button 
            onClick={onBack}
            className="group px-8 py-4 bg-slate-900/50 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all border border-slate-800 flex items-center gap-3 active:scale-95"
          >
            Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {(opportunities || []).map((opp, i) => (
            <div 
              key={`${opp.ticker}-${i}`}
              className={`bg-slate-900/40 border rounded-[2.5rem] overflow-hidden transition-all group animate-in fade-in slide-in-from-bottom duration-700 ${
                opp.sector === 'CRYPTO' ? 'border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-500/5' : 'border-slate-800 hover:border-indigo-500/30'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-5xl font-black tracking-tighter transition-colors ${opp.sector === 'CRYPTO' ? 'text-amber-400' : 'text-white group-hover:text-indigo-400'}`}>{opp.ticker}</span>
                      <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                        opp.sector === 'CRYPTO' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                      }`}>
                        {opp.sector === 'CRYPTO' ? 'CRYPTO ASSET' : opp.sector}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-300 mb-4">{opp.name}</h3>
                    <p className="text-xl text-slate-400 italic font-medium leading-relaxed">"{opp.mainScenario.keyPhrase}"</p>
                  </div>
                  <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center min-w-[140px] ${
                    opp.sector === 'CRYPTO' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-800/50 border-slate-700/50'
                  }`}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Score Lucidité</p>
                    <div className={`text-4xl font-black ${opp.lucidityScore.total >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {opp.lucidityScore.total}<span className="text-lg opacity-40">/100</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className={`${opp.sector === 'CRYPTO' ? 'bg-amber-500/5 border-amber-500/10' : 'bg-indigo-500/5 border-indigo-500/10'} p-8 rounded-3xl border`}>
                    <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${opp.sector === 'CRYPTO' ? 'text-amber-400' : 'text-indigo-400'}`}>
                      Thèse de Lucidité
                    </h4>
                    <p className="text-slate-300 leading-relaxed font-medium">{opp.mainScenario.description}</p>
                  </div>
                  <div className="bg-rose-500/5 border border-rose-500/10 p-8 rounded-3xl">
                    <h4 className="text-xs font-black text-rose-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      Scénario d'Invalidation
                    </h4>
                    <p className="text-slate-300 leading-relaxed font-medium">{opp.negativeScenario.description}</p>
                  </div>
                </div>

                <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700/50">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">Facteurs Clés</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {opp.mainScenario.supportingFactors?.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
