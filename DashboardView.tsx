
import React, { useState, useMemo, useEffect } from 'react';
import { User, ViewState, StockAnalysis, UserTier } from '../types';
import { fetchRealMarketPrices, MarketPricePoint } from '../services/marketService';
import { getCurrentMonthYear } from '../services/automationService';

interface Props {
  user: User;
  globalAnalyses: StockAnalysis[]; // Déjà filtrées par le parent
  setView: (view: ViewState) => void;
  onReadThesis: (analysis: StockAnalysis) => void;
}

const NextReportBadge = ({ isMonthComplete }: { isMonthComplete: boolean }) => {
  const nextReportDate = useMemo(() => {
    const now = new Date();
    let month = now.getMonth();
    let year = now.getFullYear();
    
    if (isMonthComplete || now.getDate() >= 2) {
      month += 1;
      if (month > 11) { month = 0; year += 1; }
    }
    
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return `02 ${months[month]} ${year}`;
  }, [isMonthComplete]);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 mb-8">
      <div className={`w-2 h-2 rounded-full ${isMonthComplete ? 'bg-indigo-600 animate-pulse' : 'bg-amber-500'}`} />
      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
        {isMonthComplete ? `Prochaine mise à jour : ${nextReportDate}` : "Radar Alpha : Synchronisation..."}
      </span>
    </div>
  );
};

