import { z } from 'zod';
import { Chain, PublicClient } from 'viem';

export interface ExchangeConfig {
  id: string;
  name: string;
  apiKey?: string;
  apiSecret?: string;
  enableRateLimit: boolean;
  timeout: number;
  sandbox?: boolean;
}

export interface OrderBook {
  exchange: string;
  symbol: string;
  timestamp: number;
  bids: Array<[number, number]>;
  asks: Array<[number, number]>;
}

export interface Ticker {
  exchange: string;
  symbol: string;
  timestamp: number;
  last: number;
  bid: number;
  ask: number;
  high: number;
  low: number;
  volume: number;
  percentage?: number;
}

export const OrderSchema = z.object({
  symbol: z.string(),
  type: z.enum(['market', 'limit', 'synthetic-limit']),
  side: z.enum(['buy', 'sell']),
  amount: z.number().positive(),
  price: z.number().optional(),
  exchangeId: z.string(),
});

export type TradeOrder = z.infer<typeof OrderSchema> & {
  id: string;
  timestamp: number;
  status: 'pending' | 'open' | 'closed' | 'canceled' | 'failed';
  filled: number;
  remaining: number;
};

export interface RoutingPath {
  exchange: string;
  symbol: string;
  price: number;
  amount: number;
  liquidity: number;
  slippage: number;
  gasCost: number;
  mevRisk: number;
  fillProbability: number;
  estimatedTime: number;
  hops?: { venue: string; type: 'CEX' | 'DEX'; amount: number; price: number }[];
}

export interface RoutingResult {
  bestPath: RoutingPath;
  alternativePaths: RoutingPath[];
  totalPrice: number;
  totalSlippage: number;
  estimatedFee: number;
  recommendation: string;
  timestamp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
}

export interface TokenInfo {
  address: string;
  chainId: number;
  symbol?: string;
  name?: string;
}

export interface TokenRisk {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}

export interface TokenSecurityReport {
  token: TokenInfo;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  risks: TokenRisk[];
  score: number;
  timestamp: number;
}
