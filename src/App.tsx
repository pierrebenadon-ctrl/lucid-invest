
import React, { useState, useEffect, useMemo } from 'react';
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
const MOCK_ADMIN_PASS = "Lepapou77!";

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<StockAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [globalAnalyses, setGlobalAnalyses] = useState<StockAnalysis[]>([]);

  useEffect(() => {
    const initApp = async () => {
      const currentAnalyses = dbService.getAnalyses();
      setAllUsers(dbService.getUsers());
      setGlobalAnalyses(currentAnalyses);
      
      const sessionUser = dbService.getCurrentUser();
      if (sessionUser) {
        setUser(sessionUser);
        setView(sessionUser.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD');
      }

      const checkSync = async () => {
        const now = new Date();
        const currentMonth = getCurrentMonthYear();
        const hasAnalyses = currentAnalyses.some(a => a.lastUpdate === currentMonth);

        if (sessionUser?.role === 'ADMIN' && (now.getDate() === 2 || !hasAnalyses)) {
          setIsLoading(true);
          try {
            const isForced = !hasAnalyses;
            const didSync = await automationService.checkAndSyncMonthlyReport((msg) => setSyncMessage(msg), isForced);
            if (didSync) {
              setGlobalAnalyses(dbService.getAnalyses());
            }
          } catch (e) {
            console.error("Sync Error:", e);
          } finally {
            setIsLoading(false);
            setSyncMessage('');
          }
        }
      };

      if (sessionUser) {
        checkSync();
      }
    };

    initApp();
  }, [user?.role]);

  // Filtrage robuste par Tier et par Option Crypto
  const getFilteredAnalyses = useMemo(() => {
    if (!user) return [];
    
    return globalAnalyses.filter(a => {
      // 1. Définition des limites de visibilité par Tier
      let limit = 2; // MINI_BETA
      if (user.tier === UserTier.ALPHA) limit = 12;
      if (user.tier === UserTier.ALPHA_JUNIOR) limit = 6;

      // 2. Filtrage des opportunités par rang d'importance
      const isVisibleByRank = a.importanceRank <= limit;

      // 3. Gestion spécifique de l'option Crypto
      if (a.sector === 'CRYPTO') {
        return user.hasCryptoOption && isVisibleByRank;
      }

      return isVisibleByRank;
    });
  }, [user, globalAnalyses]);

  const handleLogin = async (email: string, pass: string, tier: UserTier) => {
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase()) && pass === MOCK_ADMIN_PASS;
    
    if (isAdmin) {
      const admin: User = { 
        id: 'admin', email, tier: UserTier.ALPHA, role: 'ADMIN', 
        status: 'ACTIVE', hasCryptoOption: true, alphaOppsRemaining: 999,
        trackedOpportunities: [], claimedMonths: [], signupDate: '01/01/2025'
      };
      dbService.saveUser(admin);
      setUser(admin);
      dbService.setSession(admin);
      setView('ADMIN');
      return;
    }

    let existingUser = dbService.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!existingUser) {
      existingUser = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email, tier, hasCryptoOption: false, role: 'USER',
        alphaOppsRemaining: 1, 
        trackedOpportunities: [], claimedMonths: [],
        status: 'ACTIVE', signupDate: new Date().toLocaleDateString('fr-FR')
      };
      dbService.saveUser(existingUser);
      setAllUsers(dbService.getUsers());
    }
    
    setUser(existingUser);
    dbService.setSession(existingUser);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    dbService.setSession(null);
    setView('LANDING');
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    dbService.saveUser(updated);
    setAllUsers(dbService.getUsers());
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white font-['Inter']">
      <Navbar view={view} setView={setView} user={user} onLogout={handleLogout} onAuthClick={() => setView('AUTH')} />
      
      <main className="pt-16">
        {view === 'LANDING' && <LandingPage onSelectPlan={(t, c) => setView('AUTH')} />}
        {view === 'AUTH' && <AuthView onLogin={handleLogin} onBack={() => setView('LANDING')} />}
        {view === 'DASHBOARD' && user && (
          <DashboardView 
            user={user} 
            globalAnalyses={getFilteredAnalyses}
            setView={setView} 
            onReadThesis={(a) => { setSelectedAnalysis(a); setView('ANALYSIS'); }} 
          />
        )}
        {view === 'ACCOUNT' && user && (
          <AccountView 
            user={user} 
            onUpdateUser={handleUpdateUser} 
          />
        )}
        {view === 'ANALYSIS' && selectedAnalysis && <AnalysisView analysis={selectedAnalysis} onBack={() => setView('DASHBOARD')} />}
        {view === 'ALPHA_OPPORTUNITIES' && user && (
          <AlphaOpportunitiesView 
            opportunities={getFilteredAnalyses.filter(a => a.lastUpdate === getCurrentMonthYear())} 
            onBack={() => setView('DASHBOARD')} 
          />
        )}
        {view === 'GUIDE' && <GuideView />}
        {view === 'ADMIN' && user?.role === 'ADMIN' && (
          <AdminBackoffice 
            users={allUsers} 
            analyses={globalAnalyses} 
            onAddAnalysis={(a) => setGlobalAnalyses(dbService.saveAnalysis(a))}
            onDeleteAnalysis={(t, m) => setGlobalAnalyses(dbService.deleteAnalysis(t, m))}
            onBack={() => setView('DASHBOARD')} 
          />
        )}
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-3xl flex flex-col items-center justify-center z-[100] animate-in fade-in duration-500">
          <div className="relative mb-12">
            <div className="w-40 h-40 border-8 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 w-40 h-40 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-4xl font-black text-indigo-600 tracking-tighter">L</span>
            </div>
          </div>
          <div className="text-center px-6">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-[0.4em] mb-4">Radar Alpha</h3>
            <p className="text-indigo-600 font-bold italic animate-pulse text-lg">{syncMessage || "Vérification du rapport mensuel..."}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
