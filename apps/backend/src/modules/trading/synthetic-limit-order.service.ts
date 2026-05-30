import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyntheticLimitOrderEntity } from './synthetic-limit-order.entity';

@Injectable()
export class SyntheticLimitOrderService implements OnModuleInit {
  private readonly logger = new Logger(SyntheticLimitOrderService.name);
  private priceMonitors: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    @InjectRepository(SyntheticLimitOrderEntity)
    private orderRepository: Repository<SyntheticLimitOrderEntity>,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing synthetic limit order monitors...');
    const activeOrders = await this.orderRepository.find({ where: { status: 'active' } });
    for (const order of activeOrders) {
      this.startMonitoring(order.id);
    }
    this.logger.log(`Started monitoring ${activeOrders.length} active orders`);
  }

  async createOrder(
    userId: string,
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    triggerPrice: number,
    limitPrice: number,
    expiresInHours: number = 24
  ): Promise<SyntheticLimitOrderEntity> {
    const now = Date.now();
    const order = this.orderRepository.create({
      userId,
      symbol,
      side,
      amount,
      triggerPrice,
      limitPrice,
      expiresAt: now + expiresInHours * 3600000,
      status: 'active',
    });

    const savedOrder = await this.orderRepository.save(order);
    this.startMonitoring(savedOrder.id);
    
    return savedOrder;
  }

  async cancelOrder(orderId: string, userId: string): Promise<boolean> {
    const order = await this.orderRepository.findOne({ where: { id: orderId, userId } });
    if (!order) return false;

    order.status = 'canceled';
    await this.orderRepository.save(order);
    this.stopMonitoring(orderId);
    return true;
  }

  private startMonitoring(orderId: string): void {
    if (this.priceMonitors.has(orderId)) return;

    const monitor = setInterval(() => {
      this.checkAndExecute(orderId);
    }, 5000);

    this.priceMonitors.set(orderId, monitor);
  }

  private stopMonitoring(orderId: string): void {
    const monitor = this.priceMonitors.get(orderId);
    if (monitor) {
      clearInterval(monitor);
      this.priceMonitors.delete(orderId);
    }
  }

  private async checkAndExecute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order || order.status !== 'active') {
      this.stopMonitoring(orderId);
      return;
    }

    if (Date.now() > Number(order.expiresAt)) {
      order.status = 'expired';
      await this.orderRepository.save(order);
      this.stopMonitoring(orderId);
      return;
    }

    const currentPrice = await this.getCurrentPrice(order.symbol);
    const shouldTrigger = order.side === 'buy' 
      ? currentPrice <= order.triggerPrice 
      : currentPrice >= order.triggerPrice;

    if (shouldTrigger) {
      await this.executeOrder(order, currentPrice);
    }
  }

  private async executeOrder(order: SyntheticLimitOrderEntity, executionPrice: number): Promise<void> {
    try {
      // In production, integrate with SmartRoutingEngine here
      order.status = 'executed';
      order.executedAt = Date.now();
      await this.orderRepository.save(order);
      this.stopMonitoring(order.id);
      this.logger.log(`Executed order ${order.id} at ${executionPrice}`);
    } catch (error) {
      this.logger.error(`Execution failed for ${order.id}:`, error);
      order.status = 'failed';
      await this.orderRepository.save(order);
      this.stopMonitoring(order.id);
    }
  }

  private async getCurrentPrice(symbol: string): Promise<number> {
    // Placeholder: in production, this should use the price feed from CCXT or WebSocket
    return 50000 + Math.random() * 1000;
  }
}
