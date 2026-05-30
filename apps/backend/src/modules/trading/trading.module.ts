import { Module } from '@nestjs/common';
import { TradingService } from './trading.service';
import { TradingController } from './trading.controller';
import { SyntheticLimitOrderService } from './synthetic-limit-order.service';
import { OrderBookAggregatorService } from './order-book-aggregator.service';

@Module({
  providers: [TradingService, SyntheticLimitOrderService, OrderBookAggregatorService],
  controllers: [TradingController],
  exports: [TradingService, SyntheticLimitOrderService, OrderBookAggregatorService],
})
export class TradingModule {}
