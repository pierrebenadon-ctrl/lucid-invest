
/**
 * Service de données boursières utilisant Twelve Data
 */

export interface MarketPricePoint {
  ticker: string;
  entryPrice: number;
  currentPrice: number;
  currency: string;
  isLive: boolean;
}

const API_KEY = 'demo'; 
const BASE_URL = 'https://api.twelvedata.com';

/**
 * Note: Dans une version réelle, nous utiliserions un endpoint de conversion 
 * ou des tickers spécifiques (ex: AIR.PA) pour avoir les cours directs en EUR.
 * Ici, on simule l'affichage EUR pour la cohérence du SaaS français.
 */
const FALLBACK_PRICES: Record<string, {entry: number, current: number}> = {
  'NVDA': { entry: 121.40, current: 136.15 },
  'MSFT': { entry: 376.20, current: 390.80 },
  'ASML': { entry: 680.00, current: 715.40 }, // ASML est déjà en EUR sur Euronext
  'COST': { entry: 756.00, current: 782.30 },
  'LLY': { entry: 683.00, current: 724.20 },
  'AAPL': { entry: 206.10, current: 222.45 },
  'TSLA': { entry: 169.00, current: 182.30 },
  'TSMC': { entry: 161.40, current: 173.10 },
  'BTC': { entry: 86500, current: 94300 },
  'ETH': { entry: 2610, current: 2860 }
};

export const fetchRealMarketPrices = async (tickers: string[]): Promise<Record<string, MarketPricePoint>> => {
  const symbols = tickers.join(',');
  const results: Record<string, MarketPricePoint> = {};

  try {
    const priceRes = await fetch(`${BASE_URL}/price?symbol=${symbols}&apikey=${API_KEY}`);
    const priceData = await priceRes.json();

    tickers.forEach(symbol => {
      const symbolPriceData = priceData[symbol] || (tickers.length === 1 ? priceData : null);
      const currentPriceRaw = symbolPriceData?.price;
      const currentPrice = currentPriceRaw ? parseFloat(currentPriceRaw) : 0;
      
      if (currentPrice === 0 || isNaN(currentPrice)) {
        const fallback = FALLBACK_PRICES[symbol] || { entry: 100, current: 105 };
        results[symbol] = {
          ticker: symbol,
          entryPrice: fallback.entry,
          currentPrice: fallback.current,
          currency: 'EUR',
          isLive: false
        };
      } else {
        // Simulation d'une conversion USD -> EUR (approx 0.92)
        const eurPrice = currentPrice * 0.92;
        results[symbol] = {
          ticker: symbol,
          entryPrice: eurPrice * 0.94,
          currentPrice: eurPrice,
          currency: 'EUR',
          isLive: true
        };
      }
    });

    return results;
  } catch (error) {
    return tickers.reduce((acc, symbol) => {
      const fallback = FALLBACK_PRICES[symbol] || { entry: 100, current: 105 };
      acc[symbol] = { ticker: symbol, entryPrice: fallback.entry, currentPrice: fallback.current, currency: 'EUR', isLive: false };
      return acc;
    }, {} as Record<string, MarketPricePoint>);
  }
};
