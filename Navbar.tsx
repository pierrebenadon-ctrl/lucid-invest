
import React from 'react';
import { ViewState, User } from '../types';

interface Props {
  view: ViewState;
  setView: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
  onAuthClick: () => void;
}

export const Navbar: React.FC<Props> = ({ view, setView, user, onLogout, onAuthClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button 
          onClick={() => setView('LANDING')}
          className="flex items-center gap-2 group hover:opacity-80 transition-all"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">LucidInvest</span>
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('LANDING')}
            className={`text-xs font-black uppercase tracking-widest transition-colors ${view === 'LANDING' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Accueil
          </button>
          
          <button 
            onClick={() => setView('GUIDE')}
            className={`text-xs font-black uppercase tracking-widest transition-colors ${view === 'GUIDE' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Comment acheter ?
          </button>

          {user ? (
            <>
              <div className="w-px h-4 bg-slate-200 mx-2 hidden sm:block"></div>
              
              {user.role === 'ADMIN' && (
                <button 
                  onClick={() => setView('ADMIN')}
                  className={`text-xs font-black uppercase tracking-widest transition-colors hidden sm:block px-3 py-1 bg-indigo-50 rounded-lg ${view === 'ADMIN' ? 'text-indigo-600' : 'text-indigo-400 hover:text-indigo-600'}`}
                >
                  Admin
                </button>
              )}

              <button 
                onClick={() => setView('DASHBOARD')}
                className={`text-xs font-black uppercase tracking-widest transition-colors hidden sm:block ${view === 'DASHBOARD' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Dashboard
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setView('ACCOUNT')}>
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-indigo-600">{user.email[0].toUpperCase()}</span>
                </div>
                <span className="text-[9px] font-black text-slate-700 uppercase">{user.tier.replace('_', ' ')}</span>
              </div>
              <button 
                onClick={onLogout}
                className="text-[9px] font-black text-slate-400 uppercase hover:text-rose-500 transition-colors"
              >
                Off
              </button>
            </>
          ) : (
            <button 
              onClick={onAuthClick}
              className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
            >
              Connexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
