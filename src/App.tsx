import React, { useState, useEffect, useMemo } from 'react';
// Import des composants que tu as dans ton dossier /components
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { AccountView } from './components/AccountView';
import { AnalysisView } from './components/AnalysisView';
import { GuideView } from './components/GuideView';
import { AdminBackoffice } from './components/AdminBackoffice';
import { AlphaOpportunitiesView } from './components/AlphaOpportunitiesView';
import { Navbar } from './components/Navbar';

import { ViewState, User, UserTier, StockAnalysis } from './types';
import { dbService } from './services/dbService';
import { automationService, getCurrentMonthYear } from './services/automationService';

const ADMIN_EMAILS = ['pierre.benadon@gmail.com', 'admin@lucidinvest.fr'];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<StockAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalAnalyses, setGlobalAnalyses] = useState<StockAnalysis[]>([]);

  // Initialisation des données au chargement
  useEffect(() => {
    const initApp = async () => {
      const currentAnalyses = dbService.getAnalyses();
      setGlobalAnalyses(currentAnalyses);
      
      const sessionUser = dbService.getCurrentUser();
      if (sessionUser) setUser(sessionUser);
    };
    initApp();
  }, []);

  // Gestion de la connexion
  const handleLogin = (email: string, pass: string, tier: UserTier) => {
    setIsLoading(true);
    setTimeout(() => {
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        tier: isAdmin ? UserTier.ALPHA : tier,
        role: isAdmin ? 'ADMIN' : 'USER',
        status: 'ACTIVE',
        hasCryptoOption: true,
        alphaOppsRemaining: 5,
        trackedOpportunities: [],
        claimedMonths: [getCurrentMonthYear()],
        signupDate: new Date().toLocaleDateString()
      };
      setUser(newUser);
      dbService.saveUser(newUser);
      dbService.setSession(newUser);
      setView('DASHBOARD');
      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    dbService.logout();
    setUser(null);
    setView('LANDING');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        view={view} 
        setView={setView} 
        user={user} 
        onLogout={handleLogout} 
        onAuthClick={() => setView('AUTH')} 
      />

      <main className={view === 'LANDING' || view === 'ALPHA_OPPORTUNITIES' ? '' : 'pt-20'}>
        {view === 'LANDING' && (
          <LandingPage onSelectPlan={(tier) => {
            if (user) {
              setView('DASHBOARD');
            } else {
              setView('AUTH');
            }
          }} />
        )}

        {view === 'AUTH' && (
          <AuthView 
            onLogin={handleLogin} 
            onBack={() => setView('LANDING')} 
          />
        )}

        {view === 'DASHBOARD' && user && (
          <DashboardView 
            user={user} 
            globalAnalyses={globalAnalyses} 
            setView={setView}
            onReadThesis={(analysis) => {
              setSelectedAnalysis(analysis);
              setView('ANALYSIS');
            }}
          />
        )}

        {view === 'ANALYSIS' && selectedAnalysis && (
          <AnalysisView 
            analysis={selectedAnalysis} 
            onBack={() => setView('DASHBOARD')} 
          />
        )}

        {view === 'ACCOUNT' && user && (
          <AccountView 
            user={user} 
            onUpdateUser={(updated) => setUser({ ...user, ...updated })} 
          />
        )}

        {view === 'GUIDE' && <GuideView />}

        {view === 'ADMIN' && user?.role === 'ADMIN' && (
          <AdminBackoffice 
            users={[]} 
            analyses={globalAnalyses} 
            onAddAnalysis={(a) => setGlobalAnalyses(dbService.saveAnalysis(a))}
            onDeleteAnalysis={(t, m) => setGlobalAnalyses(dbService.deleteAnalysis(t, m))}
            onBack={() => setView('DASHBOARD')} 
          />
        )}
      </main>

      {/* Loader stylisé LucidInvest */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center z-[100]">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-black text-indigo-600 uppercase tracking-widest">Chargement LucidInvest...</p>
        </div>
      )}
    </div>
  );
};

export default App;
