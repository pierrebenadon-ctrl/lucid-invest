
import React from 'react';
import { User, UserTier } from '../types';

interface Props {
  user: User;
  onUpdateUser: (updatedData: Partial<User>) => void;
}

export const AccountView: React.FC<Props> = ({ user, onUpdateUser }) => {
  
  const handleStripePortal = () => {
    // Redirection vers le portail de facturation Stripe (Simulation)
    const stripePortalUrl = "https://billing.stripe.com/p/session/test_demo";
    console.log("Redirection Stripe Portal...");
    alert("Redirection vers le portail sécurisé Stripe pour gérer vos factures et votre moyen de paiement.");
    window.open(stripePortalUrl, '_blank');
  };

  const handleDeleteAccount = () => {
    if (confirm("Attention : Cette action est irréversible. Toutes vos données d'archive seront supprimées. Confirmer la suppression ?")) {
      onUpdateUser({ status: 'CANCELED' });
      alert("Demande de clôture enregistrée. Votre compte sera désactivé prochainement.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Mon Compte</h1>
        <p className="text-slate-500 font-medium italic">Gérez vos accès et vos préférences de facturation.</p>
      </div>

      <div className="grid gap-8">
        {/* SECTION : PROFIL */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-8">Informations Personnelles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email de connexion</label>
              <div className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 font-medium overflow-hidden text-ellipsis">
                {user.email}
              </div>
              <p className="mt-2 text-[10px] text-slate-400 italic">Contactez le support pour modifier votre email.</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
              <button className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold hover:bg-slate-50 transition-colors text-left flex justify-between items-center group">
                ••••••••••••
                <span className="text-indigo-600 text-[10px] uppercase group-hover:underline">Modifier</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION : ABONNEMENT */}
        <section className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block ${user.status === 'ACTIVE' ? 'bg-indigo-600' : 'bg-rose-600'}`}>
                {user.status === 'ACTIVE' ? 'Plan Actuel' : 'Statut Suspendu'}
              </span>
              <h3 className="text-3xl font-black tracking-tighter mb-2">
                {user.tier.replace('_', ' ')}
              </h3>
              <p className="text-slate-400 font-medium">
                {user.status === 'ACTIVE' ? 'Prochain prélèvement le 02 du mois prochain' : 'Abonnement en attente de régularisation'}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button 
                onClick={handleStripePortal}
                className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
              >
                Gérer ma facturation
              </button>
              <p className="text-center text-[9px] text-slate-500 uppercase font-black tracking-widest">Sécurisé par Stripe</p>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Analyses/mois</p>
              <p className="font-bold">{user.tier === UserTier.ALPHA ? '12' : user.tier === UserTier.ALPHA_JUNIOR ? '6' : '2'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Radar Crypto</p>
              <p className="font-bold">{user.hasCryptoOption ? 'Inclus ✓' : 'Non Inclus'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Accès Archives</p>
              <p className="font-bold">Illimité</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Support Alpha</p>
              <p className="font-bold">Prioritaire</p>
            </div>
          </div>
        </section>

        {/* SECTION : DANGER ZONE */}
        <section className="p-8 rounded-[2.5rem] border border-rose-100 bg-rose-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="text-sm font-black text-rose-900 uppercase tracking-tight">Zone de danger</h4>
            <p className="text-xs text-rose-700/60 font-medium">Résiliation de l'abonnement et suppression des données.</p>
          </div>
          <button 
            onClick={handleDeleteAccount}
            className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all w-full sm:w-auto"
          >
            Résilier / Supprimer
          </button>
        </section>
      </div>
    </div>
  );
};
