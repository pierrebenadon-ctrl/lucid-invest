import React, { useState } from 'react';
import { TrendingUp, Shield, Zap, Search } from 'lucide-react';

function App() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter">LUCID INVEST</span>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition">
          Connexion
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto pt-24 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          L'investissement <br />
          <span className="text-blue-500">enfin lucide.</span>
        </h1>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
          Analysez vos actifs, détectez les opportunités et gérez votre patrimoine avec la puissance de l'IA générative.
        </p>

        {/* Search / AI Bar */}
        <div className="relative max-w-2xl mx-auto mb-20">
          <input 
            type="text"
            placeholder="Posez une question sur vos investissements..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 pl-14 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-xl hover:bg-blue-500 transition">
            <Zap size={20} fill="currentColor" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Shield className="text-blue-500 mb-4" size={28} />
            <h3 className="font-semibold mb-2">Sécurité maximale</h3>
            <p className="text-sm text-gray-400">Vos données sont chiffrées et stockées via Supabase.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <TrendingUp className="text-blue-500 mb-4" size={28} />
            <h3 className="font-semibold mb-2">Analyse Temps Réel</h3>
            <p className="text-sm text-gray-400">Suivez l'évolution de vos portefeuilles en un clin d'œil.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Zap className="text-blue-500 mb-4" size={28} />
            <h3 className="font-semibold mb-2">IA Prédictive</h3>
            <p className="text-sm text-gray-400">Gemini analyse les tendances du marché pour vous.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
