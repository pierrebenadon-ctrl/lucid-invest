import React, { useState } from 'react';

// --- TYPES ---
type ViewState = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'ACCOUNT' | 'ANALYSIS' | 'GUIDE' | 'ADMIN' | 'ALPHA_OPPORTUNITIES';
enum UserTier { ALPHA = 'ALPHA', ALPHA_JUNIOR = 'ALPHA_JUNIOR', MINI_BETA = 'MINI_BETA' }
interface User {
  id: string; email: string; tier: UserTier; role: 'ADMIN' | 'USER';
  status: 'ACTIVE'; hasCryptoOption: boolean; alphaOppsRemaining: number;
  trackedOpportunities: string[]; claimedMonths: string[]; signupDate: string;
}
interface StockAnalysis {
  ticker: string; name: string; sector: string; importanceRank: number; lastUpdate: string; thesis: string;
}

// --- MOCK SERVICES ---
const getCurrentMonthYear = () => `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
const dbService = {
  getAnalyses: () => [
    { ticker: 'NVDA', name: 'Nvidia', sector: 'TECH', importanceRank: 1, lastUpdate: getCurrentMonthYear(), thesis: 'Domination totale sur le secteur des puces IA.' },
    { ticker: 'BTC', name: 'Bitcoin', sector: 'CRYPTO', importanceRank: 2, lastUpdate: getCurrentMonthYear(), thesis: 'Actif de réserve numérique en pleine adoption.' }
  ]
};

// --- COMPOSANTS ---
const Navbar = ({ setView, user, onLogout }: any) => (
  <nav className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-6 flex justify-between items-center">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
      <div className="bg-indigo-600 p-1.5 rounded-lg text-white font-bold">L</div>
      <span className="font-black text-xl tracking-tighter text-slate-900">LUCID INVEST</span>
    </div>
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <button onClick={() => setView('DASHBOARD')} className="text-sm font-medium text-slate-600 hover:text-indigo-600">Dashboard</button>
          <button onClick={onLogout} className="text-sm font-bold text-red-500">Quitter</button>
        </>
      ) : (
        <button onClick={() => setView('AUTH')} className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold">Connexion</button>
      )}
    </div>
  </nav>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [globalAnalyses] = useState<StockAnalysis[]>(dbService.getAnalyses());

  const handleLogin = (email: string) => {
    const newUser: User = {
      id: '1', email, tier: UserTier.ALPHA, role: 'USER', status: 'ACTIVE',
      hasCryptoOption: true, alphaOppsRemaining: 5, trackedOpportunities: [],
      claimedMonths: [], signupDate: '05/02/2026'
    };
    setUser(newUser);
    setView('DASHBOARD');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar setView={setView} user={user} onLogout={() => {setUser(null); setView('LANDING');}} />
      
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {view === 'LANDING' && (
          <div className="text-center py-20">
            <h1 className="text-6xl font-black tracking-tight mb-6">L'investissement <span className="text-indigo-600">Lucide.</span></h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">Prenez une longueur d'avance sur le marché avec nos analyses exclusives.</p>
            <button onClick={() => setView('AUTH')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition">DEMARRER L'ANALYSE</button>
          </div>
        )}

        {view === 'AUTH' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
            <input type="email" placeholder="votre@email.com" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 outline-none" defaultValue="user@test.com" />
            <button onClick={() => handleLogin('user@test.com')} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Accéder au Dashboard</button>
          </div>
        )}

        {view === 'DASHBOARD' && user && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Tableau de Bord</h2>
                <p className="text-slate-500 font-medium">Session : {user.email}</p>
              </div>
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">{user.tier}</div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {globalAnalyses.map(a => (
                <div key={a.ticker} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col">
                  <div className="flex justify-between mb-4">
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">{a.sector}</span>
                    <span className="text-indigo-600 font-black tracking-tighter">{a.ticker}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{a.name}</h3>
                  <p className="text-sm text-slate-500 mb-6 italic leading-relaxed">"{a.thesis}"</p>
                  <button className="mt-auto w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition">Lire la Thèse</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
