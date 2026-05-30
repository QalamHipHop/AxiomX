import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradingService } from './trading.service';
import { TradingController } from './trading.controller';
import { SyntheticLimitOrderService } from './synthetic-limit-order.service';
import { OrderBookAggregatorService } from './order-book-aggregator.service';
import { SyntheticLimitOrderEntity } from './synthetic-limit-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SyntheticLimitOrderEntity])],
  providers: [
    TradingService, 
    TradingServiceUpgraded,
    SyntheticLimitOrderService, 
    OrderBookAggregatorService
  ],
  controllers: [TradingController],
  exports: [
    TradingService, 
    TradingServiceUpgraded,
    SyntheticLimitOrderService, 
    OrderBookAggregatorService
  ],
})
export class TradingModule {}
