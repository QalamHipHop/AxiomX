/**
 * Trading WebSocket Gateway
 * Real-time updates for order books, prices, and trade execution
 */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TradingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TradingGateway.name);
  private subscriptions: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Clean up subscriptions
    for (const [channel, clients] of this.subscriptions) {
      clients.delete(client.id);
    }
  }

  /**
   * Subscribe to order book updates
   */
  @SubscribeMessage('subscribe:orderbook')
  handleOrderBookSubscription(
    client: Socket,
    data: { symbol: string; exchange: string }
  ): void {
    const channel = `orderbook:${data.exchange}:${data.symbol}`;
    client.join(channel);

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    this.subscriptions.get(channel)!.add(client.id);

    this.logger.log(`Client ${client.id} subscribed to ${channel}`);
  }

  /**
   * Subscribe to price updates
   */
  @SubscribeMessage('subscribe:price')
  handlePriceSubscription(client: Socket, data: { symbol: string }): void {
    const channel = `price:${data.symbol}`;
    client.join(channel);

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    this.subscriptions.get(channel)!.add(client.id);

    this.logger.log(`Client ${client.id} subscribed to ${channel}`);
  }

  /**
   * Subscribe to trade execution updates
   */
  @SubscribeMessage('subscribe:trades')
  handleTradeSubscription(client: Socket, data: { symbol: string }): void {
    const channel = `trades:${data.symbol}`;
    client.join(channel);

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    this.subscriptions.get(channel)!.add(client.id);

    this.logger.log(`Client ${client.id} subscribed to ${channel}`);
  }

  /**
   * Unsubscribe from a channel
   */
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, data: { channel: string }): void {
    client.leave(data.channel);
    const subscribers = this.subscriptions.get(data.channel);
    if (subscribers) {
      subscribers.delete(client.id);
    }
    this.logger.log(`Client ${client.id} unsubscribed from ${data.channel}`);
  }

  /**
   * Broadcast order book update
   */
  broadcastOrderBook(
    exchange: string,
    symbol: string,
    orderBook: any
  ): void {
    const channel = `orderbook:${exchange}:${symbol}`;
    this.server.to(channel).emit('orderbook:update', {
      exchange,
      symbol,
      data: orderBook,
      timestamp: Date.now(),
    });
  }

  /**
   * Broadcast price update
   */
  broadcastPrice(symbol: string, price: number, timestamp: number): void {
    const channel = `price:${symbol}`;
    this.server.to(channel).emit('price:update', {
      symbol,
      price,
      timestamp,
    });
  }

  /**
   * Broadcast trade execution
   */
  broadcastTrade(
    symbol: string,
    trade: any
  ): void {
    const channel = `trades:${symbol}`;
    this.server.to(channel).emit('trade:executed', {
      symbol,
      trade,
      timestamp: Date.now(),
    });
  }

  /**
   * Broadcast routing result
   */
  broadcastRoutingResult(userId: string, result: any): void {
    this.server.to(`user:${userId}`).emit('routing:result', {
      result,
      timestamp: Date.now(),
    });
  }

  /**
   * Get subscription statistics
   */
  getStats(): {
    totalChannels: number;
    totalSubscriptions: number;
    connectedClients: number;
  } {
    let totalSubscriptions = 0;
    for (const subscribers of this.subscriptions.values()) {
      totalSubscriptions += subscribers.size;
    }

    return {
      totalChannels: this.subscriptions.size,
      totalSubscriptions,
      connectedClients: this.server.engine.clientsCount,
    };
  }
}
