/**
 * Aggregated Multi-Venue Order Book Service
 * Consolidates order books from multiple exchanges into a unified view
 * Provides real-time best bid/ask and liquidity analysis
 */

import { Injectable, Logger } from '@nestjs/common';
import { OrderBook } from '@axiomx/shared';

interface AggregatedOrderBook {
  symbol: string;
  timestamp: number;
  bestBid: { price: number; amount: number; exchange: string };
  bestAsk: { price: number; amount: number; exchange: string };
  spread: number;
  spreadPercentage: number;
  totalBidLiquidity: number;
  totalAskLiquidity: number;
  venues: {
    [exchange: string]: {
      bids: Array<[number, number]>;
      asks: Array<[number, number]>;
      timestamp: number;
    };
  };
}

@Injectable()
export class OrderBookAggregatorService {
  private readonly logger = new Logger(OrderBookAggregatorService.name);
  private orderBooks: Map<string, AggregatedOrderBook> = new Map();
  private exchangeOrderBooks: Map<string, OrderBook> = new Map();

  /**
   * Update order book from an exchange
   */
  updateOrderBook(orderBook: OrderBook): void {
    const key = `${orderBook.exchange}:${orderBook.symbol}`;
    this.exchangeOrderBooks.set(key, orderBook);

    // Trigger aggregation
    this.aggregateOrderBooks(orderBook.symbol);
  }

  /**
   * Get aggregated order book for a symbol
   */
  getAggregatedOrderBook(symbol: string): AggregatedOrderBook | undefined {
    return this.orderBooks.get(symbol);
  }

  /**
   * Get best bid across all exchanges
   */
  getBestBid(symbol: string): { price: number; amount: number; exchange: string } | null {
    const aggregated = this.orderBooks.get(symbol);
    return aggregated ? aggregated.bestBid : null;
  }

  /**
   * Get best ask across all exchanges
   */
  getBestAsk(symbol: string): { price: number; amount: number; exchange: string } | null {
    const aggregated = this.orderBooks.get(symbol);
    return aggregated ? aggregated.bestAsk : null;
  }

  /**
   * Get bid-ask spread
   */
  getSpread(symbol: string): { spread: number; percentage: number } | null {
    const aggregated = this.orderBooks.get(symbol);
    if (!aggregated) return null;

    return {
      spread: aggregated.spread,
      percentage: aggregated.spreadPercentage,
    };
  }

  /**
   * Get total liquidity at a price level
   */
  getLiquidityAtLevel(
    symbol: string,
    price: number,
    side: 'buy' | 'sell',
    tolerance: number = 0.01
  ): number {
    const aggregated = this.orderBooks.get(symbol);
    if (!aggregated) return 0;

    const levels = side === 'buy' ? this.getAllBids(symbol) : this.getAllAsks(symbol);
    const minPrice = price * (1 - tolerance);
    const maxPrice = price * (1 + tolerance);

    return levels
      .filter(([p]) => p >= minPrice && p <= maxPrice)
      .reduce((sum, [, amount]) => sum + amount, 0);
  }

  /**
   * Get all bids from all exchanges
   */
  private getAllBids(symbol: string): Array<[number, number]> {
    const bids: Array<[number, number]> = [];

    for (const [key, ob] of this.exchangeOrderBooks) {
      if (ob.symbol === symbol) {
        bids.push(...ob.bids);
      }
    }

    // Sort by price descending and deduplicate
    return this.deduplicateAndSort(bids, 'desc');
  }

  /**
   * Get all asks from all exchanges
   */
  private getAllAsks(symbol: string): Array<[number, number]> {
    const asks: Array<[number, number]> = [];

    for (const [key, ob] of this.exchangeOrderBooks) {
      if (ob.symbol === symbol) {
        asks.push(...ob.asks);
      }
    }

    // Sort by price ascending and deduplicate
    return this.deduplicateAndSort(asks, 'asc');
  }

  /**
   * Deduplicate and sort order book levels
   */
  private deduplicateAndSort(
    levels: Array<[number, number]>,
    direction: 'asc' | 'desc'
  ): Array<[number, number]> {
    const priceMap = new Map<number, number>();

    for (const [price, amount] of levels) {
      const rounded = Math.round(price * 100000) / 100000;
      priceMap.set(rounded, (priceMap.get(rounded) || 0) + amount);
    }

    const sorted = Array.from(priceMap.entries()).sort((a, b) => {
      return direction === 'asc' ? a[0] - b[0] : b[0] - a[0];
    });

    return sorted;
  }

