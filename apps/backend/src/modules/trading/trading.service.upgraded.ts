/**
 * Upgraded Trading Service
 * Integrates Smart Routing Engine, Token Security Scanner, and advanced features
 * Production-grade with caching, error handling, and monitoring
 */

import { Injectable, Logger } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { SmartRoutingEngine } from '@axiomx/routing-engine';
import { TokenSecurityScanner } from '@axiomx/security';
import { CacheManager, RoutingResult, TokenInfo } from '@axiomx/shared';

@Injectable()
export class TradingServiceUpgraded {
  private readonly logger = new Logger(TradingServiceUpgraded.name);
  private exchanges: Map<string, any> = new Map();
  private routingEngine: SmartRoutingEngine;
  private securityScanner: TokenSecurityScanner;
  private cache: CacheManager;

  constructor() {
    this.cache = new CacheManager();
    this.routingEngine = new SmartRoutingEngine(this.cache);
    this.securityScanner = new TokenSecurityScanner(this.cache);
  }

  async onModuleInit(): Promise<void> {
    await this.cache.connect();
    this.logger.log('Trading service initialized with cache and routing engine');
  }

  async onModuleDestroy(): Promise<void> {
    await this.cache.disconnect();
  }

  /**
   * Initialize exchange with enhanced configuration
   */
  async initializeExchange(
    exchangeName: string,
    apiKey?: string,
    apiSecret?: string
  ): Promise<any> {
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
        // Enhanced configuration
        'options': {
          'fetchOrderBookSnapshot': true,
          'watchOrderBook': true,
        },
      });

      this.exchanges.set(exchangeName, exchange);
      this.logger.log(`Exchange ${exchangeName} initialized with enhanced config`);
      return exchange;
    } catch (error) {
      this.logger.error(`Failed to initialize exchange ${exchangeName}:`, error);
      throw error;
    }
  }

  /**
   * Find optimal route across all exchanges
   */
  async findOptimalRoute(
    symbol: string,
    amount: number,
    side: 'buy' | 'sell',
    maxSlippage: number = 1.0,
    preferredExchanges?: string[]
  ): Promise<RoutingResult> {
    try {
      // Register exchanges with routing engine
      for (const [exchangeId, exchange] of this.exchanges) {
        this.routingEngine.registerExchange({
          id: exchangeId,
          name: exchange.name,
          enableRateLimit: true,
          timeout: 30000,
        });
      }

      // Find optimal route
      const result = await this.routingEngine.findOptimalRoute({
        symbol,
        amount,
        side,
        maxSlippage,
        preferredExchanges,
        avoidExchanges: [],
        mevProtection: true,
        timeout: 10000,
      });

      this.logger.log(
        `Found optimal route for ${amount} ${symbol} on ${result.bestPath.exchange}`
      );

      return result;
    } catch (error) {
      this.logger.error('Failed to find optimal route:', error);
      throw error;
    }
  }

  /**
   * Scan token for security risks
   */
  async scanTokenSecurity(token: TokenInfo): Promise<any> {
    try {
      const report = await this.securityScanner.scanToken(token);
      this.logger.log(`Token ${token.symbol} security scan: ${report.riskLevel}`);
      return report;
    } catch (error) {
      this.logger.error(`Token security scan failed:`, error);
      throw error;
    }
  }

  /**
   * Execute trade with routing and security checks
   */
  async executeTrade(
    symbol: string,
    amount: number,
    side: 'buy' | 'sell',
    token: TokenInfo,
    maxSlippage: number = 1.0
  ): Promise<any> {
    try {
      // Step 1: Security check
      const securityReport = await this.scanTokenSecurity(token);
      if (securityReport.riskLevel === 'critical') {
        throw new Error(`Cannot trade: Token has critical security risks`);
      }

      // Step 2: Find optimal route
      const route = await this.findOptimalRoute(symbol, amount, side, maxSlippage);

      // Step 3: Execute on best exchange
      const exchange = this.exchanges.get(route.bestPath.exchange);
      if (!exchange) {
        throw new Error(`Exchange ${route.bestPath.exchange} not initialized`);
      }

      // Step 4: Place order
      const order = await exchange.createOrder(symbol, 'market', side, amount);

      this.logger.log(`Trade executed: ${amount} ${symbol} on ${route.bestPath.exchange}`);

      return {
        order,
        route,
        securityReport,
      };
    } catch (error) {
      this.logger.error('Trade execution failed:', error);
      throw error;
    }
  }

  /**
   * Get market data with caching
   */
  async getMarketData(exchangeName: string, symbol: string): Promise<any> {
    const cacheKey = `market:${exchangeName}:${symbol}`;

    try {
      // Try cache first
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Fetch from exchange
      let exchange = this.exchanges.get(exchangeName);
      if (!exchange) {
        exchange = await this.initializeExchange(exchangeName);
      }

      await exchange.loadMarkets();
      const ticker = await exchange.fetchTicker(symbol);

      // Cache for 30 seconds
      await this.cache.set(cacheKey, ticker, 30);

      return ticker;
    } catch (error) {
      this.logger.error(`Failed to get market data for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get order book with aggregation
   */
  async getOrderBook(
    exchangeName: string,
    symbol: string,
    limit?: number
  ): Promise<any> {
    const cacheKey = `orderbook:${exchangeName}:${symbol}`;

    try {
      // Try cache first (5 second TTL for order books)
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      let exchange = this.exchanges.get(exchangeName);
      if (!exchange) {
        exchange = await this.initializeExchange(exchangeName);
      }

      const orderBook = await exchange.fetchOrderBook(symbol, limit);

      // Cache for 5 seconds
      await this.cache.set(cacheKey, orderBook, 5);

      return orderBook;
    } catch (error) {
      this.logger.error(`Failed to fetch order book from ${exchangeName}:`, error);
      throw error;
    }
  }

  /**
   * Get all exchanges
   */
  async getAllExchanges(): Promise<string[]> {
    return ccxt.exchanges;
  }

  /**
   * Get exchange info
   */
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
        limits: exchange.limits,
        fees: exchange.fees,
      };
    } catch (error) {
      this.logger.error(`Failed to get exchange info for ${exchangeName}:`, error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): any {
    return this.cache.getStats();
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    await this.cache.clear();
    this.logger.log('Cache cleared');
  }
}
