/**
 * AxiomX Shared Types and Interfaces
 * Core data structures for the aggregator platform
 */

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
}

export interface TradeOrder {
  id: string;
  exchange: string;
  symbol: string;
  type: 'market' | 'limit' | 'synthetic-limit';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  timestamp: number;
  status: 'pending' | 'open' | 'closed' | 'canceled' | 'failed';
  filled: number;
  remaining: number;
  cost?: number;
  fee?: number;
  info?: any;
}

export interface RoutingPath {
  exchange: string;
  symbol: string;
  price: number;
  amount: number;
  liquidity: number;
  slippage: number;
  gasCost?: number;
  mevRisk: number;
  fillProbability: number;
  estimatedTime: number;
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

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoUrl?: string;
  verified: boolean;
}

export interface TokenSecurityReport {
  token: TokenInfo;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  risks: TokenRisk[];
  score: number;
  timestamp: number;
}

export interface TokenRisk {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}

export interface SyntheticLimitOrder {
  id: string;
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  triggerPrice: number;
  limitPrice: number;
  createdAt: number;
  expiresAt: number;
  status: 'active' | 'triggered' | 'executed' | 'expired' | 'canceled';
  executedAt?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface WebSocketMessage {
  type: string;
  channel: string;
  data: any;
  timestamp: number;
}

export interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  timestamp: number;
}
