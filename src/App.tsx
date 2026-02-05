import React, { useState, useEffect } from 'react';

// --- TYPES ---
type ViewState = 'LANDING' | 'AUTH' | 'DASHBOARD';
interface User { email: string; tier: string; }

// --- COMPOSANT NAVBAR ---
const Navbar = ({ setView, user }: any) => (
  <nav className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-6 flex justify-between items-center">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
      <div className="bg-indigo-600 p-2 rounded-lg text-white font-bold">L</div>
      <span className="font-black text-xl tracking-tighter text-slate-900">LUCID INVEST</span>
    </div>
    <div>
      {user ? (
        <button onClick={() => setView('DASHBOARD')} className="text-sm font-bold text-indigo-600">Mon Dashboard</button>
      ) : (
        <button onClick={() => setView('AUTH')} className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold">Connexion</button>
      )}
    </div>
  </nav>
);

// --- COMPOSANT LANDING ---
const LandingPage = ({ onStart }: any) => (
  <div className="text-center py-20 animate-in fade-in duration-700">
    <h1 className="text-6xl font-black tracking-tight mb-6">L'investissement <span className="text-indigo-600">Lucide.</span></h1>
    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">Le radar Alpha pour détecter les opportunités avant tout le monde.</p>
    <button onClick={onStart} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition">DEMARRER MAINTENANT</button>
  </div>
);

// --- MAIN APP ---
export default function App() {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    setUser({ email: 'investisseur@lucide.fr', tier: 'ALPHA' });
    setView('DASHBOARD');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar setView={setView} user={user} />
      
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {view === 'LANDING' && <LandingPage onStart={() => setView('AUTH')} />}

        {view === 'AUTH' && (
          <div className="max-w-md mx-auto bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
            <input type="email" placeholder="email@exemple.com" className="w-full p-4 bg-slate-50 border rounded-xl mb-4" />
            <button onClick={handleLogin} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Accéder au Radar</button>
          </div>
        )}

        {view === 'DASHBOARD' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black mb-8">Tableau de Bord Alpha</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-indigo-600">TECH</span>
                <h3 className="text-xl font-bold mt-2">NVIDIA (NVDA)</h3>
                <p className="text-slate-500 mt-4 text-sm">Analyse en cours : Les puces Blackwell dominent le marché.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-amber-600">CRYPTO</span>
                <h3 className="text-xl font-bold mt-2">BITCOIN (BTC)</h3>
                <p className="text-slate-500 mt-4 text-sm">Objectif 100k : Analyse des flux institutionnels.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