export const DashboardView: React.FC<Props> = ({
  user,
  globalAnalyses,
  setView,
  onReadThesis
}) => {
  const [prices, setPrices] = useState<Record<string, MarketPricePoint>>({});
  const [copiedTicker, setCopiedTicker] = useState<string | null>(null);
  
  const currentMonthActual = useMemo(() => getCurrentMonthYear(), []);
  
  const isCurrentMonthComplete = useMemo(() => {
    return globalAnalyses.filter(a => a.lastUpdate === currentMonthActual).length >= (user.tier === UserTier.ALPHA ? 12 : user.tier === UserTier.ALPHA_JUNIOR ? 6 : 2);
  }, [globalAnalyses, currentMonthActual, user.tier]);

  const monthsAvailable = useMemo(() => {
    const monthsList = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const months = Array.from(new Set(globalAnalyses.map(a => a.lastUpdate)));
    
    return months.sort((a, b) => {
      const [m1, y1] = a.split(' ');
      const [m2, y2] = b.split(' ');
      const d1 = new Date(parseInt(y1), monthsList.indexOf(m1), 2);
      const d2 = new Date(parseInt(y2), monthsList.indexOf(m2), 2);
      return d2.getTime() - d1.getTime();
    });
  }, [globalAnalyses]);

  const [selectedMonth, setSelectedMonth] = useState(monthsAvailable[0] || currentMonthActual);

  useEffect(() => {
    if (monthsAvailable.length > 0 && !monthsAvailable.includes(selectedMonth)) {
      setSelectedMonth(monthsAvailable[0]);
    }
  }, [monthsAvailable]);

  const monthlyOpps = useMemo(() => {
    return globalAnalyses.filter(a => a.lastUpdate === selectedMonth);
  }, [globalAnalyses, selectedMonth]);

  useEffect(() => {
    const tickers = monthlyOpps.map(a => a.ticker);
    if (tickers.length > 0) {
      fetchRealMarketPrices(tickers).then(setPrices);
    }
  }, [monthlyOpps]);

  const handleCopyIsin = (isin: string, ticker: string) => {
    navigator.clipboard.writeText(isin);
    setCopiedTicker(ticker);
    setTimeout(() => setCopiedTicker(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-72 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xl font-black text-slate-900 mb-6 px-4 uppercase tracking-tighter">Archives</h2>
            <nav className="space-y-2 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {monthsAvailable.length === 0 ? (
                <p className="px-4 text-xs font-bold text-slate-400 italic">Aucune archive disponible.</p>
              ) : monthsAvailable.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`w-full text-left px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all flex items-center justify-between group ${
                    selectedMonth === m ? 'bg-indigo-600 text-white shadow-xl translate-x-2' : 'text-slate-500 hover:bg-white border border-transparent hover:border-slate-100'
                  }`}
                >
                  {m}
                  {selectedMonth === m && <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>}
                </button>
              ))}
            </nav>

            <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl text-white">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Statut Membre</p>
              <p className="text-2xl font-black mb-4">{user.tier.replace('_', ' ')}</p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Contenus débloqués</p>
                <p className="text-xs font-black text-white">{globalAnalyses.length} analyses accessibles</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <NextReportBadge isMonthComplete={isCurrentMonthComplete} />
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">Rapport Mensuel</h1>
              <p className="text-xl text-indigo-600 font-bold italic">{selectedMonth} — La sélection LucidInvest</p>
            </div>
            <div className={`px-6 py-3 rounded-2xl border ${user.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <span className={`text-xs font-black uppercase tracking-widest ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {user.status === 'ACTIVE' ? 'Abonnement Actif ✓' : `Statut : ${user.status}`}
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {monthlyOpps.length === 0 ? (
              <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-indigo-100">
                <div className="max-w-md mx-auto px-6">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <h3 className="text-slate-900 font-black text-2xl mb-4 tracking-tight uppercase">Rapport en cours de rédaction...</h3>
                  <p className="text-slate-500 font-medium italic leading-relaxed">
                    Nos algorithmes finalisent la sélection. Revenez bientôt pour découvrir vos {user.tier === UserTier.ALPHA ? '14' : user.tier === UserTier.ALPHA_JUNIOR ? '6' : '2'} pépites du mois.
                  </p>
                </div>
              </div>
            ) : (
              monthlyOpps.map((opp) => {
                const livePrice = prices[opp.ticker]?.currentPrice || 0;
                const entryPrice = opp.entryPrice || prices[opp.ticker]?.entryPrice || 100;
                const evolution = entryPrice > 0 ? ((livePrice - entryPrice) / entryPrice) * 100 : 0;
                const isCopied = copiedTicker === opp.ticker;

                return (
                  <div key={`${opp.ticker}-${opp.lastUpdate}`} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                          <span className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">{opp.ticker}</span>
                          <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${opp.sector === 'CRYPTO' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{opp.sector}</span>
                          
                          {opp.isin && (
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${isCopied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                              <span className="text-[9px] font-black uppercase tracking-widest">ISIN: {opp.isin}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleCopyIsin(opp.isin!, opp.ticker); }}
                                className={`p-1 rounded-md transition-colors ${isCopied ? 'text-emerald-500' : 'hover:bg-indigo-100 text-indigo-400'}`}
                              >
                                {isCopied ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{opp.name}</p>
                      </div>
                      
                      <div className={`px-5 py-3 rounded-2xl text-center border-2 flex-shrink-0 ${evolution >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                        <p className="text-[9px] font-black uppercase mb-1">Performance</p>
                        <span className="text-base font-black tracking-tight">{evolution >= 0 ? '+' : ''}{evolution.toFixed(2)}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Cours Archive ({opp.lastUpdate})</p>
                        <p className="text-lg font-black text-slate-900">{entryPrice.toLocaleString('fr-FR')} €</p>
                      </div>
                      <div className="bg-indigo-50/30 p-5 rounded-3xl border border-indigo-100">
                        <p className="text-[9px] font-black text-indigo-500 uppercase mb-2">Cours Actuel</p>
                        <p className="text-lg font-black text-indigo-900">{livePrice > 0 ? livePrice.toLocaleString('fr-FR') : entryPrice.toLocaleString('fr-FR')} €</p>
                      </div>
                    </div>

                    <div className="mb-10 flex-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Thèse Centrale</p>
                      <p className="text-slate-600 font-medium leading-relaxed line-clamp-3 italic">"{opp.mainScenario.keyPhrase || opp.mainScenario.description}"</p>
                    </div>

                    <button 
                      onClick={() => onReadThesis(opp)}
                      className="mt-auto w-full py-5 bg-slate-900 text-white rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-indigo-600 shadow-xl active:scale-95"
                    >
                      Lire l'analyse complète
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
