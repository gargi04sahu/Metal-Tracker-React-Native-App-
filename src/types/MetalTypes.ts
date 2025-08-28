export interface MetalPrice {
  metal: 'gold' | 'silver' | 'platinum' | 'palladium';
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  previousOpen: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  volume: string;
  lastUpdate: string;
  timestamp: number;
}

export interface MarketSummary {
  metalsUp: number;
  metalsDown: number;
  avgChange: number;
}

export type RootStackParamList = {
  Home: undefined;
  MetalDetail: { metal: string };
};