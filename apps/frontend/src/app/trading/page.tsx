'use client';

import { TradeTerminal } from '@/components/trading/TradeTerminal';
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trading Terminal</h1>
        <div className="flex gap-4">
          <select
            value={selectedExchange}
            onChange={(e) => setSelectedExchange(e.target.value)}
            className="bg-card border border-border rounded-md px-3 py-1 text-sm"
          >
            {exchanges.map((ex) => (
              <option key={ex} value={ex}>{ex.toUpperCase()}</option>
            ))}
          </select>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="bg-card border border-border rounded-md px-3 py-1 text-sm"
          >
            {markets.slice(0, 100).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-lg h-[400px] flex items-center justify-center">
            {ticker ? (
              <div className="text-center">
                <p className="text-4xl font-bold">${ticker.last?.toLocaleString()}</p>
                <p className={`text-sm ${ticker.percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {ticker.percentage?.toFixed(2)}% (24h)
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a market to view ticker</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-4 text-red-400">Asks</h3>
              <div className="space-y-1">
                {orderBook?.asks?.slice(0, 10).map((ask: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{ask[0]}</span>
                    <span className="text-muted-foreground">{ask[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-4 text-green-400">Bids</h3>
              <div className="space-y-1">
                {orderBook?.bids?.slice(0, 10).map((bid: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{bid[0]}</span>
                    <span className="text-muted-foreground">{bid[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 lg:col-span-4">
          <TradeTerminal />
        </div>
      </div>
    </div>
  );
}
