
import { GoogleGenAI, Type } from "@google/genai";
import { StockAnalysis, Partner } from "../types";

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
Rédige un 'marketingHook' de maximum 100 caractères qui résume l'opportunité de manière intrigante mais lucide. Exemple: "LVMH : La résilience du luxe face à la volatilité asiatique."

CLASSIFICATION :
- Si l'actif est une cryptomonnaie (BTC, ETH, etc.), le champ 'sector' doit être strictement "CRYPTO".
- Trouve impérativement le code ISIN officiel exact pour les actions.

SCÉNARIOS :
- Le scénario négatif est le plus important : sois chirurgical sur les risques.
- Définis des points d'invalidation clairs (signaux observables).`;

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    ticker: { type: Type.STRING },
    importanceRank: { type: Type.NUMBER },
    entryPrice: { type: Type.NUMBER },
    isin: { type: Type.STRING },
    name: { type: Type.STRING },
    sector: { type: Type.STRING },
    marketingHook: { type: Type.STRING },
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    mainScenario: {
      type: Type.OBJECT,
      properties: {
        probability: { type: Type.NUMBER },
        keyPhrase: { type: Type.STRING },
        description: { type: Type.STRING },
        supportingFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    negativeScenario: {
      type: Type.OBJECT,
      properties: {
        probability: { type: Type.NUMBER },
        description: { type: Type.STRING }
      }
    },
    neutralScenario: {
      type: Type.OBJECT,
      properties: {
        probability: { type: Type.NUMBER },
        description: { type: Type.STRING }
      }
    },
    lucidityScore: {
      type: Type.OBJECT,
      properties: {
        total: { type: Type.NUMBER },
        readability: { type: Type.NUMBER },
        financialStability: { type: Type.NUMBER },
        externalDependency: { type: Type.NUMBER },
        narrativeVolatility: { type: Type.NUMBER }
      }
    },
    marketAnticipations: { type: Type.ARRAY, items: { type: Type.STRING } },
    realRisks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    invalidationPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          event: { type: Type.STRING },
          observableSignal: { type: Type.STRING }
        }
      }
    }
  },
  required: ['ticker', 'importanceRank', 'entryPrice', 'name', 'sector', 'marketingHook', 'swot', 'mainScenario', 'lucidityScore', 'realRisks', 'invalidationPoints']
};

export const generateFullAnalysis = async (ticker: string, month: string, rank?: number): Promise<StockAnalysis | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Plus puissant pour l'analyse scénaristique complexe
      contents: `Analyse approfondie de l'actif ${ticker} pour le rapport de ${month}. Utilise impérativement Google Search pour trouver le prix actuel précis et les risques de marché récents en 2026. ${rank ? `Cible le rang d'importance ${rank}.` : ''}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        tools: [{ googleSearch: {} }]
      },
    });
    
    // Accès direct à la propriété .text (pas de méthode .text())
    const text = response.text;
    if (!text) throw new Error("Réponse vide de l'API");
    
    const analysis: StockAnalysis = JSON.parse(text);
    analysis.lastUpdate = month;

    // Extraction et mise en forme des sources de Grounding
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      analysis.sources = response.candidates[0].groundingMetadata.groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title || "Source Marché",
          uri: chunk.web.uri
        }));
    }

    return analysis;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    if (error?.message?.includes('429')) throw error;
    return null;
  }
};

export const generatePartnerDraft = async (partnerName: string): Promise<Partial<Partner> | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const PARTNER_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING },
      strength: { type: Type.STRING },
      description: { type: Type.STRING },
      cta: { type: Type.STRING },
      color: { type: Type.STRING }
    },
    required: ['type', 'strength', 'description', 'cta', 'color']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Rapide pour du copywriting simple
      contents: `Rédige une fiche partenaire marketing pour le courtier : "${partnerName}".`,
      config: {
        systemInstruction: "Tu es un copywriter financier senior. Produis un contenu court, percutant et professionnel.",
        responseMimeType: "application/json",
        responseSchema: PARTNER_SCHEMA
      },
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    return null;
  }
};
