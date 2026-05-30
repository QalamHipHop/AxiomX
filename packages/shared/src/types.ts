import { z } from 'zod';

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

export interface RoutingResult {
  bestPath: any;
  alternativePaths: any[];
  totalPrice: number;
  totalSlippage: number;
  timestamp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}
