'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');

  useEffect(() => {
    // Check backend connectivity
    const checkBackend = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`);
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      } catch (error) {
        setBackendStatus('disconnected');
      }
    };

    checkBackend();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f1e] to-[#1a1a2e] text-white">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b border-[#00d4ff]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gradient">AxiomX</div>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-[#00d4ff] transition-smooth">
              Dashboard
            </Link>
            <Link href="/trading" className="hover:text-[#00d4ff] transition-smooth">
              Trading
            </Link>
            <Link href="/auth/login" className="px-4 py-2 bg-[#0066ff] rounded-lg hover:bg-[#0052cc] transition-smooth">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Mathematical Precision in Every Trade
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Infinite Liquidity. Zero Custody. Where Equations Meet Execution.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-[#0066ff] rounded-lg font-semibold hover:bg-[#0052cc] transition-smooth shadow-glow"
            >
              Get Started
            </Link>
            <Link
              href="/trading"
              className="px-8 py-3 border border-[#00d4ff] rounded-lg font-semibold hover:bg-[#00d4ff]/10 transition-smooth"
            >
              Explore Trading
            </Link>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="glass p-6 rounded-lg border border-[#00d4ff]/30">
            <div className="text-3xl font-bold text-gradient mb-2">50+</div>
            <p className="text-gray-300">Integrated Exchanges</p>
          </div>
          <div className="glass p-6 rounded-lg border border-[#00d4ff]/30">
            <div className="text-3xl font-bold text-gradient mb-2">10,000+</div>
            <p className="text-gray-300">Supported Tokens</p>
          </div>
          <div className="glass p-6 rounded-lg border border-[#00d4ff]/30">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${backendStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-semibold">
                {backendStatus === 'connected' ? 'Backend Connected' : 'Backend Offline'}
              </span>
            </div>
            <p className="text-gray-300">API Status</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-20">
          <div className="glass p-8 rounded-lg border border-[#00d4ff]/30">
            <h3 className="text-2xl font-bold mb-4">Smart Routing Engine</h3>
            <p className="text-gray-300">
              Advanced mathematical optimization algorithms deliver optimal execution with minimal slippage and maximum fill probability.
            </p>
          </div>
          <div className="glass p-8 rounded-lg border border-[#00d4ff]/30">
            <h3 className="text-2xl font-bold mb-4">Non-Custodial</h3>
            <p className="text-gray-300">
              Your funds remain under your control. Connect via Wallet Connect, MPC wallets, or encrypted API keys.
            </p>
          </div>
          <div className="glass p-8 rounded-lg border border-[#00d4ff]/30">
            <h3 className="text-2xl font-bold mb-4">AI-Powered Trading</h3>
            <p className="text-gray-300">
              Advanced trading bots, DCA strategies, grid trading, and copy trading with AI-driven decision engines.
            </p>
          </div>
          <div className="glass p-8 rounded-lg border border-[#00d4ff]/30">
            <h3 className="text-2xl font-bold mb-4">Real-Time Analytics</h3>
            <p className="text-gray-300">
              TradingView integration, aggregated order books, and advanced portfolio analytics with Monte Carlo simulations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00d4ff]/20 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2026 AxiomX. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
