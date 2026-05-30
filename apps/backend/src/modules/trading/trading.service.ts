import { Injectable, Logger } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class TradingService {
  private readonly logger = new Logger(TradingService.name);
  private exchanges: Map<string, ccxt.Exchange> = new Map();

  async getExchange(exchangeId: string, apiKey?: string, secret?: string): Promise<ccxt.Exchange> {
    const key = `${exchangeId}-${apiKey || 'public'}`;
    if (this.exchanges.has(key)) {
      return this.exchanges.get(key)!;
    }

    if (!ccxt.exchanges.includes(exchangeId)) {
      throw new Error(`Exchange ${exchangeId} not supported`);
    }

    const exchange = new (ccxt as any)[exchangeId]({
      apiKey,
      secret,
      enableRateLimit: true,
    });

    this.exchanges.set(key, exchange);
    return exchange;
  }

  async fetchTicker(exchangeId: string, symbol: string) {
    const exchange = await this.getExchange(exchangeId);
    return await exchange.fetchTicker(symbol);
  }

  async fetchOrderBook(exchangeId: string, symbol: string, limit: number = 20) {
    const exchange = await this.getExchange(exchangeId);
    return await exchange.fetchOrderBook(symbol, limit);
  }

  async createOrder(exchangeId: string, symbol: string, type: string, side: 'buy' | 'sell', amount: number, price?: number, apiKey?: string, secret?: string) {
    const exchange = await this.getExchange(exchangeId, apiKey, secret);
    return await exchange.createOrder(symbol, type, side, amount, price);
  }

  async getAllExchanges(): Promise<string[]> {
    return ccxt.exchanges;
  }
}
