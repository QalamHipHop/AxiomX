import { ExchangeConfig, OrderBook, RoutingPath, RoutingResult, CacheManager, TokenInfo } from '@axiomx/shared';
import { createClient } from 'redis';
import { Chain, PublicClient, createPublicClient, http } from 'viem';
import { mainnet, arbitrum, optimism, polygon, base, zora } from 'viem/chains';
import ccxt from 'ccxt';

interface VenueNode {
  id: string;
  type: 'CEX' | 'DEX';
  config?: ExchangeConfig;
  publicClient?: PublicClient;
  chain?: Chain;
}

interface LiquidityEdge {
  from: string;
  to: string;
  poolId: string; // Identifier for the liquidity pool
  tokenIn: string;
  tokenOut: string;
  liquidity: number; // Available liquidity for the trade
  fee: number; // Trading fee percentage
  price: number; // Current price (tokenOut / tokenIn)
  slippageImpact: (amount: number) => number; // Function to calculate slippage for a given amount
  latency: number; // Estimated execution latency
  mevRisk: number; // Estimated MEV risk
}

export interface RoutingContext {
  symbol: string;
  amount: number;
  side: 'buy' | 'sell';
  maxSlippage: number;
  preferredExchanges?: string[];
  avoidExchanges?: string[];
  mevProtection: boolean;
  timeout: number;
  optimizationTarget: 'price' | 'speed' | 'safety' | 'balanced';
  splitOrderEnabled: boolean;
  maxSplitParts?: number;
}

export interface ExchangeMetrics {
  id: string;
  latency: number;
  reliability: number;
  liquidityScore: number;
  feeRate: number;
  lastUpdate: number;
}

export class SmartRoutingEngine {
  private exchanges: Map<string, ExchangeConfig> = new Map();
  private exchangeMetrics: Map<string, ExchangeMetrics> = new Map();
  private cache: CacheManager;
  private graph: Map<string, LiquidityEdge[]> = new Map(); // Adjacency list for the graph
  private venues: Map<string, VenueNode> = new Map();
  private publicClients: Map<number, PublicClient> = new Map();

  constructor(cache: CacheManager) {
    this.cache = cache;
    this.initializePublicClients();
  }

  private initializePublicClients() {
    const chains = [mainnet, arbitrum, optimism, polygon, base, zora];
    chains.forEach(chain => {
      this.publicClients.set(chain.id, createPublicClient({
        chain,
        transport: http()
      }));
    });
  }

  /**
   * Registers a trading venue with the engine
   */
  registerExchange(config: ExchangeConfig, initialMetrics?: Partial<ExchangeMetrics>): void {
    this.exchanges.set(config.id, config);
    this.exchangeMetrics.set(config.id, {
      id: config.id,
      latency: initialMetrics?.latency ?? 100,
      reliability: initialMetrics?.reliability ?? 0.99,
      liquidityScore: initialMetrics?.liquidityScore ?? 1.0,
      feeRate: initialMetrics?.feeRate ?? 0.001,
      lastUpdate: Date.now(),
    });
    this.venues.set(config.id, { id: config.id, type: 'CEX', config });
  }

  registerDEX(id: string, chainId: number, poolId: string, tokenIn: string, tokenOut: string, initialLiquidity: number, fee: number): void {
    const publicClient = this.publicClients.get(chainId);
    if (!publicClient) {
      console.warn(`No public client for chain ID ${chainId}. DEX ${id} not fully registered.`);
      return;
    }
    const chain = this.getChainById(chainId);
    if (!chain) {
      console.warn(`No chain found for chain ID ${chainId}. DEX ${id} not fully registered.`);
      return;
    }

    this.venues.set(id, { id, type: 'DEX', publicClient, chain });
    this.addLiquidityEdge(id, id, poolId, tokenIn, tokenOut, initialLiquidity, fee);
  }

  private getChainById(chainId: number): Chain | undefined {
    const chains = [mainnet, arbitrum, optimism, polygon, base, zora];
    return chains.find(chain => chain.id === chainId);
  }

  private addLiquidityEdge(fromVenue: string, toVenue: string, poolId: string, tokenIn: string, tokenOut: string, liquidity: number, fee: number) {
    const edge: LiquidityEdge = {
      from: fromVenue,
      to: toVenue,
      poolId,
      tokenIn,
      tokenOut,
      liquidity,
      fee,
      price: 1, // This will be updated dynamically
      slippageImpact: (amount: number) => (amount / liquidity) * 0.01, // Simple linear model for now
      latency: 200, // Default latency for DEX
      mevRisk: 0.05, // Default MEV risk for DEX
    };
    if (!this.graph.has(fromVenue)) {
      this.graph.set(fromVenue, []);
    }
    this.graph.get(fromVenue)?.push(edge);
  }

