import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

// --- APPLICATION ---
const App = () => {
  const [view, setView] = useState('LANDING');
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    setUser({ email: "investisseur@lucid.fr" });
    setView('DASHBOARD');
  };

  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md border-b flex justify-between items-center px-8 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
          <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-black">L</div>
          <span className="font-black text-xl tracking-tighter">LUCID INVEST</span>
        </div>
        <button onClick={() => setView('AUTH')} className="text-sm font-bold text-slate-600 hover:text-indigo-600">
          {user ? user.email : "Connexion"}
        </button>
      </nav>

      <main className="pt-32 px-6 max-w-6xl mx-auto">
        {/* VUE : LANDING */}
        {view === 'LANDING' && (
          <div className="text-center">
            <h1 className="text-7xl font-black mb-8 leading-tight">L'investissement<br/><span className="text-indigo-600">Lucide.</span></h1>
            <p className="text-xl text-slate-500 mb-12 max-w-xl mx-auto">Détectez les opportunités de marché avant l'explosion grâce au Radar Alpha.</p>
            <button onClick={() => setView('AUTH')} className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition">ACCÉDER AU RADAR</button>
          </div>
        )}

        {/* VUE : AUTH */}
        {view === 'AUTH' && (
          <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
            <h2 className="text-3xl font-black mb-8 text-center">Bienvenue</h2>
            <div className="space-y-4">
              <input type="email" placeholder="Email" className="w-full p-5 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600" />
              <button onClick={handleLogin} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg">SE CONNECTER</button>
            </div>
          </div>
        )}

        {/* VUE : DASHBOARD */}
        {view === 'DASHBOARD' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black">RADAR <span className="text-indigo-600">ALPHA</span></h2>
              <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-bold text-sm uppercase tracking-widest">Plan Alpha</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-black uppercase">Technologie</span>
                  <span className="text-indigo-600 font-black text-xl">NVDA</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">NVIDIA Corporation</h3>
                <p className="text-slate-500 mb-8 italic">"Domination confirmée sur le segment IA Blackwell, le cycle ne fait que commencer."</p>
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Ouvrir la thèse</button>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-[10px] font-black uppercase">Crypto</span>
                  <span className="text-indigo-600 font-black text-xl">BTC</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Bitcoin</h3>
                <p className="text-slate-500 mb-8 italic">"Phase d'accumulation institutionnelle majeure détectée sur les ETF."</p>
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Ouvrir la thèse</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Injection dans le DOM
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);

export default App;
