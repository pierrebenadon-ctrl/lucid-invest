
import { User, StockAnalysis, UserTier, Partner } from '../types';

// Protection pour l'exécution côté serveur (SSR / Edge Functions)
const isBrowser = typeof window !== 'undefined';
const safeStorage = {
  getItem: (key: string) => isBrowser ? localStorage.getItem(key) : null,
  setItem: (key: string, value: string) => { if (isBrowser) localStorage.setItem(key, value); },
  removeItem: (key: string) => { if (isBrowser) localStorage.removeItem(key); }
};

const DB_KEYS = {
  USERS: 'lucid_db_users',
  ANALYSES: 'lucid_db_analyses',
  PARTNERS: 'lucid_db_partners',
  SESSION: 'lucid_db_session',
  MONTHLY_TARGETS: 'lucid_db_monthly_targets',
  LAST_SYNC: 'lucid_db_last_sync'
};

const DEFAULT_PARTNERS: Partner[] = [
  {
    id: '1',
    name: "Boursorama Bank",
    color: "bg-[#E6192E]",
    type: "Banque Française (PEA/CTO)",
    strength: "Idéal pour le PEA. Leader français.",
    description: "Le choix de référence pour les investisseurs français souhaitant optimiser leur fiscalité via le PEA. Interface complète et robuste.",
    cta: "Ouvrir un compte",
    link: "https://www.boursorama.com"
  },
  {
    id: '2',
    name: "Fortuneo",
    color: "bg-[#1E3932]",
    type: "Banque Française (PEA/CTO)",
    strength: "Frais compétitifs sur Euronext.",
    description: "Alternative solide à Boursorama, souvent citée pour ses tarifs agressifs sur les ordres de petite taille et sa gestion rigoureuse.",
    cta: "Découvrir Fortuneo",
    link: "https://www.fortuneo.fr"
  },
  {
    id: '3',
    name: "Trade Republic",
    color: "bg-black",
    type: "Broker Mobile (CTO/Épargne)",
    strength: "Plans d'investissement programmés.",
    description: "L'application la plus intuitive pour démarrer. Idéal pour automatiser ses investissements (DCA) avec des frais fixes très bas.",
    cta: "Tester Trade Republic",
    link: "https://traderepublic.com"
  }
];

const MONTHS_LIST = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const parseAnalysisMonth = (monthStr: string): Date => {
  const [mName, year] = monthStr.split(' ');
  const mIndex = MONTHS_LIST.indexOf(mName);
  return new Date(parseInt(year), mIndex, 2);
};

export const dbService = {
  // --- SYNC STATUS ---
  getLastSync: (): string | null => safeStorage.getItem(DB_KEYS.LAST_SYNC),
  setLastSync: () => safeStorage.setItem(DB_KEYS.LAST_SYNC, new Date().toLocaleString('fr-FR')),

  // --- TARGET TICKERS ---
  getTargetTickers: (month: string): string[] | null => {
    const data = safeStorage.getItem(DB_KEYS.MONTHLY_TARGETS);
    if (!data) return null;
    const targets = JSON.parse(data);
    return targets[month] || null;
  },

  saveTargetTickers: (month: string, tickers: string[]) => {
    const newTargets: Record<string, string[]> = { [month]: tickers };
    safeStorage.setItem(DB_KEYS.MONTHLY_TARGETS, JSON.stringify(newTargets));
  },

  // --- ANALYSES ---
  getAnalyses: (): StockAnalysis[] => {
    const data = safeStorage.getItem(DB_KEYS.ANALYSES);
    return data ? JSON.parse(data) : [];
  },

  saveAnalysis: (analysis: StockAnalysis) => {
    const analyses = dbService.getAnalyses();
    const index = analyses.findIndex(a => a.ticker === analysis.ticker && a.lastUpdate === analysis.lastUpdate);
    
    if (index > -1) {
      const existingEntryPrice = analyses[index].entryPrice;
      analyses[index] = { 
        ...analysis, 
        entryPrice: existingEntryPrice || analysis.entryPrice 
      };
    } else {
      analyses.push(analysis);
    }
    
    safeStorage.setItem(DB_KEYS.ANALYSES, JSON.stringify(analyses));
    return analyses;
  },

  getUserArchive: (signupDateStr: string): StockAnalysis[] => {
    const all = dbService.getAnalyses();
    if (!signupDateStr) return all;
    
    const parts = signupDateStr.split('/');
    if (parts.length < 3) return all;
    const [day, month, year] = parts.map(Number);
    const signupMonthStart = new Date(year, month - 1, 1);

    return all.filter(a => {
      const aDate = parseAnalysisMonth(a.lastUpdate);
      return aDate >= signupMonthStart;
    });
  },

  deleteAnalysis: (ticker: string, month: string) => {
    const analyses = dbService.getAnalyses();
    const updated = analyses.filter(a => !(a.ticker === ticker && a.lastUpdate === month));
    safeStorage.setItem(DB_KEYS.ANALYSES, JSON.stringify(updated));
    return updated;
  },

  // --- USERS ---
  getUsers: (): User[] => {
    const data = safeStorage.getItem(DB_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = dbService.getUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    safeStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return users;
  },

  // --- PARTNERS ---
  getPartners: (): Partner[] => {
    const data = safeStorage.getItem(DB_KEYS.PARTNERS);
    if (!data) {
      const partners = DEFAULT_PARTNERS;
      if (isBrowser) safeStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(partners));
      return partners;
    }
    return JSON.parse(data);
  },

  savePartner: (partner: Partner) => {
    const partners = dbService.getPartners();
    const index = partners.findIndex(p => p.id === partner.id);
    if (index > -1) {
      partners[index] = partner;
    } else {
      partners.push(partner);
    }
    safeStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(partners));
    return partners;
  },

  deletePartner: (id: string) => {
    const partners = dbService.getPartners();
    const updated = partners.filter(p => p.id !== id);
    safeStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(updated));
    return updated;
  },

  // --- AUTH & SESSION ---
  getCurrentUser: (): User | null => {
    const data = safeStorage.getItem(DB_KEYS.SESSION);
    if (!data) return null;
    const session = JSON.parse(data);
    const users = dbService.getUsers();
    return users.find(u => u.email.toLowerCase() === session.email.toLowerCase()) || session;
  },

  setSession: (user: User | null) => {
    if (user) {
      safeStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
    } else {
      safeStorage.removeItem(DB_KEYS.SESSION);
    }
  }
};
