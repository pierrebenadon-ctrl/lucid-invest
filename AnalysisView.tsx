
import React, { useState } from 'react';
import { StockAnalysis } from '../types';
import { LucidityScoreGauge } from './LucidityScoreGauge';

interface Props {
  analysis: StockAnalysis;
  onBack: () => void;
}

export const AnalysisView: React.FC<Props> = ({ analysis, onBack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (isin: string) => {
    navigator.clipboard.writeText(isin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-slate-500 hover:text-slate-800 transition-colors group font-bold uppercase tracking-widest text-[10px]"
      >
        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Retour au Radar Alpha
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden mb-12 text-slate-900 relative">
        <div className="p-10 md:p-14 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{analysis.name}</h1>
              <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-sm font-black tracking-widest uppercase">{analysis.ticker}</span>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-indigo-600 font-black uppercase text-xs tracking-widest">{analysis.sector} • {analysis.lastUpdate}</p>
              {analysis.isin && (
                <>
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">ISIN: {analysis.isin}</p>
                    <button 
                      onClick={() => handleCopy(analysis.isin!)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                        copied 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent'
                      }`}
                    >
                      {copied ? 'Copié' : 'Copier'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 text-center min-w-[160px]">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Cible Alpha</p>
            <p className="text-indigo-600 font-black text-2xl tracking-tighter">LUCIDITÉ MAX</p>
          </div>
        </div>

        {analysis.marketingHook && (
          <div className="mx-10 md:mx-14 mt-10 p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex items-center gap-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <p className="text-lg text-white font-black italic tracking-tight leading-snug">"{analysis.marketingHook}"</p>
          </div>
        )}

        <div className="p-10 md:p-14 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-14">
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                <span className="w-3 h-8 bg-indigo-600 rounded-full"></span>
                Thèse Centrale ({analysis.mainScenario?.probability}%)
              </h2>
              <div className="bg-indigo-50/50 rounded-[3rem] p-10 border border-indigo-100 shadow-sm">
                <p className="text-2xl text-indigo-950 font-black mb-6 italic tracking-tight leading-tight">
                  "{analysis.mainScenario?.keyPhrase}"
                </p>
                <p className="text-slate-700 leading-relaxed mb-8 font-medium text-lg">
                  {analysis.mainScenario?.description}
                </p>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Piliers de soutien</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(analysis.mainScenario?.supportingFactors || []).map((f, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-600 font-bold bg-white p-4 rounded-2xl border border-indigo-100/50">
                        <svg className="w-5 h-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-rose-50 rounded-[2.5rem] p-8 border border-rose-100">
                <h3 className="text-rose-950 font-black text-lg mb-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  Négatif ({analysis.negativeScenario?.probability}%)
                </h3>
                <p className="text-slate-700 leading-relaxed font-bold italic">
                  {analysis.negativeScenario?.description}
                </p>
              </section>
              <section className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200">
                <h3 className="text-slate-900 font-black text-lg mb-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Neutre ({analysis.neutralScenario?.probability}%)
                </h3>
                <p className="text-slate-700 leading-relaxed font-bold italic">
                  {analysis.neutralScenario?.description}
                </p>
              </section>
            </div>
          </div>

          <aside className="space-y-12">
            {analysis.lucidityScore && <LucidityScoreGauge scoreData={analysis.lucidityScore} />}
            
            <section className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Déjà pricé par le marché</h3>
              <ul className="space-y-4">
                {(analysis.marketAnticipations || []).map((a, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start font-bold">
                    <span className="w-2 h-2 bg-indigo-200 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                    {a}
                  </li>
                ))}
              </ul>
            </section>

            {analysis.sources && analysis.sources.length > 0 && (
              <section className="bg-white rounded-[2.5rem] p-8 border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 -translate-y-8 translate-x-8 rounded-full"></div>
                <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                   Sources Grounding
                </h3>
                <ul className="space-y-3">
                  {analysis.sources.map((source, i) => (
                    <li key={i}>
                      <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-black text-slate-600 hover:text-indigo-600 flex items-center gap-3 group transition-colors p-3 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/30"
                      >
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        <span className="truncate">{source.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>

        <div className="p-10 md:p-14 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-16">
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
              <span className="w-3 h-8 bg-rose-500 rounded-full"></span>
              Anatomie des Risques
            </h2>
            <div className="space-y-6">
              {(analysis.realRisks || []).map((risk, i) => (
                <div key={i} className="flex gap-6 p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm group hover:border-rose-200 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-2">{risk.category}</p>
                    <p className="text-slate-700 text-base leading-relaxed font-bold italic">{risk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
              <span className="w-3 h-8 bg-amber-500 rounded-full"></span>
              Points d'Invalidation
            </h2>
            <p className="text-slate-500 mb-8 font-black uppercase text-[10px] tracking-widest italic">Signal de sortie impératif</p>
            <div className="space-y-6">
              {(analysis.invalidationPoints || []).map((point, i) => (
                <div key={i} className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  </div>
                  <p className="text-xl font-black text-amber-950 mb-4">{point.event}</p>
                  <p className="text-sm text-amber-900 bg-white/50 p-4 rounded-xl border border-amber-200/50 flex items-start gap-3 font-bold">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    <span>Signal observable : <span className="uppercase text-amber-600">{point.observableSignal}</span></span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-950 text-slate-500 text-center text-[10px] font-black uppercase tracking-[0.4em]">
          CLAUSE DE NON-RESPONSABILITÉ : LucidInvest n'est pas un conseiller financier. Investir comporte des risques réels de perte en capital.
        </div>
      </div>
    </div>
  );
};
