/**
 * AxiomX Frontend API Service (Upgraded)
 * Handles all backend communication with WebSocket support
 */

import axios, { AxiosInstance } from 'axios';
import io, { Socket } from 'socket.io-client';
import { RoutingResult, TokenSecurityReport } from '@axiomx/shared';

class ApiService {
  private axiosInstance: AxiosInstance;
  private socket: Socket | null = null;
  private baseURL: string;
  private wsURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    this.wsURL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000';

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Initialize WebSocket connection
   */
  connectWebSocket(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.wsURL, {
          auth: token ? { token } : undefined,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected');
          resolve();
        });

        this.socket.on('disconnect', () => {
          console.log('WebSocket disconnected');
        });

        this.socket.on('error', (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Subscribe to order book updates
   */
  subscribeToOrderBook(
    symbol: string,
    exchange: string,
    callback: (data: any) => void
  ): void {
    if (!this.socket) {
      console.warn('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe:orderbook', { symbol, exchange });
    this.socket.on('orderbook:update', callback);
  }

  /**
   * Subscribe to price updates
   */
  subscribeToPrices(symbol: string, callback: (data: any) => void): void {
    if (!this.socket) {
      console.warn('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe:price', { symbol });
    this.socket.on('price:update', callback);
  }

  /**
   * Subscribe to trade updates
   */
  subscribeToTrades(symbol: string, callback: (data: any) => void): void {
    if (!this.socket) {
      console.warn('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe:trades', { symbol });
    this.socket.on('trade:executed', callback);
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channel: string): void {
    if (!this.socket) return;
    this.socket.emit('unsubscribe', { channel });
  }

  // ============ Trading Endpoints ============

  /**
   * Find optimal route for a trade
   */
  async findOptimalRoute(
    symbol: string,
    amount: number,
    side: 'buy' | 'sell',
    maxSlippage?: number
  ): Promise<RoutingResult> {
    const response = await this.axiosInstance.post('/api/trading/route', {
      symbol,
      amount,
      side,
      maxSlippage,
    });
    return response.data;
  }

  /**
   * Scan token for security risks
   */
  async scanToken(tokenAddress: string, chainId: number): Promise<TokenSecurityReport> {
    const response = await this.axiosInstance.post('/api/trading/scan-token', {
      tokenAddress,
      chainId,
    });
    return response.data;
  }

  /**
   * Execute a trade
   */
  async executeTrade(
    symbol: string,
    amount: number,
    side: 'buy' | 'sell',
    maxSlippage?: number
  ): Promise<any> {
    const response = await this.axiosInstance.post('/api/trading/execute', {
      symbol,
      amount,
      side,
      maxSlippage,
    });
    return response.data;
  }

  /**
   * Get market data
   */
  async getMarketData(exchange: string, symbol: string): Promise<any> {
    const response = await this.axiosInstance.get(
      `/api/trading/market/${exchange}/${symbol}`
    );
    return response.data;
  }

  /**
   * Get order book
   */
  async getOrderBook(exchange: string, symbol: string, limit?: number): Promise<any> {
    const response = await this.axiosInstance.get(
      `/api/trading/orderbook/${exchange}/${symbol}`,
      { params: { limit } }
    );
    return response.data;
  }

  /**
   * Get all exchanges
   */
  async getExchanges(): Promise<string[]> {
    const response = await this.axiosInstance.get('/api/trading/exchanges');
    return response.data;
  }

  /**
   * Get exchange info
   */
  async getExchangeInfo(exchange: string): Promise<any> {
    const response = await this.axiosInstance.get(`/api/trading/exchanges/${exchange}`);
    return response.data;
  }

  // ============ Synthetic Limit Orders ============

  /**
   * Create synthetic limit order
   */
  async createSyntheticOrder(
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    triggerPrice: number,
    limitPrice: number
  ): Promise<any> {
    const response = await this.axiosInstance.post('/api/trading/synthetic-orders', {
      symbol,
      side,
      amount,
      triggerPrice,
      limitPrice,
    });
    return response.data;
  }

  /**
   * Get user's synthetic orders
   */
  async getSyntheticOrders(): Promise<any[]> {
    const response = await this.axiosInstance.get('/api/trading/synthetic-orders');
    return response.data;
  }

  /**
   * Cancel synthetic order
   */
  async cancelSyntheticOrder(orderId: string): Promise<void> {
    await this.axiosInstance.delete(`/api/trading/synthetic-orders/${orderId}`);
  }

  // ============ Authentication ============

  /**
   * Login
   */
  async login(email: string, password: string): Promise<any> {
    const response = await this.axiosInstance.post('/api/auth/login', {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  }

  /**
   * Register
   */
  async register(email: string, password: string, username: string): Promise<any> {
    const response = await this.axiosInstance.post('/api/auth/register', {
      email,
      password,
      username,
    });
    return response.data;
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('authToken');
    this.disconnectWebSocket();
  }

  // ============ API Keys ============

  /**
   * Create API key
   */
  async createApiKey(name: string, exchange: string): Promise<any> {
    const response = await this.axiosInstance.post('/api/keys', {
      name,
      exchange,
    });
    return response.data;
  }

  /**
   * Get API keys
   */
  async getApiKeys(): Promise<any[]> {
    const response = await this.axiosInstance.get('/api/keys');
    return response.data;
  }

  /**
   * Delete API key
   */
  async deleteApiKey(keyId: string): Promise<void> {
    await this.axiosInstance.delete(`/api/keys/${keyId}`);
  }

  // ============ Health ============

  /**
   * Check API health
   */
  async getHealth(): Promise<any> {
    const response = await this.axiosInstance.get('/api/health');
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
