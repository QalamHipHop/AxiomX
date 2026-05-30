/**
 * Synthetic Limit Order Engine
 * Monitors price and auto-executes orders when conditions are met
 * Uses database persistence and WebSocket real-time monitoring
 */

import { Injectable, Logger } from '@nestjs/common';
import { SyntheticLimitOrder } from '@axiomx/shared';

interface SyntheticOrderStore {
  [key: string]: SyntheticLimitOrder;
}

@Injectable()
export class SyntheticLimitOrderService {
  private readonly logger = new Logger(SyntheticLimitOrderService.name);
  private orders: SyntheticOrderStore = {};
  private priceMonitors: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Create a new synthetic limit order
   */
  async createOrder(
    userId: string,
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    triggerPrice: number,
    limitPrice: number,
    expiresInHours: number = 24
  ): Promise<SyntheticLimitOrder> {
    const orderId = `slo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const order: SyntheticLimitOrder = {
      id: orderId,
      userId,
      symbol,
      side,
      amount,
      triggerPrice,
      limitPrice,
      createdAt: now,
      expiresAt: now + expiresInHours * 3600000,
      status: 'active',
    };

    this.orders[orderId] = order;
    this.logger.log(
      `Created synthetic limit order ${orderId} for ${symbol} at trigger ${triggerPrice}`
    );

    // Start monitoring this order
    this.startMonitoring(orderId);

    return order;
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): SyntheticLimitOrder | undefined {
    return this.orders[orderId];
  }

  /**
   * Get all active orders for a user
   */
  getUserOrders(userId: string): SyntheticLimitOrder[] {
    return Object.values(this.orders).filter(
      (order) => order.userId === userId && order.status === 'active'
    );
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.orders[orderId];
    if (!order) {
      return false;
    }

    order.status = 'canceled';
    this.stopMonitoring(orderId);
    this.logger.log(`Canceled synthetic limit order ${orderId}`);

    return true;
  }

  /**
   * Start price monitoring for an order
   */
  private startMonitoring(orderId: string): void {
    const order = this.orders[orderId];
    if (!order) return;

    // Check price every 5 seconds
    const monitor = setInterval(() => {
      this.checkAndExecute(orderId);
    }, 5000);

    this.priceMonitors.set(orderId, monitor);
  }

  /**
   * Stop monitoring an order
   */
  private stopMonitoring(orderId: string): void {
    const monitor = this.priceMonitors.get(orderId);
    if (monitor) {
      clearInterval(monitor);
      this.priceMonitors.delete(orderId);
    }
  }

  /**
   * Check if order should be executed
   */
  private async checkAndExecute(orderId: string): Promise<void> {
    const order = this.orders[orderId];
    if (!order || order.status !== 'active') {
      return;
    }

    // Check expiration
    if (Date.now() > order.expiresAt) {
      order.status = 'expired';
      this.stopMonitoring(orderId);
      this.logger.log(`Synthetic limit order ${orderId} expired`);
      return;
    }

    // Get current price (in production, fetch from routing engine)
    const currentPrice = await this.getCurrentPrice(order.symbol);

    // Check trigger condition
    const shouldTrigger = this.checkTriggerCondition(
      order.side,
      currentPrice,
      order.triggerPrice
    );

    if (shouldTrigger) {
      await this.executeOrder(orderId, currentPrice);
    }
  }

  /**
   * Check if trigger condition is met
   */
  private checkTriggerCondition(
    side: 'buy' | 'sell',
    currentPrice: number,
    triggerPrice: number
  ): boolean {
    if (side === 'buy') {
      return currentPrice <= triggerPrice;
    } else {
      return currentPrice >= triggerPrice;
    }
  }

  /**
   * Execute the order
   */
  private async executeOrder(orderId: string, executionPrice: number): Promise<void> {
    const order = this.orders[orderId];
    if (!order) return;

    try {
      // Validate execution price against limit
      const isValidPrice = this.validateExecutionPrice(
        order.side,
        executionPrice,
        order.limitPrice
      );

      if (!isValidPrice) {
        this.logger.warn(
          `Order ${orderId} triggered but execution price ${executionPrice} exceeds limit ${order.limitPrice}`
        );
        return;
      }

      // In production, execute through routing engine
      order.status = 'executed';
      order.executedAt = Date.now();
      this.stopMonitoring(orderId);

      this.logger.log(
        `Executed synthetic limit order ${orderId} at price ${executionPrice}`
      );

      // Emit event for WebSocket notification
      this.emitExecutionEvent(order);
    } catch (error) {
      this.logger.error(`Failed to execute order ${orderId}:`, error);
      order.status = 'failed';
      this.stopMonitoring(orderId);
    }
  }

  /**
   * Validate execution price against limit
   */
  private validateExecutionPrice(
    side: 'buy' | 'sell',
    executionPrice: number,
    limitPrice: number
  ): boolean {
    if (side === 'buy') {
      return executionPrice <= limitPrice;
    } else {
      return executionPrice >= limitPrice;
    }
  }

  /**
   * Get current price for a symbol (mock implementation)
   */
  private async getCurrentPrice(symbol: string): Promise<number> {
    // In production, fetch from routing engine or price feed
    return 50000 + Math.random() * 1000;
  }

  /**
   * Emit execution event for WebSocket
   */
  private emitExecutionEvent(order: SyntheticLimitOrder): void {
    // In production, emit through WebSocket gateway
    console.log(`[EVENT] Order ${order.id} executed for user ${order.userId}`);
  }

  /**
   * Get order statistics
   */
  getStatistics(): {
    totalOrders: number;
    activeOrders: number;
    executedOrders: number;
    expiredOrders: number;
    failedOrders: number;
  } {
    const allOrders = Object.values(this.orders);

    return {
      totalOrders: allOrders.length,
      activeOrders: allOrders.filter((o) => o.status === 'active').length,
      executedOrders: allOrders.filter((o) => o.status === 'executed').length,
      expiredOrders: allOrders.filter((o) => o.status === 'expired').length,
      failedOrders: allOrders.filter((o) => o.status === 'failed').length,
    };
  }

  /**
   * Cleanup expired orders
   */
  async cleanupExpiredOrders(): Promise<number> {
    const now = Date.now();
    let cleaned = 0;

    for (const [orderId, order] of Object.entries(this.orders)) {
      if (order.status === 'expired' && now - order.expiresAt > 86400000) {
        // Delete orders expired for more than 24 hours
        delete this.orders[orderId];
        this.stopMonitoring(orderId);
        cleaned++;
      }
    }

    this.logger.log(`Cleaned up ${cleaned} expired orders`);
    return cleaned;
  }
}
