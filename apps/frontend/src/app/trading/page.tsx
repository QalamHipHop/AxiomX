'use client';

import { useState, useEffect } from 'react';
import { tradingAPI } from '@/services/api';

export default function TradingPage() {
  const [exchanges, setExchanges] = useState<string[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<string>('binance');
  const [markets, setMarkets] = useState<string[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC/USDT');
  const [ticker, setTicker] = useState<any>(null);
  const [orderBook, setOrderBook] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load exchanges on mount
  useEffect(() => {
    const loadExchanges = async () => {
      try {
        const response = await tradingAPI.getExchanges();
        setExchanges(response.data.exchanges);
      } catch (error) {
        console.error('Failed to load exchanges:', error);
      }
    };
    loadExchanges();
  }, []);

  // Load markets when exchange changes
  useEffect(() => {
    const loadMarkets = async () => {
      if (!selectedExchange) return;
      try {
        setLoading(true);
        const response = await tradingAPI.getMarkets(selectedExchange);
        setMarkets(response.data.markets);
      } catch (error) {
        console.error('Failed to load markets:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMarkets();
  }, [selectedExchange]);

  // Load ticker and order book when market changes
  useEffect(() => {
    const loadMarketData = async () => {
      if (!selectedExchange || !selectedMarket) return;
      try {
        setLoading(true);
        const [tickerRes, orderBookRes] = await Promise.all([
          tradingAPI.getTicker(selectedExchange, selectedMarket),
          tradingAPI.getOrderBook(selectedExchange, selectedMarket, 20),
        ]);
        setTicker(tickerRes.data.ticker);
        setOrderBook(orderBookRes.data.orderBook);
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMarketData();
  }, [selectedExchange, selectedMarket]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f1e] to-[#1a1a2e] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Trading Terminal</h1>

        {/* Controls */}
        <div className="glass p-6 rounded-lg border border-[#00d4ff]/30 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Exchange</label>
              <select
                value={selectedExchange}
                onChange={(e) => setSelectedExchange(e.target.value)}
                className="w-full bg-[#1a1a2e] border border-[#00d4ff]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00d4ff]"
              >
                {exchanges.map((exchange) => (
                  <option key={exchange} value={exchange}>
                    {exchange.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Market</label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full bg-[#1a1a2e] border border-[#00d4ff]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00d4ff]"
              >
                {markets.slice(0, 50).map((market) => (
                  <option key={market} value={market}>
                    {market}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && <div className="text-center py-8">Loading market data...</div>}

        {!loading && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ticker Info */}
            {ticker && (
              <div className="glass p-6 rounded-lg border border-[#00d4ff]/30">
                <h2 className="text-2xl font-bold mb-4">Ticker: {selectedMarket}</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Price:</span>
                    <span className="font-semibold">${ticker.last?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">24h High:</span>
                    <span className="font-semibold">${ticker.high?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">24h Low:</span>
                    <span className="font-semibold">${ticker.low?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">24h Volume:</span>
                    <span className="font-semibold">{ticker.quoteVolume?.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Book */}
            {orderBook && (
              <div className="glass p-6 rounded-lg border border-[#00d4ff]/30">
                <h2 className="text-2xl font-bold mb-4">Order Book</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-red-400 mb-2">Asks (Sell)</h3>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {orderBook.asks?.slice(0, 10).map((ask: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm text-gray-300">
                          <span>{ask[0]?.toFixed(2)}</span>
                          <span>{ask[1]?.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-400 mb-2">Bids (Buy)</h3>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {orderBook.bids?.slice(0, 10).map((bid: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm text-gray-300">
                          <span>{bid[0]?.toFixed(2)}</span>
                          <span>{bid[1]?.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
