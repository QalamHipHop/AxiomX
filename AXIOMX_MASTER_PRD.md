# AXIOMX — Super Aggregator v2.0
## Master Product Requirements & Architecture Document

### 1. Vision & Overview
AxiomX is a next-generation, production-grade, non-custodial crypto super-aggregator. It acts as a proxy/tunnel to 50+ CEXs and DEXs, routing orders mathematically optimally. Users NEVER custody their funds on the platform. All CEX operations use AES-256-GCM encrypted API keys. All DEX operations are on-chain via user wallets (WalletConnect v2).

### 2. Core Features
- **Super Aggregation (Proxy/Tunnel):** Buy/sell across all major exchanges (Binance, OKX, Bybit, Uniswap, etc.) from a single interface.
- **Non-Custodial Security:** No user funds are held. API keys are encrypted. DEX trades are direct from wallets.
- **AI-Powered Trading:** Natural language trading, strategy generation, and sentiment analysis using GPT-4o.
- **Advanced Bots:** DCA, Grid, Arbitrage, and Sniper bots running on BullMQ/Redis.
- **Cross-Chain Bridge:** Aggregating bridges for optimal cross-chain swaps.
- **Security Scanning:** Real-time AI scanning of 10,000+ tokens (including meme coins) for honeypots and risks.

### 3. Tech Stack
- **Monorepo:** Turborepo (pnpm workspaces)
- **Backend:** NestJS 10, TypeScript, CCXT Pro, PostgreSQL 15, TypeORM, Redis 7, BullMQ, Socket.IO
- **Frontend:** Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand
- **Blockchain:** Wagmi v2, Viem, Ethers.js v6, Solidity, Hardhat
- **Infrastructure:** Docker, Prometheus, Grafana

### 4. Architecture Design
- **Apps:** `backend` (NestJS API), `frontend` (Next.js UI)
- **Packages:** `shared` (types/utils), `routing-engine` (graph algorithms for optimal routing), `security` (token scanning), `database` (entities/migrations), `contracts` (Solidity)

### 5. Development Plan
1. Setup Monorepo & Infrastructure (Turborepo, Docker, DB)
2. Backend Core (Auth, Users, API Keys, CCXT Integration)
3. Backend Advanced (Bots, AI, Bridge, WebSocket)
4. Frontend Core (Layout, Auth, Trading Terminal)
5. Frontend Advanced (Bots UI, AI Chat, Portfolio)
6. Smart Contracts & Shared Packages
7. Final Integration & Testing
