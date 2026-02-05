
import React, { useState } from 'react';
import { UserTier } from '../types';

interface Props {
  onLogin: (email: string, pass: string, tier: UserTier) => void;
  onBack: () => void;
}

export const AuthView: React.FC<Props> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [selectedTier, setSelectedTier] = useState<UserTier>(UserTier.ALPHA_JUNIOR);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-20">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 p-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            {isLogin ? 'Bon retour parmis nous' : 'Créer mon compte'}
          </h2>
          <p className="text-slate-500 font-medium">Accédez à votre Radar Alpha</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(email, pass, selectedTier); }}>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email professionnel</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              placeholder="votre@email.com"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
            <input 
              type="password" 
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Plan souhaité</label>
              <select 
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as UserTier)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-700"
              >
                <option value={UserTier.MINI_BETA}>Plan Beta (21€/m)</option>
                <option value={UserTier.ALPHA_JUNIOR}>Alpha Junior (49€/m)</option>
                <option value={UserTier.ALPHA}>Plan Alpha (89€/m)</option>
              </select>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            {isLogin ? 'Se connecter' : 'Valider mon abonnement'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà membre ? Se connecter"}
          </button>
        </div>

        <button 
          onClick={onBack}
          className="mt-6 w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};
