import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { TradingService } from './trading.service';
import { TradingServiceUpgraded } from './trading.service.upgraded';
import { SyntheticLimitOrderService } from './synthetic-limit-order.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Trading')
@Controller('trading')
export class TradingController {
  constructor(
    private readonly tradingService: TradingService,
    private readonly tradingServiceUpgraded: TradingServiceUpgraded,
    private readonly syntheticOrderService: SyntheticLimitOrderService,
  ) {}

  @Get('exchanges')
  @ApiOperation({ summary: 'List all supported exchanges' })
  async getExchanges() {
    return {
      exchanges: await this.tradingService.getAllExchanges(),
    };
  }

  @Get('exchanges/:exchangeName/info')
  @ApiOperation({ summary: 'Get exchange information' })
  async getExchangeInfo(@Param('exchangeName') exchangeName: string) {
    return this.tradingService.getExchangeInfo(exchangeName);
  }

  @Get('route')
  @ApiOperation({ summary: 'Find optimal trading route' })
  async getRoute(
    @Query('symbol') symbol: string,
    @Query('amount') amount: number,
    @Query('side') side: 'buy' | 'sell',
    @Query('slippage') slippage?: number,
  ) {
    return this.tradingServiceUpgraded.findOptimalRoute(symbol, amount, side, slippage);
  }

  @Post('execute')
  @ApiOperation({ summary: 'Execute trade with security and routing' })
  async executeTrade(@Body() tradeData: any) {
    return this.tradingServiceUpgraded.executeTrade(
      tradeData.symbol,
      tradeData.amount,
      tradeData.side,
      tradeData.tokenInfo
    );
  }

  @Post('synthetic-limit')
  @ApiOperation({ summary: 'Create a synthetic limit order' })
  async createSyntheticOrder(@Body() orderData: any) {
    return this.syntheticOrderService.createOrder(
      orderData.userId,
      orderData.symbol,
      orderData.side,
      orderData.amount,
      orderData.triggerPrice,
      orderData.limitPrice,
      orderData.expiresInHours
    );
  }
}
