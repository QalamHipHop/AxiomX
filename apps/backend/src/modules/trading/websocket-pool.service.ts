import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as ccxt from 'ccxt';

interface ExchangeConnection {
  watchOrderBook?: (symbol: string) => Promise<unknown>;
  close?: () => Promise<void>;
}

@Injectable()
export class WebSocketPoolService implements OnModuleDestroy {
  private readonly logger = new Logger(WebSocketPoolService.name);
  private readonly connections = new Map<string, ExchangeConnection>();
  private readonly maxReconnectAttempts = 5;

  async getConnection(exchangeId: string, apiKey?: string, secret?: string): Promise<ExchangeConnection> {
    const connectionKey = `${exchangeId}-${apiKey || 'public'}`;
    const existing = this.connections.get(connectionKey);
    if (existing) return existing;

    const ExchangeClass = (ccxt as unknown as Record<string, new (config?: Record<string, unknown>) => ExchangeConnection>)[exchangeId];
    if (!ExchangeClass) {
      throw new Error(`Exchange ${exchangeId} is not available in the installed CCXT package`);
    }

    const exchange = new ExchangeClass({
      apiKey,
      secret,
      enableRateLimit: true,
      options: { defaultType: 'spot' },
    });

    if (typeof exchange.watchOrderBook !== 'function') {
      throw new Error(`Exchange ${exchangeId} requires CCXT Pro for WebSocket order-book streaming`);
    }

    this.connections.set(connectionKey, exchange);
    this.logger.log(`Established new WS connection to ${exchangeId}`);
    return exchange;
  }

  async watchOrderBook(exchangeId: string, symbol: string): Promise<unknown> {
    const exchange = await this.getConnection(exchangeId);
    let attempts = 0;

    while (attempts < this.maxReconnectAttempts) {
      try {
        return await exchange.watchOrderBook!(symbol);
      } catch (error) {
        attempts += 1;
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Error watching orderbook on ${exchangeId}: ${message}`);
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }

    throw new Error(`Unable to watch orderbook on ${exchangeId} after ${this.maxReconnectAttempts} attempts`);
  }

  async onModuleDestroy(): Promise<void> {
    for (const [key, exchange] of this.connections.entries()) {
      try {
        await exchange.close?.();
        this.logger.log(`Closed WS connection for ${key}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Error closing connection ${key}: ${message}`);
      }
    }
    this.connections.clear();
  }
}

export default WebSocketPoolService;
