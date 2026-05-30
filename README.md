# AxiomX: Mathematical Precision in Every Trade

"Mathematical Precision in Every Trade. Infinite Liquidity. Zero Custody. Where Equations Meet Execution."

## Project Vision

AxiomX is a next-generation, production-grade, non-custodial Crypto Super Aggregator that intelligently routes orders across 50+ top CEXs and DEXs using advanced mathematical optimization, AI, and real-time decision engines. The platform must support over 10,000 tokens (including thousands of shitcoins and memes) with enterprise-level security and user experience.

## Core Features

### 1. Non-Custodial & Secure

AxiomX is a **fully non-custodial, AI-powered, multi-layer intelligent order-routing super aggregator** that functions as a single, unified gateway to the global crypto liquidity universe. It connects users to dozens of top-tier CEXs, DEXs, bridges, derivatives platforms, and institutional liquidity providers without ever holding or controlling user funds. Users connect via Wallet Connect 2.0, MPC wallets, or encrypted API keys.

### 2. Advanced Smart Routing Engine

The platform’s proprietary **Smart Routing Engine** (`@axiomx/routing-engine`) — built on graph theory, optimization algorithms, real-time stochastic modeling, and multi-objective decision functions — delivers mathematically optimal execution with minimal slippage, lowest effective fees, MEV protection, and maximum fill probability.

### 3. Extensive Token & Asset Coverage

Supporting **10,000+ tokens** (including thousands of shitcoins and memes) across all major chains and emerging L2/L3 solutions. Features an **Advanced Token Security Scanner** (`@axiomx/security`) with multi-layer security analysis (RugCheck, Honeypot.is, GoPlus, Token Sniffer, etc.) and a dedicated Meme Hub.

### 4. Integrated Liquidity Sources

Connects to 50+ liquidity sources, including:

*   **CEXs:** Binance, Bybit, OKX, KuCoin, Gate.io, MEXC, Bitget, Kraken, Coinbase, Bitfinex, HTX, WhiteBIT, Phemex, Crypto.com, Deribit, Hyperliquid, etc.
*   **DEX & Aggregators:** Uniswap V3/V4, Jupiter, 1inch, Odos, ParaSwap, 0x, CoW Swap, Kyber, Raydium, GMX, dYdX, etc.
*   **Institutions & Others:** Wintermute, Cumberland, Jump Trading, deBridge, Across, LI.FI, etc.

### 5. Comprehensive Order Types & Execution

Supports Market, Limit, Stop-Limit, OCO, Trailing Stop, Iceberg, TWAP, VWAP, POV, **Synthetic & Hybrid Orders**, Intent-Based & Natural Language Trading. Powered by an Advanced Smart Routing Engine (Graph-based + Monte Carlo + Stochastic Optimization).

### 6. AI & Quantitative Suite

Includes Axiom AI Copilot, Advanced Trading Bots (DCA, Grid, Arbitrage, Sniping, etc.), AI Strategy Lab, Copy Trading Pro, and Portfolio Oracle with Monte Carlo simulations.

### 7. Real-time Data & Aggregated Order Book

Features a **real-time Aggregated Multi-Venue Order Book** and price updates via WebSockets, providing a unified view of market depth and liquidity across all integrated exchanges.

### 8. Additional Features

Cross-chain Bridge Aggregator, Yield Optimizer, Advanced Analytics, TradingView + Aggregated Order Book, Mobile App, Telegram/Discord Bot, and Full Persian support.

## Technical Stack

*   **Monorepo:** Turborepo
*   **Shared Packages:** `@axiomx/shared`, `@axiomx/routing-engine`, `@axiomx/security`
*   **Frontend:** Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, TradingView, Zustand/Jotai, Wallet Connect 2.0, `socket.io-client`
*   **Backend:** NestJS (TypeScript), Drizzle ORM (planned), BullMQ + Redis, CCXT Pro, `socket.io`
*   **Real-time:** Heavy WebSocket usage
*   **Database:** PostgreSQL + Redis + TimescaleDB + ClickHouse (planned)
*   **Security:** AES-256 + Vault, Zero Custody, Bug Bounty, Enhanced API Key Management

## Development Standards

*   **Monorepo:** Managed with Turborepo
*   **Language:** Full TypeScript (strict)
*   **Containerization:** Docker + docker-compose ready
*   **Error Handling:** Comprehensive error handling and logging
*   **Documentation:** Well-documented code + OpenAPI/Swagger
*   **Security:** Security-first (never log secrets, proper encryption, rate limiting)

## Development Phases (Current Progress)

1.  **Foundation:** Monorepo setup, professional README.md, docker-compose, env config.
2.  **Core Backend:** NestJS + CCXT Pro integration + User & Key management.
3.  **Monorepo Structure & Shared Packages:** Created `@axiomx/shared`, `@axiomx/routing-engine`, `@axiomx/security` packages.
4.  **Smart Routing Engine:** Implemented core logic for multi-objective order routing.
5.  **Key Modules:** Implemented Token Security Scanner, Synthetic Limit Order Engine, and Aggregated Multi-Venue Order Book.
6.  **Backend Upgrade:** Enhanced NestJS services with Redis caching, WebSocket gateway, and improved API security.
7.  **Frontend Upgrade:** Developed an advanced Next.js Trade Terminal with real-time data integration.

## Getting Started

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/QalamHipHop/AxiomX.git
    cd AxiomX
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start Docker containers (if applicable):**
    ```bash
    docker-compose up -d
    ```
4.  **Run the development servers:**
    ```bash
    # Build shared packages
    npm run build --workspace=@axiomx/shared
    npm run build --workspace=@axiomx/routing-engine
    npm run build --workspace=@axiomx/security

    # Start backend
    npm run start --workspace=backend

    # Start frontend
    npm run dev --workspace=frontend
    ```

## Contributing

We welcome contributions! Please see our `CONTRIBUTING.md` for more details.

## License

This project is licensed under the ISC License.
