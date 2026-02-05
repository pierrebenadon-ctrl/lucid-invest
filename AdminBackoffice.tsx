
import { useState, useMemo } from 'react';
import { User, StockAnalysis, UserTier, Partner } from '../types';
import { generateFullAnalysis, generatePartnerDraft } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { automationService, getCurrentMonthYear, getUpcomingMonths } from '../services/automationService';

interface Props {
  users: User[];
  analyses: StockAnalysis[];
  onAddAnalysis: (analysis: StockAnalysis) => void;
  onDeleteAnalysis: (ticker: string, month: string) => void;
  onBack: () => void;
}

type AdminTab = 'ANALYSES' | 'CLIENTS' | 'PARTNERS';

const TIER_PRICES: Record<UserTier, number> = {
  [UserTier.MINI_BETA]: 21,
  [UserTier.ALPHA_JUNIOR]: 49,
  [UserTier.ALPHA]: 89
};

export const AdminBackoffice: React.FC<Props> = ({ users, analyses, onAddAnalysis, onDeleteAnalysis, onBack }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ANALYSES');
  const [ticker, setTicker] = useState('');
  const [month, setMonth] = useState(() => getCurrentMonthYear());
  const [isGenerating, setIsGenerating] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  
  // Gestion Partenaires
  const [partners, setPartners] = useState<Partner[]>(() => dbService.getPartners());
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    name: '', color: 'bg-indigo-600', type: '', strength: '', description: '', cta: 'Ouvrir un compte', link: ''
  });
  const [isAiPartnerLoading, setIsAiPartnerLoading] = useState(false);

  const upcomingMonths = useMemo(() => getUpcomingMonths(6), []);

  const monthlyProgress = useMemo(() => {
    const count = analyses.filter(a => a.lastUpdate === month).length;
    return { count, percent: Math.min(100, (count / 14) * 100) };
  }, [analyses, month]);

  const cumulativeCA = useMemo(() => {
    return users
      .filter(u => u.role !== 'ADMIN' && u.status === 'ACTIVE')
      .reduce((sum, u) => {
        const base = TIER_PRICES[u.tier] || 0;
        const crypto = u.hasCryptoOption ? 12 : 0;
        return sum + base + crypto;
      }, 0);
  }, [users]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;
    setIsGenerating(true);
    try {
      const analysis = await generateFullAnalysis(ticker, month);
      if (analysis) {
        onAddAnalysis(analysis);
        setTicker('');
      } else {
        alert("Erreur lors de la génération de l'analyse.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération de l'analyse.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSync = async () => {
    setIsGenerating(true);
    setSyncStatus('Lancement de la synchronisation forcée...');
    try {
      const result = await automationService.checkAndSyncMonthlyReport((msg) => setSyncStatus(msg), true);
      if (result) {
        window.location.reload(); 
      }
    } catch (err) {
      setSyncStatus('Erreur lors de la sync.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiDraftPartner = async () => {
    if (!newPartner.name) {
      alert("Saisissez le nom d'un courtier pour générer sa fiche.");
      return;
    }
    setIsAiPartnerLoading(true);
    try {
      const draft = await generatePartnerDraft(newPartner.name);
      if (draft) {
        setNewPartner(prev => ({ 
          ...prev, 
          type: draft.type || prev.type,
          strength: draft.strength || prev.strength,
          description: draft.description || prev.description,
          cta: draft.cta || prev.cta,
          color: draft.color || prev.color
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la rédaction IA.");
    } finally {
      setIsAiPartnerLoading(false);
    }
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.link) {
      alert("Le nom et le lien d'affiliation sont obligatoires.");
      return;
    }
    const partner: Partner = {
      ...newPartner as Partner,
      id: editingPartnerId || Date.now().toString()
    };
    const updated = dbService.savePartner(partner);
    setPartners(updated);
    resetPartnerForm();
  };

  const resetPartnerForm = () => {
    setEditingPartnerId(null);
    setNewPartner({ name: '', color: 'bg-indigo-600', type: '', strength: '', description: '', cta: 'Ouvrir un compte', link: '' });
  };

  const handleEditPartner = (p: Partner) => {
    setEditingPartnerId(p.id);
    setNewPartner({ ...p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePartner = (id: string) => {
    if (confirm('Voulez-vous retirer ce partenaire ?')) {
      const updated = dbService.deletePartner(id);
      setPartners(updated);
      if (editingPartnerId === id) resetPartnerForm();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-24 px-6 md:px-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Alpha Backoffice</h1>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-black rounded-lg border border-emerald-500/20">
                CA : {cumulativeCA}€ / MOIS
              </span>
              <p className="text-slate-500 font-bold text-sm">
                {users.filter(u => u.role !== 'ADMIN').length} clients actifs
              </p>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest border-l border-white/10 pl-4">
                Dernière Sync : {dbService.getLastSync() || 'Jamais'}
              </p>
            </div>
          </div>
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 items-center overflow-x-auto">
            <button 
              onClick={() => setActiveTab('ANALYSES')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'ANALYSES' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Analyses
            </button>
            <button 
              onClick={() => setActiveTab('CLIENTS')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'CLIENTS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Clients
            </button>
            <button 
              onClick={() => setActiveTab('PARTNERS')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'PARTNERS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Partenaires
            </button>
            <button onClick={onBack} className="ml-4 px-4 py-2 text-slate-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </header>

        {activeTab === 'ANALYSES' && (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <section className="bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                <h2 className="text-xl font-black mb-2 text-indigo-400">Nouvelle Thèse</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Analyse Scénaristique Manuelle</p>
                <form onSubmit={handleGenerate} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ticker Actif</label>
                    <input 
                      type="text" 
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-indigo-500 outline-none font-bold text-white placeholder-slate-700"
                      placeholder="LVMH.PA, BTC, MSFT..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Mois de publication</label>
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 font-bold text-white appearance-none cursor-pointer">
                      {upcomingMonths.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <button disabled={isGenerating || !ticker} className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-indigo-600/20">
                    {isGenerating ? 'IA EN COURS...' : 'PUBLIER ANLAYSE'}
                  </button>
                </form>
              </section>

              <section className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem]">
                <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-emerald-400">Auto-Génération {month}</h3>
                
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rapport de {month}</span>
                    <span className="text-[10px] font-black text-emerald-400">{monthlyProgress.count}/14 Opportunités</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-1000" 
                      style={{ width: `${monthlyProgress.percent}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium italic">
                  Démarre le Radar Alpha pour identifier et analyser automatiquement les 14 actifs du mois.
                </p>
                
                <button 
                  onClick={handleManualSync}
                  disabled={isGenerating || monthlyProgress.count >= 14}
                  className="w-full py-4 border border-emerald-500/30 text-emerald-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500/10 transition-all disabled:opacity-30"
                >
                  {isGenerating ? 'SYNC EN COURS...' : 'LANCER RADAR ALPHA'}
                </button>
                {syncStatus && (
                  <p className="mt-4 text-[10px] font-bold text-slate-500 italic text-center animate-pulse">
                    {syncStatus}
                  </p>
                )}
              </section>
            </div>
            
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Archives Analyses ({analyses.length})</h2>
                {analyses.length === 0 ? (
                   <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] text-slate-700 font-bold italic">
                      Aucune donnée boursière archivée.
                   </div>
                ) : analyses.sort((a,b) => b.lastUpdate.localeCompare(a.lastUpdate)).map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-900 border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all">
                    <div>
                      <p className="font-black text-lg text-white">{a.ticker} <span className="text-slate-500 text-sm font-medium">— {a.name}</span></p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{a.lastUpdate} • {a.sector} • Rank #{a.importanceRank}</p>
                    </div>
                    <button onClick={() => onDeleteAnalysis(a.ticker, a.lastUpdate)} className="text-slate-700 hover:text-rose-500 p-2 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'CLIENTS' && (
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Utilisateur</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Abonnement</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Option Crypto</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenu (Mensuel)</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.filter(u => u.role !== 'ADMIN').map((u, i) => {
                    const rev = (TIER_PRICES[u.tier] || 0) + (u.hasCryptoOption ? 12 : 0);
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-bold text-white">{u.email}</p>
                          <p className="text-[10px] text-slate-500">Inscrit le {u.signupDate || 'N/A'}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-lg uppercase border border-indigo-500/20">
                            {u.tier.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          {u.hasCryptoOption ? (
                            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Inclus ✓</span>
                          ) : (
                            <span className="text-slate-600 text-xs uppercase tracking-widest">Non</span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-lg font-black text-white">{rev}€ <span className="text-[10px] text-slate-500 font-normal">/ mois</span></p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'PARTNERS' && (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <section className="bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl sticky top-24">
                <div className="mb-8">
                  <h2 className="text-xl font-black text-amber-400 mb-1 tracking-tighter">
                    {editingPartnerId ? 'Modifier Partenaire' : 'Nouveau Partenaire'}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Guide "Comment acheter ?"</p>
                </div>
                
                <form onSubmit={handleSavePartner} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Plateforme</label>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm text-white focus:border-indigo-500 transition-colors"
                        placeholder="Nom (ex: Boursorama)"
                        value={newPartner.name}
                        onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                        required
                      />
                      {!editingPartnerId && (
                        <button 
                          type="button"
                          onClick={handleAiDraftPartner}
                          disabled={isAiPartnerLoading}
                          className="px-4 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-600/20 group"
                          title="Remplissage IA"
                        >
                          {isAiPartnerLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4 text-white group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Couleur</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm text-white cursor-pointer"
                        value={newPartner.color}
                        onChange={(e) => setNewPartner({...newPartner, color: e.target.value})}
                      >
                        <option value="bg-indigo-600">Indigo</option>
                        <option value="bg-[#E6192E]">Boursorama Red</option>
                        <option value="bg-[#1E3932]">Fortuneo Green</option>
                        <option value="bg-black">Trade Republic Black</option>
                        <option value="bg-amber-600">Amber (Crypto)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Type</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm text-white"
                        placeholder="PEA, CTO..."
                        value={newPartner.type}
                        onChange={(e) => setNewPartner({...newPartner, type: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Point Fort</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm text-white"
                      placeholder="Meilleurs frais Euronext..."
                      value={newPartner.strength}
                      onChange={(e) => setNewPartner({...newPartner, strength: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm text-white h-24 resize-none leading-relaxed"
                      placeholder="Description marketing..."
                      value={newPartner.description}
                      onChange={(e) => setNewPartner({...newPartner, description: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Lien Affilié</label>
                    <input 
                      className="w-full bg-white/10 border border-amber-500/20 rounded-xl px-4 py-3 outline-none text-sm text-amber-100 placeholder-amber-900/40"
                      placeholder="https://..."
                      value={newPartner.link}
                      onChange={(e) => setNewPartner({...newPartner, link: e.target.value})}
                      required
                    />
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button 
                      type="submit"
                      className="flex-1 py-5 bg-amber-500 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all shadow-xl shadow-amber-500/10"
                    >
                      ENREGISTRER
                    </button>
                    {editingPartnerId && (
                      <button 
                        type="button"
                        onClick={resetPartnerForm}
                        className="px-6 py-5 bg-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest"
                      >
                        ANNULER
                      </button>
                    )}
                  </div>
                </form>
              </section>
            </div>
            
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h2 className="col-span-full text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Partenaires actifs ({partners.length})</h2>
                {partners.map((p) => (
                  <div key={p.id} className={`bg-slate-900 border p-6 rounded-[2.5rem] group relative hover:border-amber-500/20 transition-all ${editingPartnerId === p.id ? 'border-amber-500' : 'border-white/5'}`}>
                    <div className="flex items-center gap-4 mb-4">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner ${p.color}`}>
                        {p.name[0]}
                       </div>
                       <div>
                        <p className="font-black text-white text-lg tracking-tight">{p.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{p.type}</p>
                       </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[10px] font-bold text-amber-500 truncate max-w-[120px]">{p.link}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEditPartner(p)} className="p-2 text-slate-700 hover:text-amber-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button onClick={() => handleDeletePartner(p.id)} className="p-2 text-slate-700 hover:text-rose-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
