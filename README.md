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

## General Architecture & Production Readiness

To ensure AxiomX is robust, scalable, and production-ready, the following architectural and operational considerations are being implemented:

### Zero Custody Enforcement

**No private keys or user funds will ever be stored on the server.** All interactions requiring private keys will be handled client-side through secure wallet connections (e.g., WalletConnect, MPC wallets) or encrypted, ephemeral API keys provided by the user for CEX interactions. This minimizes the attack surface and adheres to the highest security standards for non-custodial operations.

### Scalability

The platform is designed for horizontal scalability to handle high throughput and increasing user demand:

*   **Redis Cluster:** For distributed caching, session management, and real-time data streams, ensuring high availability and performance.
*   **Multiple Backend Instances:** Backend services will be deployed across multiple instances, managed by Kubernetes or similar orchestration tools, with load balancing to distribute traffic efficiently.
*   **Database Sharding/Partitioning:** For PostgreSQL and other persistent data stores, data will be sharded or partitioned to improve query performance and manage large datasets.

### Monitoring & Observability

Comprehensive monitoring and observability tools will be integrated to ensure system health, performance, and rapid incident response:

*   **Prometheus:** For collecting and storing time-series metrics from all services.
*   **Grafana:** For visualizing metrics and creating dashboards to monitor key performance indicators (KPIs).
*   **Sentry:** For real-time error tracking and alerting, providing detailed context for debugging production issues.
*   **OpenTelemetry:** For distributed tracing, allowing end-to-end visibility of requests across microservices and identifying performance bottlenecks.

### CI/CD Pipeline

A robust Continuous Integration/Continuous Deployment (CI/CD) pipeline using GitHub Actions will automate the development workflow:

*   **Linting:** Automated code style and quality checks.
*   **Testing:** Unit, integration, and end-to-end tests to ensure code correctness and prevent regressions.
*   **Building:** Automated compilation and packaging of applications.
*   **Docker Push:** Building and pushing Docker images to a container registry.
*   **Security Scan:** Integrating static application security testing (SAST) and dependency scanning tools to identify vulnerabilities early in the development cycle.

### Documentation

Thorough documentation is crucial for maintainability and future development:

*   **Architecture Decision Records (ADRs):** Documenting significant architectural decisions, their context, and consequences.
*   **C4 Model Architecture Diagram:** Providing a clear, hierarchical view of the system architecture (Context, Containers, Components, Code).
*   **API Documentation:** Comprehensive OpenAPI/Swagger documentation for all backend APIs, facilitating easy integration for frontend and third-party developers.

### Persian Support (i18n)

Full internationalization (i18n) support for Persian language users:

*   **`next-intl`:** Integration for seamless internationalization in the Next.js frontend.
*   **RTL (Right-to-Left) Support:** Ensuring proper rendering and layout for Persian text.
*   **Date/Number Formatting:** Localized date and number formatting to match Persian conventions.

### Compliance

Adherence to relevant regulatory and legal frameworks:

*   **KYC Consideration for CEXs:** While AxiomX is non-custodial, integration with CEXs may require users to complete KYC processes directly with those exchanges. The platform will guide users accordingly.
*   **Terms of Service (ToS):** A comprehensive ToS outlining user responsibilities, platform usage, and disclaimers.
*   **Privacy Policy:** A clear Privacy Policy detailing data collection, usage, and protection practices.

## Development Phases (Current Progress)

1.  **Foundation:** Monorepo setup, professional README.md, docker-compose, env config.
2.  **Core Backend:** NestJS + CCXT Pro integration + User & Key management.
3.  **Monorepo Structure & Shared Packages:** Created `@axiomx/shared`, `@axiomx/routing-engine`, `@axiomx/security` packages.
4.  **Smart Routing Engine:** Implemented core logic for multi-objective order routing, graph modeling, and advanced algorithms.
5.  **Key Modules:** Implemented Token Security Scanner with external API integrations and enhanced on-chain analysis, Synthetic Limit Order Engine, and Aggregated Multi-Venue Order Book.
6.  **Backend Upgrade:** Enhanced NestJS services with Redis caching, WebSocket gateway, and improved API security.
7.  **Frontend Upgrade:** Developed an advanced Next.js Trade Terminal with real-time data integration.
8.  **General Architecture & Production Readiness:** Integrated monitoring, CI/CD, comprehensive documentation, Persian support, and compliance considerations.

## Getting Started

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/QalamHipHop/AxiomX.git
    cd AxiomX
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Start Docker containers (if applicable):**
    ```bash
    docker-compose up -d
    ```
4.  **Run the development servers:**
    ```bash
    # Build shared packages
    pnpm run build --filter=@axiomx/shared
    pnpm run build --filter=@axiomx/routing-engine
    pnpm run build --filter=@axiomx/security

    # Start backend
    pnpm run start --filter=backend

    # Start frontend
    pnpm run dev --filter=frontend
    ```

## Contributing

We welcome contributions! Please see our `CONTRIBUTING.md` for more details.

## License

This project is licensed under the ISC License.

## Author

**Qalam**
