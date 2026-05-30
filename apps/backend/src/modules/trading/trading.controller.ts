import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TradingService } from './trading.service';

@ApiTags('Trading')
@Controller('trading')
export class TradingController {
  constructor(private tradingService: TradingService) {}

  @Get('exchanges')
  @ApiOperation({ summary: 'Get all available exchanges' })
  @ApiResponse({ status: 200, description: 'List of available exchanges' })
  async getExchanges() {
    return {
      exchanges: await this.tradingService.getAllExchanges(),
    };
  }

  @Get('exchanges/:exchangeName/info')
  @ApiOperation({ summary: 'Get exchange information' })
  @ApiResponse({ status: 200, description: 'Exchange information' })
  async getExchangeInfo(@Param('exchangeName') exchangeName: string) {
    return this.tradingService.getExchangeInfo(exchangeName);
  }

  @Get('exchanges/:exchangeName/markets')
  @ApiOperation({ summary: 'Get markets for an exchange' })
  @ApiResponse({ status: 200, description: 'List of markets' })
  async getMarkets(@Param('exchangeName') exchangeName: string) {
    const markets = await this.tradingService.getExchangeMarkets(exchangeName);
    return { exchangeName, markets };
  }

  @Get('exchanges/:exchangeName/orderbook/:symbol')
  @ApiOperation({ summary: 'Get order book for a symbol' })
  @ApiResponse({ status: 200, description: 'Order book data' })
  async getOrderBook(
    @Param('exchangeName') exchangeName: string,
    @Param('symbol') symbol: string,
    @Query('limit') limit?: number,
  ) {
    const orderBook = await this.tradingService.getOrderBook(exchangeName, symbol, limit);
    return { exchangeName, symbol, orderBook };
  }

  @Get('exchanges/:exchangeName/ticker/:symbol')
  @ApiOperation({ summary: 'Get ticker for a symbol' })
  @ApiResponse({ status: 200, description: 'Ticker data' })
  async getTicker(
    @Param('exchangeName') exchangeName: string,
    @Param('symbol') symbol: string,
  ) {
    const ticker = await this.tradingService.getTicker(exchangeName, symbol);
    return { exchangeName, symbol, ticker };
  }
}
