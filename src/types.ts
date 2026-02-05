export type ViewState = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'ACCOUNT' | 'ANALYSIS' | 'GUIDE' | 'ADMIN' | 'ALPHA_OPPORTUNITIES';

export enum UserTier {
  ALPHA = 'ALPHA',
  ALPHA_JUNIOR = 'ALPHA_JUNIOR',
  MINI_BETA = 'MINI_BETA'
}

export interface User {
  id: string;
  email: string;
  tier: UserTier;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  hasCryptoOption: boolean;
  alphaOppsRemaining: number;
  trackedOpportunities: string[];
  claimedMonths: string[];
  signupDate: string;
}

export interface StockAnalysis {
  ticker: string;
  name: string;
  sector: string;
  importanceRank: number;
  lastUpdate: string;
  thesis: string;
}
