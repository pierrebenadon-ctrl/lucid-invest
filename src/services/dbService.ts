import { User, StockAnalysis } from '../types';

export const dbService = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem('lucid_users') || '[]'),
  saveUser: (user: User) => {
    const users = dbService.getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index > -1) users[index] = user; else users.push(user);
    localStorage.setItem('lucid_users', JSON.stringify(users));
  },
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem('lucid_session') || 'null'),
  setSession: (user: User | null) => localStorage.setItem('lucid_session', JSON.stringify(user)),
  getAnalyses: (): StockAnalysis[] => JSON.parse(localStorage.getItem('lucid_analyses') || '[]'),
  saveAnalysis: (a: StockAnalysis) => {
    const all = dbService.getAnalyses();
    all.push(a);
    localStorage.setItem('lucid_analyses', JSON.stringify(all));
    return all;
  },
  deleteAnalysis: (ticker: string, month: string) => {
    const filtered = dbService.getAnalyses().filter(a => !(a.ticker === ticker && a.lastUpdate === month));
    localStorage.setItem('lucid_analyses', JSON.stringify(filtered));
    return filtered;
  }
};
