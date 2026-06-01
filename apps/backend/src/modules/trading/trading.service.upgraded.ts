import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SmartRoutingEngine } from '@axiomx/routing-engine';
import { TokenSecurityScanner } from '@axiomx/security';
import { CacheManager, RoutingResult, TokenInfo } from '@axiomx/shared';
import * as ccxt from 'ccxt';

@Injectable()
export class TradingServiceUpgraded implements OnModuleInit {
  private readonly logger = new Logger(TradingServiceUpgraded.name);
  private exchanges: Map<string, any> = new Map();
  private routingEngine: SmartRoutingEngine;
  private securityScanner: TokenSecurityScanner;
  private cache: CacheManager;

  constructor() {
    this.cache = CacheManager.getInstance();
    this.routingEngine = new SmartRoutingEngine(this.cache);
    this.securityScanner = new TokenSecurityScanner(this.cache);
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.cache.connect();
      this.logger.log('Trading service initialized with cache and routing engine');
    } catch (error) {
      this.logger.warn('Failed to connect to Redis, falling back to in-memory cache');
    }
  }

  async initializeExchange(exchangeName: string, apiKey?: string, apiSecret?: string): Promise<any> {
    try {
      const ExchangeClass = (ccxt as any)[exchangeName];
      if (!ExchangeClass) throw new Error(`Exchange ${exchangeName} not found`);

      const exchange = new ExchangeClass({
        apiKey: apiKey || '',
        secret: apiSecret || '',
        enableRateLimit: true,
        timeout: 30000,
      });

      this.exchanges.set(exchangeName, exchange);
      return exchange;
    } catch (error) {
      this.logger.error(`Failed to initialize ${exchangeName}:`, error);
      throw error;
    }
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

    // 3. Execution (Simulated for safety in this environment)
    this.logger.log(`Executing trade on ${route.bestPath.exchange}`);
    
    return {
      success: true,
      route,
      securityReport,
      timestamp: Date.now()
    };
  }
}
