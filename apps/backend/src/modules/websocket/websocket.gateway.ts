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

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeTicker')
  handleTickerSubscription(client: Socket, symbol: string) {
    client.join(`ticker:${symbol}`);
    this.logger.log(`Client ${client.id} subscribed to ticker: ${symbol}`);
  }

  broadcastTicker(symbol: string, data: any) {
    this.server.to(`ticker:${symbol}`).emit('tickerUpdate', data);
  }
}
