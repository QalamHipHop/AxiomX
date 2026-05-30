import { Injectable, Logger } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class TradingService {
  private readonly logger = new Logger(TradingService.name);
  private exchanges: Map<string, any> = new Map();

  async initializeExchange(exchangeName: string, apiKey?: string, apiSecret?: string): Promise<any> {
    try {
      const ExchangeClass = ccxt[exchangeName];
      if (!ExchangeClass) {
        throw new Error(`Exchange ${exchangeName} not found in CCXT`);
      }

      const exchange = new ExchangeClass({
        apiKey: apiKey || '',
        secret: apiSecret || '',
        enableRateLimit: true,
        timeout: 30000,
      });

      this.exchanges.set(exchangeName, exchange);
      this.logger.log(`Exchange ${exchangeName} initialized`);
      return exchange;
    } catch (error) {
      this.logger.error(`Failed to initialize exchange ${exchangeName}:`, error);
      throw error;
    }
  }

  async getExchangeMarkets(exchangeName: string): Promise<any> {
    try {
      let exchange = this.exchanges.get(exchangeName);
      if (!exchange) {
        exchange = await this.initializeExchange(exchangeName);
      }

      await exchange.loadMarkets();
      return exchange.symbols;
    } catch (error) {
      this.logger.error(`Failed to get markets from ${exchangeName}:`, error);
      throw error;
    }
  }

  async getOrderBook(exchangeName: string, symbol: string, limit?: number): Promise<any> {
    try {
      let exchange = this.exchanges.get(exchangeName);
      if (!exchange) {
        exchange = await this.initializeExchange(exchangeName);
      }

      return await exchange.fetchOrderBook(symbol, limit);
    } catch (error) {
      this.logger.error(`Failed to fetch order book from ${exchangeName}:`, error);
      throw error;
    }
  }

  async getTicker(exchangeName: string, symbol: string): Promise<any> {
    try {
      let exchange = this.exchanges.get(exchangeName);
      if (!exchange) {
        exchange = await this.initializeExchange(exchangeName);
      }

      return await exchange.fetchTicker(symbol);
    } catch (error) {
      this.logger.error(`Failed to fetch ticker from ${exchangeName}:`, error);
      throw error;
    }
  }

  async getAllExchanges(): Promise<string[]> {
    return ccxt.exchanges;
  }

  async getExchangeInfo(exchangeName: string): Promise<any> {
    try {
      let exchange = this.exchanges.get(exchangeName);
      if (!exchange) {
        exchange = await this.initializeExchange(exchangeName);
      }

      return {
        id: exchange.id,
        name: exchange.name,
        countries: exchange.countries,
        urls: exchange.urls,
        version: exchange.version,
        has: exchange.has,
      };
    } catch (error) {
      this.logger.error(`Failed to get exchange info for ${exchangeName}:`, error);
      throw error;
    }
  }
}
