export enum UserTier {
  MINI_BETA = 'MINI_BETA',
  ALPHA_JUNIOR = 'ALPHA_JUNIOR',
  ALPHA = 'ALPHA'
}

export type ViewState = 
  | 'LANDING' 
  | 'AUTH' 
  | 'DASHBOARD' 
  | 'ACCOUNT' 
  | 'ANALYSIS' 
  | 'GUIDE' 
  | 'ADMIN' 
  | 'ALPHA_OPPORTUNITIES';

export interface User {
  id: string;
  email: string;
  tier: UserTier;
  role?: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'CANCELED';
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
  marketingHook?: string;
  thesis?: string;
}
