# AxiomX: Master Product Requirements Document & System Architecture

## 1. Executive Summary
**AxiomX** is a next-generation, non-custodial "Super Aggregator" designed for the 2026 crypto landscape. It bridges the gap between Centralized Exchanges (CEXs) and Decentralized Exchanges (DEXs), providing institutional-grade execution, mathematical optimization, and AI-driven insights—all while ensuring users maintain absolute control of their assets.

**Tagline:** "Mathematical Precision in Every Trade. Infinite Liquidity. Zero Custody. Where Equations Meet Execution."

---

## 2. Core Principles (The Axioms)
1.  **Zero Custody:** AxiomX never holds user private keys. All CEX interactions use encrypted, permissioned API keys, and all DEX interactions are on-chain via user wallets.
2.  **Best Execution:** Every trade is routed through a mathematical optimization engine to minimize slippage and maximize return.
3.  **Universal Liquidity:** Access to 50+ venues including Binance, OKX, Jupiter, 1inch, and more.
4.  **Security First:** Integrated multi-layer security scanners for every token.

---

## 3. Technical Stack
-   **Monorepo Management:** Turborepo
-   **Backend:** NestJS (Node.js) + TypeScript (Strict)
-   **Frontend:** Next.js 15 (App Router) + Tailwind CSS + shadcn/ui
-   **Database:** PostgreSQL + Drizzle ORM
-   **Task Queue:** BullMQ + Redis
-   **Real-time Data:** CCXT Pro (WebSockets)
-   **Blockchain:** Wagmi/Viem + Ethers.js

---

## 4. Development Roadmap

### Phase 0: Foundation Mastery (Refactoring & Quality)
-   **Strict TypeScript:** Enforce `strict: true` across all packages.
-   **Monorepo Optimization:** Fine-tune `turbo.json` for caching and task orchestration.
-   **Dockerization:** Multi-stage Docker builds for production-ready deployment.
-   **CI/CD:** Setup GitHub Actions for linting, testing, and automated builds.

### Phase 1: Smart Routing Engine (The Heart)
-   **Graph-Based Routing:** Implement Dijkstra/Bellman-Ford variants for multi-hop pathfinding.
-   **Venue Integration:** Standardized adapters for 50+ CEXs (via CCXT) and DEXs.
-   **Optimization Engine:** Multi-objective optimization (Price vs. Speed vs. Gas/Fees).
-   **Real-time Quotes:** WebSocket-driven price discovery with <50ms latency.

### Phase 2: Advanced Trading Core
-   **Synthetic Limit Orders:** On-chain/Off-chain limit orders for tokens that don't support them natively.
-   **Security Scanner:** Automated rug-pull detection, honey-pot checks, and liquidity analysis.
-   **Aggregated Order Books:** Unified view of liquidity across all venues.

### Phase 3: Axiom AI & Automation
-   **Axiom AI Copilot:** Natural language trading ("Buy $1000 of the best performing meme coin on Solana").
-   **Automation Suite:** DCA, Grid trading, and Sniping bots.

---

## 5. Engineering Standards
-   **Clean Architecture:** Separation of concerns between domain, application, and infrastructure layers.
-   **Testing:** 80%+ coverage with unit, integration, and E2E tests.
-   **Documentation:** Comprehensive TSDoc and OpenAPI (Swagger) specs.
-   **Performance:** All critical paths optimized for sub-100ms response times.
