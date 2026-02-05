import { GoogleGenAI, Type } from "@google/genai";
import { StockAnalysis, Partner } from "../types";

// Cette ligne est cruciale pour que Vercel lise ta clé API via ton vite.config.ts
const API_KEY = (process.env.API_KEY || process.env.GEMINI_API_KEY) as string;

const SYSTEM_PROMPT = `Agis en tant qu'Analyste Financier Senior spécialisé en gestion des risques et en analyse scénaristique (méthode de "Lucidité Financière"). 

TA MISSION :
Produire une analyse froide, pragmatique et dénuée de tout biais émotionnel ou marketing pour l'actif spécifié. Tu ne dois jamais inciter à l'achat, mais exposer la structure de l'opportunité et ses failles.

RECHERCHE OBLIGATOIRE :
Utilise tes outils de recherche pour trouver le prix actuel du marché (Live Price) et les dernières actualités majeures de l'entreprise/actif pour garantir la pertinence de l'analyse en 2026.

DISTRIBUTION ET NIVEAUX D'ACCÈS :
Attribue un 'importanceRank' (Nombre de 1 à 12) :
- Rangs 1-2 : Sélection pour le Plan Beta (Incontournables).
- Rangs 3-6 : Sélection pour le Plan Alpha Junior (Fortes).
- Rangs 7-12 : Sélection pour le Plan Alpha (Spécialisées).

MARKETING HOOK :
Rédige un 'marketingHook' de maximum 100 caractères qui résume l'opportunité de manière intrigante mais lucide.

CLASSIFICATION :
- Si l'actif est une cryptomonnaie, le champ 'sector' doit être strictement "CRYPTO".`;

export const generateFullAnalysis = async (ticker: string, month: string, rank: number): Promise<StockAnalysis | null> => {
  if (!API_KEY) {
    console.error("Clé API manquante dans l'environnement.");
    return null;
  }

  const ai = new GoogleGenAI(API_KEY);
  const model = ai.getGenerativeModel({ 
    model: "gemini-2.0-flash", // Utilisation du dernier modèle stable
    generationConfig: { responseMimeType: "application/json" } 
  });

  try {
    const prompt = `Génère une analyse complète pour ${ticker} pour le rapport de ${month}. Rang d'importance: ${rank}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text()) as StockAnalysis;
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return null;
  }
};

export const generatePartnerDraft = async (partnerName: string): Promise<Partial<Partner> | null> => {
  const ai = new GoogleGenAI(API_KEY);
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  try {
    const prompt = `Rédige une fiche marketing pour le courtier ${partnerName}. Format JSON avec type, strength, description, cta, color.`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    return null;
  }
};
