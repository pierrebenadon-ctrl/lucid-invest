import { GoogleGenAI, Type } from "@google/genai";
import { StockAnalysis, Partner } from "../types";

// Cette ligne permet à Vercel de lire ta clé API via vite.config.ts
const API_KEY = (process.env.API_KEY || process.env.GEMINI_API_KEY) as string;

export const generateFullAnalysis = async (ticker: string, month: string, rank: number): Promise<StockAnalysis | null> => {
  if (!API_KEY) {
    console.error("Clé API manquante. Configurez GEMINI_API_KEY sur Vercel.");
    return null;
  }

  const ai = new GoogleGenAI(API_KEY);
  // Utilisation du modèle flash pour la rapidité
  const model = ai.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  try {
    const prompt = `Analyse financière chirurgicale pour ${ticker} (${month}). Rang importance: ${rank}. Format JSON strict.`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text()) as StockAnalysis;
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return null;
  }
};

export const generatePartnerDraft = async (partnerName: string): Promise<Partial<Partner> | null> => {
  const ai = new GoogleGenAI(API_KEY);
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  try {
    const result = await model.generateContent(`Draft marketing pour ${partnerName} en JSON.`);
    return JSON.parse(result.response.text());
  } catch { return null; }
};