  /**
   * Aggregate order books for a symbol
   */
  private aggregateOrderBooks(symbol: string): void {
    const bids = this.getAllBids(symbol);
    const asks = this.getAllAsks(symbol);

    if (bids.length === 0 || asks.length === 0) {
      this.logger.warn(`No order book data available for ${symbol}`);
      return;
    }

    const bestBid = bids[0];
    const bestAsk = asks[0];

    const spread = bestAsk[0] - bestBid[0];
    const spreadPercentage = (spread / bestAsk[0]) * 100;

    const totalBidLiquidity = bids.slice(0, 20).reduce((sum, [, amount]) => sum + amount, 0);
    const totalAskLiquidity = asks.slice(0, 20).reduce((sum, [, amount]) => sum + amount, 0);

    // Build venues map
    const venues: { [key: string]: any } = {};
    for (const [key, ob] of this.exchangeOrderBooks) {
      if (ob.symbol === symbol) {
        venues[ob.exchange] = {
          bids: ob.bids,
          asks: ob.asks,
          timestamp: ob.timestamp,
        };
      }
    }

    const aggregated: AggregatedOrderBook = {
      symbol,
      timestamp: Date.now(),
      bestBid: { price: bestBid[0], amount: bestBid[1], exchange: this.findExchange(symbol, bestBid[0], 'bid') },
      bestAsk: { price: bestAsk[0], amount: bestAsk[1], exchange: this.findExchange(symbol, bestAsk[0], 'ask') },
      spread,
      spreadPercentage,
      totalBidLiquidity,
      totalAskLiquidity,
      venues,
    };

    this.orderBooks.set(symbol, aggregated);
    this.logger.debug(
      `Aggregated order book for ${symbol}: spread ${spreadPercentage.toFixed(4)}%`
    );
  }

  /**
   * Find which exchange has the best price
   */
  private findExchange(
    symbol: string,
    price: number,
    side: 'bid' | 'ask'
  ): string {
    for (const [key, ob] of this.exchangeOrderBooks) {
      if (ob.symbol === symbol) {
        const levels = side === 'bid' ? ob.bids : ob.asks;
        if (levels.some(([p]) => Math.abs(p - price) < 0.0001)) {
          return ob.exchange;
        }
      }
    }
    return 'unknown';
  }

  /**
   * Get order book depth (top N levels)
   */
  getDepth(
    symbol: string,
    depth: number = 10
  ): { bids: Array<[number, number]>; asks: Array<[number, number]> } | null {
    const aggregated = this.orderBooks.get(symbol);
    if (!aggregated) return null;

    const bids = this.getAllBids(symbol).slice(0, depth);
    const asks = this.getAllAsks(symbol).slice(0, depth);

    return { bids, asks };
  }

  /**
   * Calculate cumulative liquidity
   */
  getCumulativeLiquidity(
    symbol: string,
    side: 'buy' | 'sell',
    depth: number = 20
  ): Array<[number, number]> {
    const levels = side === 'buy' ? this.getAllBids(symbol) : this.getAllAsks(symbol);
    const result: Array<[number, number]> = [];

    let cumulative = 0;
    for (let i = 0; i < Math.min(depth, levels.length); i++) {
      cumulative += levels[i][1];
      result.push([levels[i][0], cumulative]);
    }

    return result;
  }

  /**
   * Estimate slippage for a trade size
   */
  estimateSlippage(symbol: string, side: 'buy' | 'sell', amount: number): number | null {
    const levels = side === 'buy' ? this.getAllAsks(symbol) : this.getAllBids(symbol);
    if (levels.length === 0) return null;

    const bestPrice = levels[0][0];
    let accumulatedAmount = 0;
    let accumulatedCost = 0;

    for (const [price, levelAmount] of levels) {
      const takeAmount = Math.min(amount - accumulatedAmount, levelAmount);
      accumulatedCost += price * takeAmount;
      accumulatedAmount += takeAmount;

      if (accumulatedAmount >= amount) {
        break;
      }
    }

    if (accumulatedAmount < amount) {
      return null; // Insufficient liquidity
    }

    const avgPrice = accumulatedCost / accumulatedAmount;
    const slippage = ((avgPrice - bestPrice) / bestPrice) * 100;

    return slippage;
  }

  /**
   * Get order book statistics
   */
  getStatistics(): {
    totalSymbols: number;
    totalExchanges: number;
    averageSpread: number;
    totalLiquidity: number;
  } {
    const symbols = new Set<string>();
    const exchanges = new Set<string>();
    let totalSpread = 0;
    let spreadCount = 0;
    let totalLiquidity = 0;

    for (const aggregated of this.orderBooks.values()) {
      symbols.add(aggregated.symbol);
      totalSpread += aggregated.spreadPercentage;
      spreadCount++;
      totalLiquidity += aggregated.totalBidLiquidity + aggregated.totalAskLiquidity;
    }

    for (const ob of this.exchangeOrderBooks.values()) {
      exchanges.add(ob.exchange);
    }

    return {
      totalSymbols: symbols.size,
      totalExchanges: exchanges.size,
      averageSpread: spreadCount > 0 ? totalSpread / spreadCount : 0,
      totalLiquidity,
    };
  }
}
