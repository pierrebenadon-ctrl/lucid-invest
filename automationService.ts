
import { GoogleGenAI } from "@google/genai";
import { dbService } from "./dbService";
import { generateFullAnalysis } from "./geminiService";

export const getCurrentMonthYear = (offset = 0) => {
  const now = new Date();
  if (offset !== 0) {
    now.setMonth(now.getMonth() + offset);
  }
  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
};

export const getUpcomingMonths = (count = 4) => {
  return Array.from({ length: count }, (_, i) => getCurrentMonthYear(i));
};

export const automationService = {
  checkAndSyncMonthlyReport: async (onProgress?: (msg: string) => void, force = false): Promise<boolean> => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = getCurrentMonthYear();

    if (!force && currentDay !== 2) {
      if (onProgress) onProgress("Radar Alpha : En attente du 02 du mois.");
      return false;
    }

    const analysesInDB = dbService.getAnalyses().filter(a => a.lastUpdate === currentMonth);

    if (analysesInDB.length >= 14) {
      if (onProgress) onProgress("Rapport mensuel déjà complet.");
      dbService.setLastSync();
      return false;
    }

    if (onProgress) onProgress(`Radar Alpha : Analyse de ${currentMonth} en cours...`);

    try {
      let tickers = dbService.getTargetTickers(currentMonth);

      if (!tickers) {
        if (onProgress) onProgress("Identification des 14 pépites du mois via IA...");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const selection = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Nous sommes en ${currentMonth}. Identifie 12 actions mondiales et 2 cryptomonnaies majeures à analyser ce mois-ci. Réponds uniquement avec les tickers séparés par des virgules (ex: LVMH.PA, AAPL, BTC, ETH...).`,
        });

        // Utilisation de la propriété .text
        const text = selection.text;
        if (!text) return false;
        
        tickers = text.split(',').map(t => t.trim().toUpperCase().replace(/[^A-Z0-9.]/g, ''));
        tickers = Array.from(new Set(tickers)).slice(0, 14);
        dbService.saveTargetTickers(currentMonth, tickers);
      }

      let syncedAtLeastOne = false;
      for (let i = 0; i < tickers.length; i++) {
        const ticker = tickers[i];
        const alreadyDone = dbService.getAnalyses().some(a => a.ticker === ticker && a.lastUpdate === currentMonth);
        if (alreadyDone) continue;
        
        if (onProgress) onProgress(`[${i + 1}/14] Analyse chirurgicale : ${ticker}...`);
        
        // Délai pour respecter les quotas de l'API (Rate limiting)
        await new Promise(resolve => setTimeout(resolve, 15000));

        try {
          const analysis = await generateFullAnalysis(ticker, currentMonth, i + 1);
          if (analysis) {
            dbService.saveAnalysis(analysis);
            syncedAtLeastOne = true;
            dbService.setLastSync();
          } else {
            break; 
          }
        } catch (innerError: any) {
          throw innerError;
        }
      }
      return syncedAtLeastOne;
    } catch (error: any) {
      console.error("Automation Sync Global Error:", error);
      if (onProgress) onProgress("Erreur technique de synchronisation.");
      return false;
    }
  }
};
