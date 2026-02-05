

export enum ScenarioType {
  MAIN = 'MAIN',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL'
}

export enum UserTier {
  MINI_BETA = 'MINI_BETA',
  ALPHA_JUNIOR = 'ALPHA_JUNIOR',
  ALPHA = 'ALPHA'
}

export interface Partner {
  id: string;
  name: string;
  color: string;
  type: string;
  strength: string;
  description: string;
  cta: string;
  link: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  tier: UserTier;
  role?: 'USER' | 'ADMIN';
  signupDate?: string;
  hasCryptoOption: boolean;
  alphaOppsRemaining: number;
  // List of tickers specifically tracked or bookmarked by the user
  trackedOpportunities: string[];
  claimedMonths: string[];
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'UNPAID';
  // Stripe Integration Fields
  stripeCustomerId?: string;
  subscriptionId?: string;
  currentPeriodEnd?: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface LucidityScore {
  total: number;
  readability: number;
  financialStability: number;
  externalDependency: number;
  narrativeVolatility: number;
}

export interface Scenario {
  probability: number;
  description: string;
  keyPhrase?: string;
  supportingFactors?: string[];
  horizon?: string;
}

export interface Risk {
  category: string;
  description: string;
}

export interface InvalidationPoint {
  event: string;
  observableSignal: string;
}

export interface StockAnalysis {
  ticker: string;
  importanceRank: number; // 1-2: Beta, 3-6: Junior, 7-12: Alpha
  isin?: string;
  name: string;
  sector: string;
  entryPrice: number; // Prix au moment de l'analyse
  lastUpdate: string;
  marketingHook?: string; // Résumé court pour landing/teasing
  swot: SWOT;
  mainScenario: Scenario;
  negativeScenario: Scenario;
  neutralScenario: Scenario;
  lucidityScore: LucidityScore;
  marketAnticipations: string[];
  realRisks: Risk[];
  invalidationPoints: InvalidationPoint[];
  recommendationNote?: string;
  sources?: { title: string, uri: string }[];
}

// Fixed: Added 'ALPHA_OPPORTUNITIES' to ViewState to prevent type mismatch in App.tsx
export type ViewState = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'ANALYSIS' | 'ACCOUNT' | 'GUIDE' | 'ADMIN' | 'ALPHA_OPPORTUNITIES';