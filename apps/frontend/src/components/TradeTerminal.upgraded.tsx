/**
 * Advanced Trade Terminal Component
 * Real-time order book, price charts, and execution interface
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '@/services/api.upgraded';
import { RoutingResult } from '@axiomx/shared';

interface TradeTerminalProps {
  symbol: string;
  onTrade?: (result: any) => void;
}

interface OrderBookData {
  bids: Array<[number, number]>;
  asks: Array<[number, number]>;
  timestamp: number;
}

interface PriceData {
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export function TradeTerminal({ symbol, onTrade }: TradeTerminalProps) {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [routingResult, setRoutingResult] = useState<RoutingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trade form state
  const [amount, setAmount] = useState('1');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [maxSlippage, setMaxSlippage] = useState('1');

  /**
   * Initialize WebSocket subscriptions
   */
  useEffect(() => {
    const initWebSocket = async () => {
      try {
        await apiService.connectWebSocket();

        // Subscribe to order book updates
        apiService.subscribeToOrderBook(symbol, 'binance', (data) => {
          setOrderBook(data.data);
        });

        // Subscribe to price updates
        apiService.subscribeToPrices(symbol, (data) => {
          setPriceData({
            price: data.price,
            change: data.price - (priceData?.price || data.price),
            changePercent:
              ((data.price - (priceData?.price || data.price)) /
                (priceData?.price || data.price)) *
              100,
            timestamp: data.timestamp,
          });
        });
      } catch (err) {
        console.error('Failed to connect WebSocket:', err);
        setError('Failed to connect to real-time data');
      }
    };

    initWebSocket();

    return () => {
      apiService.disconnectWebSocket();
    };
  }, [symbol]);

  /**
   * Find optimal route
   */
  const handleFindRoute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.findOptimalRoute(
        symbol,
        parseFloat(amount),
        side,
        parseFloat(maxSlippage)
      );
      setRoutingResult(result);
    } catch (err) {
      setError(`Failed to find route: ${err}`);
      console.error('Routing error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol, amount, side, maxSlippage]);

  /**
   * Execute trade
   */
  const handleExecuteTrade = useCallback(async () => {
    if (!routingResult) {
      setError('Please find a route first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.executeTrade(
        symbol,
        parseFloat(amount),
        side,
        parseFloat(maxSlippage)
      );

      onTrade?.(result);
      setAmount('1');
      setRoutingResult(null);
    } catch (err) {
      setError(`Trade execution failed: ${err}`);
      console.error('Trade error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol, amount, side, maxSlippage, routingResult, onTrade]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700">
      <h2 className="text-3xl font-bold text-white mb-6">Trade Terminal</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Book */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">Order Book - {symbol}</h3>

            {/* Price Display */}
            {priceData && (
              <div className="mb-6 p-4 bg-slate-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">Current Price</p>
                    <p className="text-3xl font-bold text-white">
                      ${priceData.price.toFixed(2)}
                    </p>
                  </div>
                  <div className={priceData.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                    <p className="text-lg font-semibold">
                      {priceData.change >= 0 ? '+' : ''}
                      {priceData.change.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      ({priceData.changePercent >= 0 ? '+' : ''}
                      {priceData.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Book Display */}
            {orderBook ? (
              <div className="grid grid-cols-2 gap-4">
                {/* Bids */}
                <div>
                  <h4 className="text-green-500 font-semibold mb-2">Bids</h4>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {orderBook.bids.slice(0, 10).map(([price, amount], idx) => (
                      <div key={idx} className="flex justify-between text-sm text-gray-300">
                        <span className="text-green-400">${price.toFixed(2)}</span>
                        <span>{amount.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asks */}
                <div>
                  <h4 className="text-red-500 font-semibold mb-2">Asks</h4>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {orderBook.asks.slice(0, 10).map(([price, amount], idx) => (
                      <div key={idx} className="flex justify-between text-sm text-gray-300">
                        <span className="text-red-400">${price.toFixed(2)}</span>
                        <span>{amount.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Loading order book...</p>
            )}
          </div>
        </div>

        {/* Right: Trade Form */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Execute Trade</h3>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Trade Form */}
          <div className="space-y-4">
            {/* Side Selection */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Side</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSide('buy')}
                  className={`flex-1 py-2 rounded font-semibold transition ${
                    side === 'buy'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setSide('sell')}
                  className={`flex-1 py-2 rounded font-semibold transition ${
                    side === 'sell'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Max Slippage Input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Max Slippage (%)
              </label>
              <input
                type="number"
                value={maxSlippage}
                onChange={(e) => setMaxSlippage(e.target.value)}
                placeholder="1.0"
                step="0.1"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Routing Result Display */}
            {routingResult && (
              <div className="p-3 bg-slate-700 rounded border border-slate-600">
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-semibold">Best Exchange:</span>{' '}
                  {routingResult.bestPath.exchange}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-semibold">Price:</span> ${routingResult.bestPath.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Slippage:</span>{' '}
                  <span className={routingResult.bestPath.slippage > 0 ? 'text-red-400' : 'text-green-400'}>
                    {routingResult.bestPath.slippage.toFixed(4)}%
                  </span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleFindRoute}
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-semibold transition"
              >
                {loading ? 'Finding Route...' : 'Find Route'}
              </button>
              <button
                onClick={handleExecuteTrade}
                disabled={loading || !routingResult}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded font-semibold transition"
              >
                {loading ? 'Executing...' : 'Execute'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
