import { MetalPrice, MarketSummary } from '../types/MetalTypes';

const METALS_API_KEY = 'goldapi-3dxousmesa1jbm-io'; // Replace with your API key

class MetalApiService {
  private async fetchFromGoldAPI(symbol: string): Promise<any> {
    try {
      const response = await fetch(`https://www.goldapi.io/api/${symbol}/INR`, {
        headers: {
          'X-ACCESS-TOKEN': METALS_API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${symbol} price:`, error);
      throw error;
    }
  }

  async getAllMetalPrices(): Promise<MetalPrice[]> {
     // DEMO MODE: Using realistic sample data instead of API calls
    // Replace this with real API calls when your API key is working
    
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit"
    });
    // Simulate realistic price variations
    const randomVariation = () => (Math.random() - 0.5) * 0.02; // ±1% variation
    const demoData: MetalPrice[] = [
      {
        metal: 'gold',
        symbol: 'XAU/INR',
        name: 'Gold (24K)',
        price: 6247.50 + (randomVariation() * 6247.50),
        change: 42.30,
        changePercent: 0.68,
        previousClose: 6205.20,
        previousOpen: 6210.15,
        dayHigh: 6258.90,
        dayLow: 6198.45,
        weekHigh52: 6890.25,
        weekLow52: 5654.80,
        volume: "1,245,678",
        lastUpdate: timeString,
        timestamp: Date.now()
      },
      {
        metal: 'silver',
        symbol: 'XAG/INR',
        name: 'Silver',
        price: 78.25 + (randomVariation() * 78.25),
        change: -1.15,
        changePercent: -1.45,
        previousClose: 79.40,
        previousOpen: 79.12,
        dayHigh: 79.85,
        dayLow: 77.90,
        weekHigh52: 89.45,
        weekLow52: 68.30,
        volume: "2,567,432",
        lastUpdate: timeString,
        timestamp: Date.now()
      },
      {
        metal: 'platinum',
        symbol: 'XPT/INR',
        name: 'Platinum',
        price: 2834.75 + (randomVariation() * 2834.75),
        change: 18.65,
        changePercent: 0.66,
        previousClose: 2816.10,
        previousOpen: 2821.45,
        dayHigh: 2847.20,
        dayLow: 2809.30,
        weekHigh52: 3245.60,
        weekLow52: 2456.80,
        volume: "567,234",
        lastUpdate: timeString,
        timestamp: Date.now()
      },
      {
        metal: 'palladium',
        symbol: 'XPD/INR',
        name: 'Palladium',
        price: 3156.80 + (randomVariation() * 3156.80),
        change: -25.40,
        changePercent: -0.80,
        previousClose: 3182.20,
        previousOpen: 3175.90,
        dayHigh: 3189.45,
        dayLow: 3145.60,
        weekHigh52: 3876.45,
        weekLow52: 2789.30,
        volume: "345,123",
        lastUpdate: timeString,
        timestamp: Date.now()
      }
    ];

    // Round all price values
    return demoData.map(metal => ({
      ...metal,
      price: Math.round(metal.price * 100) / 100,
      change: Math.round(metal.change * 100) / 100,
      changePercent: Math.round(metal.changePercent * 100) / 100,
      previousClose: Math.round(metal.previousClose * 100) / 100,
      previousOpen: Math.round(metal.previousOpen * 100) / 100,
      dayHigh: Math.round(metal.dayHigh * 100) / 100,
      dayLow: Math.round(metal.dayLow * 100) / 100,
      weekHigh52: Math.round(metal.weekHigh52 * 100) / 100,
      weekLow52: Math.round(metal.weekLow52 * 100) / 100
    }));
  }

  async getMetalPrice(metal: string): Promise<MetalPrice> {
    const allPrices = await this.getAllMetalPrices();
    const metalPrice = allPrices.find(p => p.metal === metal);
    
    if (!metalPrice) {
      throw new Error(`Metal ${metal} not found`);
    }
    
    return metalPrice;
  }

  async getMarketSummary(prices: MetalPrice[]): Promise<MarketSummary> {
    const metalsUp = prices.filter(p => p.change > 0).length;
    const metalsDown = prices.filter(p => p.change < 0).length;
    const avgChange = prices.length > 0 
      ? prices.reduce((sum, p) => sum + p.changePercent, 0) / prices.length
      : 0;

    return {
      metalsUp,
      metalsDown,
      avgChange: Math.round(avgChange * 100) / 100
    };
  }
}

export default new MetalApiService();