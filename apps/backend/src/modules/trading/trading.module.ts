import { Module } from '@nestjs/common';
import { TradingController } from './trading.controller';
import { TradingService } from './trading.service';
import { WebSocketPoolService } from './websocket-pool.service';
import { TradingGateway } from './trading.gateway';
import { OrderBookAggregatorService } from './order-book-aggregator.service';
import { SyntheticLimitOrderService } from './synthetic-limit-order.service';

@Module({
  controllers: [TradingController],
  providers: [
    TradingService,
    WebSocketPoolService,
    TradingGateway,
    OrderBookAggregatorService,
    SyntheticLimitOrderService,
  ],
  exports: [TradingService, WebSocketPoolService],
})
export class TradingModule {}
