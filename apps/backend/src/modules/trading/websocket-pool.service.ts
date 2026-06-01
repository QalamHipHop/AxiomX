import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class WebSocketPoolService implements OnModuleDestroy {
  private readonly logger = new Logger(WebSocketPoolService.name);
  private readonly connections = new Map<string, any>();
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  async getConnection(exchangeId: string, apiKey?: string, secret?: string) {
    const connectionKey = \`\${exchangeId}-\${apiKey || 'public'}\`;
    
    if (this.connections.has(connectionKey)) {
      return this.connections.get(connectionKey);
    }

    if (!ccxt.pro[exchangeId]) {
      throw new Error(\`Exchange \${exchangeId} does not support WebSocket (CCXT Pro)\`);
    }

    const exchange = new ccxt.pro[exchangeId]({
      apiKey,
      secret,
      enableRateLimit: true,
      options: {
        defaultType: 'spot',
      },
    });

    this.connections.set(connectionKey, exchange);
    this.logger.log(\`Established new WS connection to \${exchangeId}\`);
    
    return exchange;
  }

  async watchOrderBook(exchangeId: string, symbol: string) {
    const exchange = await this.getConnection(exchangeId);
    let attempts = 0;

    while (attempts < this.MAX_RECONNECT_ATTEMPTS) {
      try {
        const orderbook = await exchange.watchOrderBook(symbol);
        return orderbook;
      } catch (e) {
        attempts++;
        this.logger.error(\`Error watching orderbook on \${exchangeId}: \${e.message}\`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
  }

  async onModuleDestroy() {
    for (const [key, exchange] of this.connections.entries()) {
      try {
        await exchange.close();
        this.logger.log(\`Closed WS connection for \${key}\`);
      } catch (e) {
        this.logger.error(\`Error closing connection \${key}: \${e.message}\`);
      }
    }
    this.connections.clear();
  }
}
