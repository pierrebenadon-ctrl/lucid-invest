
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Partner } from '../types';

export const GuideView: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    setPartners(dbService.getPartners());
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-50 rounded-full mb-6 border border-indigo-100">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Guide d'investissement</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
          Comment acheter<br/> vos premières actions ?
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
          "Vous êtes nombreux à nous demander où ouvrir un compte bourse et comment s'y prendre concrètement. LucidInvest vous propose une sélection rigoureuse des meilleures plateformes."
        </p>
      </header>

      <section className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-indigo-100">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Transparence & Sécurité</h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Nous jouons la carte de la transparence totale : <span className="text-slate-900 font-bold">LucidInvest est parfois affilié à certains de ces organismes.</span> Cependant, chaque plateforme listée ici a été <span className="text-slate-900 font-bold">rigoureusement testée</span>.
            </p>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {partners.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">Aucun partenaire configuré pour le moment.</div>
        ) : partners.map((broker, idx) => (
          <div key={idx} className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner ${broker.color}`}>
                  {broker.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{broker.name}</h3>
                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{broker.type}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8 flex-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Point Fort</p>
              <p className="text-slate-900 font-bold text-base leading-tight mb-3">{broker.strength}</p>
              <p className="text-slate-500 font-medium text-xs leading-relaxed">{broker.description}</p>
            </div>

            <a 
              href={broker.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
            >
              {broker.cta}
            </a>
          </div>
        ))}
      </div>

      <section className="text-center bg-slate-900 rounded-[3rem] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 leading-tight">
          Tester pour mieux investir.
        </h2>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-10">
          En bourse, l'ergonomie et les frais varient. Nous vous conseillons de tester au moins deux interfaces pour trouver celle qui correspond à votre psychologie.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">PEA</span>
            <p className="text-xs font-bold">Actions Européennes (Fiscalité douce)</p>
          </div>
          <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">CTO</span>
            <p className="text-xs font-bold">Actions US & Marchés Mondiaux</p>
          </div>
        </div>
      </section>
    </div>
  );
};
