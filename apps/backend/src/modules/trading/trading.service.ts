import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SmartRoutingEngine } from '@axiomx/routing-engine';
import { TokenSecurityScanner } from '@axiomx/security';
import { CacheManager, RoutingResult, TokenInfo } from '@axiomx/shared';
import { WebSocketPoolService } from './websocket-pool.service';
import * as ccxt from 'ccxt';

@Injectable()
export class TradingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TradingService.name);
  private exchanges: Map<string, any> = new Map();
  private routingEngine: SmartRoutingEngine;
  private securityScanner: TokenSecurityScanner;
  private cache: CacheManager;

  constructor(private readonly wsPool: WebSocketPoolService) {
    this.cache = CacheManager.getInstance();
    this.routingEngine = new SmartRoutingEngine(this.cache);
    this.securityScanner = new TokenSecurityScanner(this.cache);
  }

  async onModuleInit(): Promise<void> {
    try {
      // Initialize cache
      await this.cache.connect();
      this.logger.log('Trading service initialized with cache and routing engine');
    } catch (error) {
      this.logger.warn('Failed to connect to Redis, falling back to in-memory cache');
    }
  }

  async initializeExchange(exchangeName: string, apiKey?: string, apiSecret?: string): Promise<any> {
    try {
      const exchange = await this.wsPool.getConnection(exchangeName, apiKey, apiSecret);
      this.exchanges.set(exchangeName, exchange);
      return exchange;
    } catch (error) {
      this.logger.error(`Failed to initialize ${exchangeName}:`, error);
      throw error;
    }
  }

  async fetchTicker(exchangeId: string, symbol: string) {
    const exchange = await this.initializeExchange(exchangeId);
    return await exchange.fetchTicker(symbol);
  }

  async fetchOrderBook(exchangeId: string, symbol: string) {
    const exchange = await this.initializeExchange(exchangeId);
    return await exchange.fetchOrderBook(symbol);
  }

  async getAllExchanges(): Promise<Array<{ id: string; name: string; initialized: boolean }>> {
    return Array.from(this.exchanges.entries()).map(([id, exchange]) => ({
      id,
      name: exchange.name ?? id,
      initialized: true,
    }));
  }

  getExchangeInfo(exchangeName: string): { id: string; name: string; initialized: boolean; capabilities: string[] } {
    const exchange = this.exchanges.get(exchangeName);
    return {
      id: exchangeName,
      name: exchange?.name ?? exchangeName,
      initialized: Boolean(exchange),
      capabilities: exchange ? ['fetchTicker', 'fetchOrderBook'] : [],
    };
  }

  async findOptimalRoute(
    symbol: string,
    amount: number,
    side: 'buy' | 'sell',
    maxSlippage: number = 1.0
  ): Promise<RoutingResult> {
    // Register current exchanges
    for (const [id, ex] of this.exchanges) {
      this.routingEngine.registerExchange({ id, name: ex.name, enabled: true });
    }

    return await this.routingEngine.findOptimalRoute({
      symbol,
      amount,
      side,
      maxSlippage,
      mevProtection: true,
      timeout: 5000,
      optimizationTarget: 'balanced'
    });
  }

  async executeTrade(
    symbol: string,
    amount: number,
    side: 'buy' | 'sell',
    token: TokenInfo
  ): Promise<any> {
    // 1. Security Check
    const securityReport = await this.securityScanner.scanToken(token);
    if (securityReport.riskLevel === 'critical') {
      throw new Error(`Critical security risk detected for ${token.symbol}`);
    }

    // 2. Routing
    const route = await this.findOptimalRoute(symbol, amount, side);

    // 3. Execution
    this.logger.log(`Executing trade on ${route.bestPath.exchange}`);
    
    // Here we would use the exchange instance from our map
    const exchange = this.exchanges.get(route.bestPath.exchange);
    if (!exchange) throw new Error(`Exchange ${route.bestPath.exchange} not initialized`);

    // Actual execution logic would go here
    return {
      success: true,
      route,
      securityReport,
      timestamp: Date.now()
    };
  }

  async onModuleDestroy() {
    this.logger.log('Shutting down trading service...');
  }
}