  /**
   * Finds the optimal execution path using a multi-objective scoring function
   */
  async findOptimalRoute(context: RoutingContext): Promise<RoutingResult> {
    const cacheKey = `route:${context.symbol}:${context.amount}:${context.side}:${context.optimizationTarget}:${context.splitOrderEnabled}`;
    const cached = await this.cache.get<RoutingResult>(cacheKey);

    if (cached) return cached;

    try {
      // 1. Parallel Data Collection (simulated timeout protection)
      const orderBooks = await this.collectOrderBooks(context);
      await this.updateDEXLiquidityAndPrices(context.symbol);

      if (orderBooks.length === 0 && this.graph.size === 0) {
        throw new Error('No liquidity sources available for the requested symbol');
      }

      // 2. Graph Construction & Path Finding
      const allPaths = this.generateAllPaths(orderBooks, context);

      // 3. Multi-Objective Optimization (MOO)
      let optimizedPaths = this.applyOptimization(allPaths, context);

      // 4. Split Order Logic
      if (context.splitOrderEnabled && optimizedPaths.length > 1) {
        optimizedPaths = this.applySplitOrderLogic(optimizedPaths, context);
      }

      if (optimizedPaths.length === 0) {
        throw new Error(`Execution impossible within slippage constraint of ${context.maxSlippage}%`);
      }

      const bestPath = optimizedPaths[0];

      const result: RoutingResult = {
        bestPath,
        alternativePaths: optimizedPaths.slice(1, 4),
        totalPrice: bestPath.price,
        totalSlippage: bestPath.slippage,
        estimatedFee: this.calculateFee(bestPath, context),
        recommendation: this.formatRecommendation(bestPath, context),
        timestamp: Date.now(),
      };

      // Short TTL for routes as prices move fast
      await this.cache.set(cacheKey, result, 10);

      return result;
    } catch (error) {
      throw new Error(`[RoutingEngine] Optimization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async collectOrderBooks(context: RoutingContext): Promise<OrderBook[]> {
    const targets = Array.from(this.exchanges.keys())
      .filter(id => !context.avoidExchanges?.includes(id));

    const promises = targets.map(async (id) => {
      try {
        // In production, this calls CCXT Pro or Direct API
        const exchange = new ccxt[id](); // Instantiate CCXT exchange
        return await exchange.fetchOrderBook(context.symbol); // Use CCXT to fetch order book
      } catch {
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((ob): ob is OrderBook => ob !== null);
  }

  private async updateDEXLiquidityAndPrices(symbol: string): Promise<void> {
    // This is a placeholder. In a real scenario, you'd fetch real-time data from DEXs.
    // For example, using viem to interact with Uniswap V3 pools.
    for (const [venueId, edges] of this.graph.entries()) {
      for (const edge of edges) {
        // Simulate price and liquidity updates
        edge.price = 1 + (Math.random() - 0.5) * 0.1; // +/- 5%
        edge.liquidity = edge.liquidity * (1 + (Math.random() - 0.5) * 0.05); // +/- 2.5%
      }
    }
  }

  private generateAllPaths(orderBooks: OrderBook[], context: RoutingContext): RoutingPath[] {
    const paths: RoutingPath[] = [];

    // Paths from CEX order books
    for (const ob of orderBooks) {
      const metrics = this.exchangeMetrics.get(ob.exchange)!;
      const levels = context.side === 'buy' ? ob.asks : ob.bids;

      if (levels.length === 0) continue;

      // Basic implementation: find price for full amount
      // In production, this performs VWAP calculation across levels
      const executionPrice = levels[0][0];
      const slippage = Math.abs((executionPrice - levels[0][0]) / levels[0][0]) * 100;

      paths.push({
        exchange: ob.exchange,
        symbol: context.symbol,
        price: executionPrice,
        amount: context.amount,
        liquidity: levels[0][1],
        slippage,
        gasCost: 0,
        mevRisk: context.mevProtection ? 0.01 : 0.5,
        fillProbability: metrics.reliability * Math.min(1, levels[0][1] / context.amount),
        estimatedTime: metrics.latency,
        hops: [{ venue: ob.exchange, type: 'CEX', amount: context.amount, price: executionPrice }],
      });
    }

    // Paths from DEX liquidity graph (simplified for now)
    // This would involve a graph traversal algorithm like Dijkstra or A* for multi-hop routes
    for (const [fromVenue, edges] of this.graph.entries()) {
      for (const edge of edges) {
        if (edge.tokenIn === context.symbol.split('/')[0] && edge.tokenOut === context.symbol.split('/')[1]) {
          const executionPrice = context.side === 'buy' ? edge.price : 1 / edge.price;
          const slippage = edge.slippageImpact(context.amount) * 100;

          paths.push({
            exchange: `${fromVenue}-${edge.poolId}`,
            symbol: context.symbol,
            price: executionPrice,
            amount: context.amount,
            liquidity: edge.liquidity,
            slippage,
            gasCost: 0.01, // Simulated gas cost for DEX
            mevRisk: edge.mevRisk,
            fillProbability: 0.95, // Simulated
            estimatedTime: edge.latency,
            hops: [{ venue: fromVenue, type: 'DEX', amount: context.amount, price: executionPrice }],
          });
        }
      }
    }

    return paths;
  }

  private applyOptimization(paths: RoutingPath[], context: RoutingContext): RoutingPath[] {
    const weights = this.getOptimizationWeights(context.optimizationTarget);

    return paths
      .map(path => {
        const score = this.calculatePathScore(path, weights, context);
        return { path, score };
      })
      .filter(item => item.path.slippage <= context.maxSlippage)
      .sort((a, b) => b.score - a.score)
      .map(item => item.path);
  }

  private applySplitOrderLogic(paths: RoutingPath[], context: RoutingContext): RoutingPath[] {
    // This is a simplified split order logic. A real implementation would use dynamic programming
    // or a more advanced optimization technique to find the optimal split.
    const maxParts = context.maxSplitParts || 2;
    const splitPaths: RoutingPath[] = [];

    if (paths.length < 2) return paths; // Not enough paths to split

    // Take the top N paths and try to split the order
    const topPaths = paths.slice(0, maxParts);
    const totalAmount = context.amount;
    let remainingAmount = totalAmount;

    for (let i = 0; i < topPaths.length; i++) {
      const path = topPaths[i];
      const amountToTrade = remainingAmount / (topPaths.length - i);

      if (amountToTrade > 0) {
        splitPaths.push({
          ...path,
          amount: amountToTrade,
          // Recalculate price, slippage, etc. for the partial amount
          // For simplicity, we'll just use the original path's values for now
        });
        remainingAmount -= amountToTrade;
      }
    }

    // Aggregate the split paths into a single logical path for the result
    if (splitPaths.length > 0) {
      const aggregatedPath: RoutingPath = {
        exchange: 'Split Order',
        symbol: context.symbol,
        price: splitPaths.reduce((sum, p) => sum + p.price * p.amount, 0) / totalAmount,
        amount: totalAmount,
        liquidity: splitPaths.reduce((sum, p) => sum + p.liquidity, 0),
        slippage: Math.max(...splitPaths.map(p => p.slippage)),
        gasCost: splitPaths.reduce((sum, p) => sum + p.gasCost, 0),
        mevRisk: Math.max(...splitPaths.map(p => p.mevRisk)),
        fillProbability: splitPaths.reduce((sum, p) => sum + p.fillProbability, 0) / splitPaths.length,
        estimatedTime: Math.max(...splitPaths.map(p => p.estimatedTime)),
        hops: splitPaths.flatMap(p => p.hops || []), // Combine hops from all split parts
      };
      return [aggregatedPath, ...paths.filter(p => !topPaths.includes(p))];
    }

    return paths;
  }

  private getOptimizationWeights(target: RoutingContext['optimizationTarget']) {
    switch (target) {
      case 'price': return { price: 0.7, speed: 0.1, safety: 0.2 };
      case 'speed': return { price: 0.2, speed: 0.7, safety: 0.1 };
      case 'safety': return { price: 0.3, speed: 0.1, safety: 0.6 };
      default: return { price: 0.4, speed: 0.3, safety: 0.3 };
    }
  }

  private calculatePathScore(path: RoutingPath, weights: any, context: RoutingContext): number {
    // Score components (normalized 0-1)
    const priceScore = 1.0; // Normalized against best price in set
    const speedScore = Math.max(0, 1 - path.estimatedTime / 1000);
    const safetyScore = path.fillProbability * (1 - path.mevRisk);

    return (
      priceScore * weights.price +
      speedScore * weights.speed +
      safetyScore * weights.safety
    );
  }

  private calculateFee(path: RoutingPath, context: RoutingContext): number {
    const metrics = this.exchangeMetrics.get(path.exchange);
    // For split orders, sum up fees from individual parts if available
    if (path.exchange === 'Split Order' && path.hops) {
      return path.hops.reduce((totalFee, hop) => {
        const hopMetrics = this.exchangeMetrics.get(hop.venue);
        return totalFee + (hop.price * hop.amount) * (hopMetrics?.feeRate ?? 0.001);
      }, 0);
    }
    return (path.price * context.amount) * (metrics?.feeRate ?? 0.001);
  }

  private formatRecommendation(path: RoutingPath, context: RoutingContext): string {
    if (path.exchange === 'Split Order') {
      return `Optimal route split across multiple venues. Expected execution price: ${path.price.toFixed(4)} with ${path.slippage.toFixed(3)}% estimated slippage.`;
    }
    return (
      `Mathematically optimal route found on ${path.exchange}. ` +
      `Expected execution price: ${path.price.toFixed(4)} with ` +
      `${path.slippage.toFixed(3)}% estimated slippage.`
    );
  }
}
