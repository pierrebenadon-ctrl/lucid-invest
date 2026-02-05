import React, { useState, useEffect } from 'react';
// Imports des composants - VERIFIE BIEN LES MAJUSCULES SUR GITHUB
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { Navbar } from './components/Navbar';
import { ViewState, User, UserTier, StockAnalysis } from './types';

const ADMIN_EMAILS = ['pierre.benadon@gmail.com'];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [globalAnalyses, setGlobalAnalyses] = useState<StockAnalysis[]>([]);

  // Simulation de chargement des données
  useEffect(() => {
    setGlobalAnalyses([
      { ticker: 'NVDA', name: 'Nvidia', sector: 'TECH', importanceRank: 1, lastUpdate: '02/2026', thesis: 'IA Boom' },
      { ticker: 'BTC', name: 'Bitcoin', sector: 'CRYPTO', importanceRank: 2, lastUpdate: '02/2026', thesis: 'Digital Gold' }
    ]);
  }, []);

  const handleLogin = (email: string) => {
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const newUser: User = {
      id: '1',
      email,
      tier: UserTier.ALPHA,
      role: isAdmin ? 'ADMIN' : 'USER',
      status: 'ACTIVE',
      hasCryptoOption: true,
      alphaOppsRemaining: 5,
      trackedOpportunities: [],
      claimedMonths: [],
      signupDate: '05/02/2026'
    };
    setUser(newUser);
    setView('DASHBOARD');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar view={view} setView={setView} user={user} onLogout={() => {setUser(null); setView('LANDING');}} />
      
      <main className={view === 'LANDING' ? '' : 'pt-20'}>
        {view === 'LANDING' && <LandingPage onSelectPlan={() => setView('AUTH')} />}
        
        {view === 'AUTH' && (
          <AuthView onLogin={handleLogin} onBack={() => setView('LANDING')} />
        )}

        {view === 'DASHBOARD' && user && (
          <DashboardView 
            user={user} 
            globalAnalyses={globalAnalyses} 
            setView={setView}
            onReadThesis={(a) => console.log(a)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
