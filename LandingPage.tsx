
import React, { useState, useMemo, useEffect } from 'react';
import { getCurrentMonthYear } from '../services/automationService';

interface Props {
  onSelectPlan: (tier: any, hasCrypto: boolean) => void;
}

type Timeframe = 12 | 24 | 36;

export const LandingPage: React.FC<Props> = ({ onSelectPlan }) => {
  const [includeCrypto, setIncludeCrypto] = useState(false);
  const [timeframe, setTimeframe] = useState<Timeframe>(24);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { currentReport } = useMemo(() => {
    const now = new Date();
    const day = now.getDate();
    const isCurrentMonthAvailable = day >= 2;
    const availableMonth = isCurrentMonthAvailable 
      ? getCurrentMonthYear(0) 
      : getCurrentMonthYear(-1);
      
    return { currentReport: availableMonth };
  }, []);

  const dcaData = useMemo(() => {
    const data = [];
    const monthlyDeposit = 420;
    const monthlyRate = 0.042;
    let savings = 0;
    let portfolio = 0;
    for (let i = 0; i <= timeframe; i++) {
      if (i > 0) {
        savings += monthlyDeposit;
        portfolio = (portfolio + monthlyDeposit) * (1 + monthlyRate);
      }
      data.push({ month: i, savings, portfolio: Math.round(portfolio) });
    }
    return data;
  }, [timeframe]);

  const finalPortfolio = dcaData[dcaData.length - 1].portfolio;
  const finalSavings = dcaData[dcaData.length - 1].savings;
  const gain = finalPortfolio - finalSavings;

  const chartPoints = useMemo(() => {
    const width = 1000, height = 400, padding = 20;
    const chartWidth = width - padding * 2, chartHeight = height - padding * 2;
    const maxVal = finalPortfolio;
    const getX = (i: number) => padding + (i / timeframe) * chartWidth;
    const getY = (val: number) => (height - padding) - (val / maxVal) * chartHeight;
    const portfolioPath = dcaData.map((d, i) => `${getX(i)},${getY(d.portfolio)}`).join(' ');
    const savingsPath = dcaData.map((d, i) => `${getX(i)},${getY(d.savings)}`).join(' ');
    const portfolioArea = `${padding},${height - padding} ${portfolioPath} ${width - padding},${height - padding}`;
    const savingsArea = `${padding},${height - padding} ${savingsPath} ${width - padding},${height - padding}`;
    return { portfolioPath, savingsPath, portfolioArea, savingsArea, getX, getY };
  }, [dcaData, timeframe, finalPortfolio]);

  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const featuredTestimonials = [
    {
      name: "Marc D.", role: "Investisseur depuis 8 ans",
      text: "Enfin un outil qui ne me dit pas quoi acheter, mais qui m'explique POURQUOI je pourrais avoir tort. C'est ça la vraie valeur.",
      avatar: "M", color: "bg-indigo-600"
    },
    {
      name: "Sophie L.", role: "Cadre en Finance",
      text: "Le rapport mensuel est devenu ma lecture obligatoire du 2 du mois. Les points d'invalidation m'ont sauvé d'un mauvais trade sur la tech US.",
      avatar: "S", color: "bg-emerald-600"
    },
    {
      name: "Jean-Philippe R.", role: "Retraité actif",
      text: "La clarté des SWOT est impressionnante. On sent que l'IA LucidInvest va chercher des données que personne ne regarde.",
      avatar: "J", color: "bg-slate-800"
    },
    {
      name: "Elodie M.", role: "Auto-entrepreneuse",
      text: "Je n'avais aucune méthode avant LucidInvest. Aujourd'hui, j'investis sereinement sur des thèses solides sans FOMO.",
      avatar: "E", color: "bg-rose-600"
    }
  ];

  const extraTestimonials = [
    {
      name: "Thomas B.", role: "Trader Particulier",
      text: "L'option Crypto Boost est une pépite. Le scoring de lucidité sur les altcoins permet de filtrer 99% du bruit médiatique.",
      avatar: "T", color: "bg-amber-600"
    },
    {
      name: "Guillaume P.", role: "Ingénieur Tech",
      text: "Le dashboard est propre, les analyses sont froides. C'est exactement ce qu'il manquait aux investisseurs long terme.",
      avatar: "G", color: "bg-cyan-600"
    },
    {
      name: "Cédric K.", role: "Gestionnaire de Patrimoine",
      text: "J'utilise LucidInvest pour challenger mes propres convictions. La détection des menaces est chirurgicale.",
      avatar: "C", color: "bg-violet-600"
    },
    {
      name: "Isabelle F.", role: "Investisseuse Ethique",
      text: "Le radar Alpha m'aide à rester lucide sur les valorisations tech. Un outil de garde-fou indispensable.",
      avatar: "I", color: "bg-teal-600"
    }
  ];

  const nextExtra = () => setActiveTestimonial((prev) => (prev + 1) % extraTestimonials.length);
  const prevExtra = () => setActiveTestimonial((prev) => (prev - 1 + extraTestimonials.length) % extraTestimonials.length);

  useEffect(() => {
    const interval = setInterval(nextExtra, 8000);
    return () => clearInterval(interval);
  }, []);

  const plans = [
    { id: 'MINI_BETA', name: 'PLAN MINI BETA', price: 21, features: ['2 Incontournables / mois', 'Analyse SWOT Premium', 'Scénario Négatif détaillé', 'Points d\'invalidation'], btnText: 'ESSAI GRATUIT (2 PÉPITES)', popular: false, dark: false },
    { id: 'ALPHA_JUNIOR', name: 'ALPHA JUNIOR', price: 49, features: ['6 Opportunités / mois', 'Radar de Lucidité complet', 'Dossiers Mid-Caps Monde', 'Analyses sectorielles'], btnText: 'ESSAI GRATUIT (6 PÉPITES)', popular: true, dark: false },
    { id: 'ALPHA', name: 'PLAN ALPHA', price: 89, features: ['12 Opportunités / mois', 'Accès Archives Illimité', 'Score de Lucidité Max', 'Priorité Algorithmique'], btnText: 'ESSAI GRATUIT (12 PÉPITES)', popular: false, dark: true }
  ];

  const faqs = [
    { q: "Est-ce vraiment gratuit le premier mois ?", a: "Oui. Vous débloquez l'accès total à votre plan immédiatement. Si vous résiliez avant la fin des 30 jours, vous ne paierez absolument rien." },
    { q: "Puis-je résilier facilement ?", a: "Absolument. Un seul bouton dans votre espace client suffit. Pas de courrier, pas d'appel, pas de période d'engagement cachée." },
    { q: "Est-ce que LucidInvest donne des conseils ?", a: "Non. Nous fournissons des analyses de risques. Notre IA identifie les failles pour que vous puissiez décider en toute lucidité." },
    { q: "D'où viennent vos pépites ?", a: "Notre algorithme scanne plus de 50 000 actifs mondiaux pour ne retenir que les structures de risque les plus asymétriques." }
  ];

  return (
    <div className="bg-white selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* HERO SECTION */}
      <header className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 blur-3xl rounded-full opacity-50"></div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full mb-10 animate-in fade-in slide-in-from-top duration-700">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Offre Flash : Vos 12 premières opportunités offertes</span>
        </div>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-950 tracking-tighter leading-[0.9] mb-10">Le marché ne vous fera <br/><span className="text-indigo-600">aucun cadeau.</span></h1>
        <p className="text-xl md:text-3xl text-slate-500 max-w-4xl mx-auto mb-16 font-medium leading-tight">L'IA LucidInvest déshabille les marchés pour vous. <span className="text-slate-900 font-bold underline decoration-indigo-500 decoration-4">Zéro biais, 100% de lucidité.</span></p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button onClick={scrollToPricing} className="group relative px-12 py-6 bg-slate-950 text-white font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-indigo-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95 overflow-hidden">
            <span className="relative z-10">Prendre mes 12 pépites gratuites</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          <div className="text-left"><p className="text-sm font-black text-slate-900">Rapport de {currentReport} disponible</p><p className="text-xs text-indigo-600 font-black uppercase">Premier mois : 0€</p></div>
        </div>
      </header>

      {/* PAIN POINT SECTION */}
      <section className="bg-slate-950 py-32 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">Pourquoi 95% des investisseurs <span className="text-rose-500 underline decoration-8 underline-offset-8">échouent</span> ?</h2>
              <p className="text-slate-400 text-xl font-medium mb-12 leading-relaxed">Le bruit médiatique est votre pire ennemi. LucidInvest remplace l'émotion par une méthode de gestion de risque institutionnelle.</p>
              <div className="space-y-6">
                {[{ t: "La Cécité des Risques", d: "Vous ignorez ce qui peut casser votre thèse avant même d'entrer." }, { t: "L'Absence de Plan de Sortie", d: "Vous ne savez pas à quel prix précis vous avez eu tort." }, { t: "Le Biais Narratif", d: "Vous écoutez les histoires, nous regardons les structures." }].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500/20 transition-colors"><svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></div>
                    <div><h4 className="font-black text-white uppercase tracking-tight mb-1">{item.t}</h4><p className="text-sm text-slate-500 font-medium">{item.d}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <div className="relative bg-[#111827] border border-white/10 rounded-[4rem] p-12 shadow-2xl">
                <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6">L'AVANTAGE ALPHA</p>
                <h3 className="text-3xl font-black mb-10 leading-tight">Chaque mois, un dossier complet sur les 14 actifs les plus porteurs.</h3>
                <ul className="space-y-8">
                  {["12 Actions Mondiales (Tech, Santé, Énergie, Luxe)", "2 Cryptos leaders à fort potentiel", "Analyse SWOT froide et pragmatique", "Scénario Négatif et Points d'Invalidation"].map((text, i) => (
                    <li key={i} className="flex items-center gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-125 transition-transform"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg></div>
                      <span className="text-lg font-bold text-slate-200">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DCA / SIMULATION GRAPH */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Stratégie Alpha : 30€ par opportunité / mois</p>
            <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-6">Visualisez votre trajectoire <span className="text-indigo-600">Alpha.</span></h2>
            <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto">Comparaison entre votre capital déposé et la performance cible LucidInvest (Versement de 420€ / mois).</p>
          </div>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Horizon de temps</p>
                <div className="flex gap-2">
                  {[12, 24, 36].map((t) => (
                    <button key={t} onClick={() => setTimeframe(t as Timeframe)} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${timeframe === t ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-200'}`}>{t} mois</button>
                  ))}
                </div>
              </div>
              <div className="bg-indigo-600 text-white p-10 rounded-[3rem] shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Capital versé : {finalSavings.toLocaleString()}€</p>
                <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Plus-value simulée</p>
                <div className="text-5xl font-black tracking-tighter mb-2">+{gain.toLocaleString()} €</div>
              </div>
            </div>
            <div className="lg:col-span-8 bg-slate-50 p-10 rounded-[4rem] border border-slate-100 relative overflow-hidden h-[500px] flex flex-col">
               <div className="absolute top-10 left-10 flex flex-col gap-4 z-20">
                 <div className="flex items-center gap-3"><div className="w-8 h-1 bg-indigo-600 rounded-full"></div><span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Valeur Portefeuille Lucid</span></div>
                 <div className="flex items-center gap-3"><div className="w-8 h-1 bg-slate-300 rounded-full"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capital Déposé (420€/m)</span></div>
               </div>
               <div className="flex-1 w-full relative mt-16">
                 <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                   {[0.25, 0.5, 0.75, 1].map((p, i) => (<line key={i} x1="0" y1={400 - (p * 400)} x2="1000" y2={400 - (p * 400)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />))}
                   <polygon points={chartPoints.savingsArea} fill="rgba(203, 213, 225, 0.15)"/><polyline points={chartPoints.savingsPath} fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                   <polygon points={chartPoints.portfolioArea} fill="rgba(79, 70, 229, 0.1)"/><polyline points={chartPoints.portfolioPath} fill="none" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg" />
                   {dcaData.filter((_, i) => i % Math.floor(timeframe/6) === 0).map((d, i) => (<circle key={i} cx={chartPoints.getX(d.month)} cy={chartPoints.getY(d.portfolio)} r="6" fill="#4f46e5" stroke="white" strokeWidth="2" />))}
                 </svg>
               </div>
               <div className="flex justify-between mt-4 px-4 border-t border-slate-200 pt-4">{[0, timeframe/2, timeframe].map((m) => (<span key={m} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{Math.round(m)} mois</span>))}</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter mb-6">Investissez sans <span className="text-indigo-600">aucun risque.</span></h2>
            <p className="text-xl text-slate-500 font-medium">Premier mois offert. Vos 12 premières opportunités gratuites. Sans engagement.</p>
          </div>
          <div className="mb-16 flex justify-center">
            <button onClick={() => setIncludeCrypto(!includeCrypto)} className={`flex flex-col sm:flex-row items-center gap-8 p-8 rounded-[3.5rem] border-2 transition-all group ${includeCrypto ? 'border-indigo-500 bg-indigo-50 shadow-2xl' : 'border-slate-100 bg-white shadow-sm hover:border-slate-200'}`}>
              <div className={`w-16 h-9 rounded-full p-1.5 transition-all flex-shrink-0 ${includeCrypto ? 'bg-indigo-600' : 'bg-slate-200'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform ${includeCrypto ? 'translate-x-7' : ''}`}></div></div>
              <div className="text-center sm:text-left"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">Option Crypto Boost (+12€/mois après essai)</p><p className="text-lg font-black text-slate-900">Inclure 2 dossiers Cryptos exclusifs <span className="text-indigo-600">(Offert ce mois)</span></p></div>
            </button>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-20">
            {plans.map((plan) => (
              <div key={plan.id} className={`p-12 rounded-[4rem] flex flex-col items-center relative transition-all duration-500 ${plan.popular ? 'border-4 border-indigo-500 shadow-2xl lg:scale-105 z-10 bg-white' : plan.dark ? 'bg-[#0A0F1D] text-white border-4 border-transparent shadow-2xl' : 'bg-white border border-slate-100 shadow-sm'}`}>
                {plan.popular && <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">Recommandé</div>}
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-12 ${plan.dark ? 'text-indigo-400' : 'text-indigo-600'}`}>{plan.name}</h3>
                <div className="flex flex-col items-center mb-12">
                  <div className="flex items-baseline gap-2"><span className="text-7xl font-black tracking-tighter">0€</span><span className="text-xl text-indigo-500 font-black">/30 jours</span></div>
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Puis {plan.price + (includeCrypto ? 12 : 0)}€ / mois</p>
                </div>
                <ul className="space-y-6 w-full mb-12">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-sm font-bold text-left">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0"><svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg></div>
                      <span className={plan.dark ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => onSelectPlan(plan.id, includeCrypto)} className={`mt-auto w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${plan.dark ? 'bg-indigo-600 text-white hover:bg-indigo-500' : plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-950 text-white hover:bg-black'}`}>{plan.btnText}</button>
                <p className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Zéro engagement. Annulable en ligne.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-left">
          <div className="text-center mb-20">
            <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Informations & Aide</p>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 text-center uppercase">Questions Fréquentes</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 bg-slate-50 p-12 md:p-20 rounded-[5rem] shadow-sm border border-slate-100">
            {faqs.map((faq, i) => (
              <div key={i} className="group">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-3 flex items-center gap-3"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>{faq.q}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION - MOVED BELOW FAQ */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">La voix des lucides</p>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">Ils ont choisi la <span className="text-indigo-600">lucidité.</span></h2>
            <p className="text-xl text-slate-500 font-medium italic max-w-2xl mx-auto">Rejoignez des milliers d'investisseurs qui privilégient la méthode au bruit médiatique.</p>
          </div>

          {/* Featured Grid (4 Fixed Premium Reviews) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {featuredTestimonials.map((t, i) => (
              <div key={i} className="p-8 bg-white rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${t.color} rounded-2xl flex items-center justify-center text-white font-black shadow-lg`}>
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed italic flex-1">"{t.text}"</p>
                <div className="mt-4 flex gap-1">
                  {[1,2,3,4,5].map(s => <svg key={s} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Testimonials - Stylized Immersive Carousel */}
          <div className="relative pt-20 border-t border-slate-200">
             <div className="text-center mb-12">
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Histoires de Succès</span>
             </div>
             
             <div className="max-w-4xl mx-auto bg-indigo-600 rounded-[5rem] p-4 md:p-12 relative shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] border-8 border-indigo-500/50">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-700 ease-in-out" 
                    style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
                  >
                    {extraTestimonials.map((t, i) => (
                      <div key={i} className="w-full flex-shrink-0 px-8 py-10 text-center flex flex-col items-center">
                        <svg className="w-12 h-12 text-indigo-400 opacity-50 mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14H15.017C13.3599 14 12.017 12.6571 12.017 11V7C12.017 5.3429 13.3599 4 15.017 4H19.017C20.6741 4 22.017 5.3429 22.017 7V11C22.017 12.6571 20.6741 14 19.017 14V16C20.1216 16 21.017 16.8954 21.017 18V21H14.017ZM2.017 21L2.017 18C2.017 16.8954 2.91243 16 4.017 16H7.017V14H3.017C1.35985 14 0.0169983 12.6571 0.0169983 11V7C0.0169983 5.3429 1.35985 4 3.017 4H7.017C8.67415 4 10.017 5.3429 10.017 7V11C10.017 12.6571 8.67415 14 7.017 14V16C8.12157 16 9.017 16.8954 9.017 18V21H2.017Z"/></svg>
                        <p className="text-xl md:text-3xl text-white font-medium leading-relaxed italic mb-10 max-w-2xl">"{t.text}"</p>
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 font-black text-2xl mb-4 shadow-2xl">
                            {t.avatar}
                          </div>
                          <h4 className="font-black text-white text-lg">{t.name}</h4>
                          <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">{t.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Navigation Buttons */}
                <button 
                  onClick={prevExtra}
                  className="absolute top-1/2 -left-4 md:-left-16 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-indigo-600 hover:scale-110 active:scale-90 transition-all z-20 group"
                >
                  <svg className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button 
                  onClick={nextExtra}
                  className="absolute top-1/2 -right-4 md:-right-16 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-indigo-600 hover:scale-110 active:scale-90 transition-all z-20 group"
                >
                  <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                </button>

                {/* Carousel Dots */}
                <div className="flex justify-center gap-3 mt-8">
                  {extraTestimonials.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveTestimonial(i)}
                      className={`h-2 rounded-full transition-all duration-500 ${activeTestimonial === i ? 'w-12 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    />
                  ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-indigo-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-[0.9]">Prêt à voir ce que les autres ignorent ?</h2>
          <p className="text-2xl font-medium mb-16 opacity-90">Accès immédiat au rapport de {currentReport.split(' ')[0]}. Premier mois offert.</p>
          <button onClick={scrollToPricing} className="px-16 py-8 bg-white text-indigo-600 font-black text-base uppercase tracking-[0.2em] rounded-[2.5rem] hover:scale-105 transition-all shadow-2xl active:scale-95">Commencer mon essai gratuit</button>
        </div>
      </section>

      <footer className="bg-slate-950 py-20 text-center border-t border-white/5">
        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg></div>
        <p className="text-xs text-slate-500 font-black uppercase tracking-[0.5em] mb-4">© 2025 LucidInvest Analytics.</p>
        <p className="text-[10px] text-slate-700 max-w-2xl mx-auto leading-relaxed uppercase font-bold px-6">LucidInvest n'est pas un conseiller financier. Chaque investissement comporte un risque de perte en capital.</p>
      </footer>
    </div>
  );
};
