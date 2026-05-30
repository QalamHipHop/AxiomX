
# AXIOMX — Super Aggregator v3.0: Next-Generation Development Prompt

## Developer-Grade Full-Stack Development Prompt

---

```
================================================================================
                        AXIOMX DEVELOPMENT PROMPT
                Non-Custodial Crypto Super Aggregator v3.0
================================================================================

PROJECT OVERVIEW:
-----------------
AxiomX is envisioned as the definitive next-generation, production-grade, non-custodial crypto super-aggregator, meticulously engineered for the evolving 2026+ decentralized finance landscape. Its core mission is to provide unparalleled execution efficiency, mathematical optimization, and AI-driven intelligence across the entire spectrum of crypto liquidity. Users maintain absolute self-custody, with all CEX operations secured via AES-256-GCM encrypted API keys and all DEX operations executed on-chain through user-controlled wallets (WalletConnect v2, with future support for Account Abstraction). The platform will support 10,000+ tokens, including emerging meme coins and complex DeFi instruments, underpinned by advanced AI-powered security scanning, real-time execution, and predictive analytics.

**Key Differentiators & Future-Proofing:**
-   **Intent-Based Trading Engine:** Moving beyond traditional order routing, AxiomX will interpret user intent (e.g., "maximize profit on this trade across all chains") and leverage a network of solvers to achieve the optimal outcome, minimizing user input and maximizing efficiency [1] [2].
-   **AI Agent Wallet Integration:** Support for autonomous AI agents to manage and execute trades on behalf of users, integrating with emerging AI agent wallet standards for secure, self-custodial operations [3] [4].
-   **Proactive MEV Protection & Zero-Knowledge Privacy:** Advanced algorithms to detect and mitigate Maximal Extractable Value (MEV) attacks, coupled with optional zero-knowledge proofs for enhanced transaction privacy without compromising transparency for regulatory compliance [5] [6].
-   **Cross-Chain Liquidity Tunneling:** Seamlessly aggregate liquidity not just across CEXs and DEXs on a single chain, but also across multiple disparate blockchain networks, creating a truly unified trading experience. This involves sophisticated bridging and atomic swap mechanisms [7].
-   **Adaptive Market Microstructure Analysis:** Real-time analysis of market depth, order book dynamics, and liquidity fragmentation across all integrated venues to dynamically adjust routing strategies.

Tech Stack (Updated for 2026+):
-   **Monorepo:** Turborepo (pnpm workspaces ONLY — strict adherence to pnpm for consistency and performance)
-   **Backend:** NestJS 10+ (TypeScript strict mode) + CCXT Pro WebSocket + gRPC for internal microservices communication
-   **Frontend:** Next.js 15 App Router (TypeScript strict) + React Server Components + Tailwind CSS + shadcn/ui + WebSockets for real-time UI updates
-   **Database:** PostgreSQL 15+ + Drizzle ORM (migrations ONLY, `synchronize:true` strictly forbidden in production)
-   **Cache:** Redis 7+ (password REQUIRED in production, clustered for high availability)
-   **Queue:** BullMQ + Redis (for robust background job processing and bot scheduling)
-   **Real-time:** Socket.IO (separate gateway per domain, optimized for low-latency data streaming) + WebSockets for direct exchange feeds
-   **AI/ML:** OpenAI GPT-4o API (for natural language trading, strategy generation) + custom ML models (TensorFlow.js/PyTorch) for predictive analytics and security scanning
-   **Blockchain:** Wagmi v2 + Viem + Ethers.js v6 (for EVM chains) + dedicated SDKs for non-EVM chains (e.g., Solana, Cosmos)
-   **Smart Contracts:** Solidity + Hardhat (for EVM-compatible smart contracts, with formal verification where critical)
-   **Monitoring:** Prometheus + Grafana + ELK Stack (Elasticsearch, Logstash, Kibana) for comprehensive logging and observability
-   **Containerization:** Docker multi-stage builds + Kubernetes (for scalable, resilient deployment)
-   **CI/CD:** GitHub Actions (linting, testing, vulnerability scanning, automated deployments to staging/production)

================================================================================
SECTION 1: MONOREPO STRUCTURE & CRITICAL REFACTORING
================================================================================

**1.1 Monorepo Directory Tree (Refined & Expanded):**

```
axiomx/
├── apps/
│   ├── backend/                      # NestJS Backend Application
│   │   ├── src/
│   │   │   ├── main.ts               # Production entry point
│   │   │   ├── app.module.ts         # Root module
│   │   │   ├── config/               # Centralized configuration management
│   │   │   │   ├── config.module.ts
│   │   │   │   ├── database.config.ts
│   │   │   │   ├── redis.config.ts
│   │   │   │   ├── jwt.config.ts
│   │   │   │   ├── storage.config.ts
│   │   │   │   └── swagger.config.ts
│   │   │   ├── common/               # Shared utilities (filters, guards, interceptors, decorators, pipes)
│   │   │   │   ├── filters/
│   │   │   │   │   ├── http-exception.filter.ts
│   │   │   │   │   ├── websocket-exception.filter.ts
│   │   │   │   │   └── all-exceptions.filter.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   ├── jwt-refresh.guard.ts
│   │   │   │   │   ├── api-key.guard.ts
│   │   │   │   │   ├── roles.guard.ts
│   │   │   │   │   └── rate-limit.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── logging.interceptor.ts
│   │   │   │   │   ├── transform.interceptor.ts
│   │   │   │   │   ├── cache.interceptor.ts
│   │   │   │   │   ├── retry.interceptor.ts
│   │   │   │   │   └── performance.interceptor.ts
│   │   │   │   ├── decorators/
│   │   │   │   │   ├── @Public().ts
│   │   │   │   │   ├── @CurrentUser().ts
│   │   │   │   │   ├── @Roles(...roles).ts
│   │   │   │   │   ├── @RateLimit().ts
│   │   │   │   │   ├── @CacheTTL().ts
│   │   │   │   │   └── @Version().ts
│   │   │   │   ├── middlewares/
│   │   │   │   │   ├── request-id.middleware.ts
│   │   │   │   │   ├── compression.middleware.ts
│   │   │   │   │   └── correlation-id.middleware.ts
│   │   │   │   ├── pipes/
│   │   │   │   │   ├── validation.pipe.ts
│   │   │   │   │   └── parse-int.pipe.ts
│   │   │   │   └── interceptors/ (for shared interceptors)
│   │   │   │       └── http-logger.interceptor.ts
│   │   │   ├── modules/              # Feature-specific modules
│   │   │   │   ├── auth/             # User authentication and authorization
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── strategies/
│   │   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   │   └── local.strategy.ts
│   │   │   │   │   ├── guards/
│   │   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   │   └── jwt-refresh.guard.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── login.dto.ts
│   │   │   │   │       ├── register.dto.ts
│   │   │   │   │       ├── refresh-token.dto.ts
│   │   │   │   │       ├── forgot-password.dto.ts
│   │   │   │   │       └── reset-password.dto.ts
│   │   │   │   ├── users/            # User management
│   │   │   │   │   ├── users.module.ts
│   │   │   │   │   ├── users.controller.ts
│   │   │   │   │   ├── users.service.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── user.entity.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── update-profile.dto.ts
│   │   │   │   │       └── change-password.dto.ts
│   │   │   │   ├── api-keys/         # Encrypted API key management for CEXs
│   │   │   │   │   ├── api-keys.module.ts
│   │   │   │   │   ├── api-keys.controller.ts
│   │   │   │   │   ├── api-keys.service.ts
│   │   │   │   │   ├── encryption.service.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── api-key.entity.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── create-api-key.dto.ts
│   │   │   │   │       ├── update-api-key.dto.ts
│   │   │   │   │       └── test-connection.dto.ts
│   │   │   │   ├── trading/          # Core trading logic, order execution, market data
│   │   │   │   │   ├── trading.module.ts
│   │   │   │   │   ├── trading.controller.ts
│   │   │   │   │   ├── trading.service.ts
│   │   │   │   │   ├── ccxt-pro.service.ts     # CCXT PRO WebSocket integration
│   │   │   │   │   ├── order-book-aggregator.service.ts # Aggregates order books from multiple sources
│   │   │   │   │   ├── synthetic-limit-order.service.ts # Manages synthetic limit orders
│   │   │   │   │   ├── trading.gateway.ts      # Socket.IO gateway for real-time trading updates
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── trade.entity.ts
│   │   │   │   │   │   ├── order.entity.ts
│   │   │   │   │   │   └── synthetic-order.entity.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── execute-order.dto.ts
│   │   │   │   │       ├── cancel-order.dto.ts
│   │   │   │   │       ├── routing-query.dto.ts
│   │   │   │   │       ├── order-book-query.dto.ts
│   │   │   │   │       └── ticker-query.dto.ts
│   │   │   │   ├── routing/          # Smart Order Routing (SOR) engine
│   │   │   │   │   ├── routing.module.ts
│   │   │   │   │   ├── routing.controller.ts
│   │   │   │   │   ├── routing.service.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── find-route.dto.ts
│   │   │   │   │       └── route-result.dto.ts
│   │   │   │   ├── security/         # Token security scanning and risk assessment
│   │   │   │   │   ├── security.module.ts
│   │   │   │   │   ├── security.controller.ts
│   │   │   │   │   ├── security.service.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── security-report.entity.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── scan-token.dto.ts
│   │   │   │   │       └── batch-scan.dto.ts
│   │   │   │   ├── portfolio/        # User portfolio management and analytics
│   │   │   │   │   ├── portfolio.module.ts
│   │   │   │   │   ├── portfolio.controller.ts
│   │   │   │   │   ├── portfolio.service.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── portfolio.entity.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── get-portfolio.dto.ts
│   │   │   │   │       └── rebalance.dto.ts
│   │   │   │   ├── bots/             # Automated trading bots (DCA, Grid, Arbitrage, Sniper)
│   │   │   │   │   ├── bots.module.ts
│   │   │   │   │   ├── bots.controller.ts
│   │   │   │   │   ├── bots.service.ts
│   │   │   │   │   ├── dca-bot.service.ts
│   │   │   │   │   ├── grid-bot.service.ts
│   │   │   │   │   ├── arbitrage-bot.service.ts
│   │   │   │   │   ├── sniper-bot.service.ts
│   │   │   │   │   ├── bot-scheduler.service.ts    # BullMQ scheduler integration
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── bot.entity.ts
│   │   │   │   │   │   ├── bot-trade.entity.ts
│   │   │   │   │   │   └── bot-performance.entity.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── create-bot.dto.ts
│   │   │   │   │       ├── update-bot.dto.ts
│   │   │   │   │       ├── bot-stats.dto.ts
│   │   │   │   │       └── dca-config.dto.ts
│   │   │   │   ├── bridge/           # Cross-chain bridging and atomic swaps
│   │   │   │   │   ├── bridge.module.ts
│   │   │   │   │   ├── bridge.controller.ts
│   │   │   │   │   ├── bridge.service.ts
│   │   │   │   │   ├── bridge-aggregator.service.ts # Aggregates bridge liquidity
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── bridge-transaction.entity.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── bridge-quote.dto.ts
│   │   │   │   │       └── bridge-execute.dto.ts
│   │   │   │   ├── notifications/    # Multi-channel notification system
│   │   │   │   │   ├── notifications.module.ts
│   │   │   │   │   ├── notifications.service.ts
│   │   │   │   │   ├── email.service.ts
│   │   │   │   │   ├── telegram.service.ts
│   │   │   │   │   ├── push.service.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── notification.entity.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── send-notification.dto.ts
│   │   │   │   │       └── notification-preferences.dto.ts
│   │   │   │   ├── analytics/        # Data analytics and reporting
│   │   │   │   │   ├── analytics.module.ts
│   │   │   │   │   ├── analytics.controller.ts
│   │   │   │   │   ├── analytics.service.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── performance-report.dto.ts
│   │   │   │   │       └── tax-report.dto.ts
│   │   │   │   ├── ai/               # AI/ML services for trading and security
│   │   │   │   │   ├── ai.module.ts
│   │   │   │   │   ├── ai.controller.ts
│   │   │   │   │   ├── ai.service.ts
│   │   │   │   │   ├── strategy-generator.service.ts # Generates trading strategies based on NL
│   │   │   │   │   ├── sentiment-analyzer.service.ts # Market sentiment analysis
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── nl-trading.dto.ts
│   │   │   │   │       └── generate-strategy.dto.ts
│   │   │   │   ├── health/           # Health checks and monitoring endpoints
│   │   │   │   │   ├── health.module.ts
│   │   │   │   │   ├── health.controller.ts
│   │   │   │   │   └── health.service.ts
│   │   │   │   └── websocket/        # General WebSocket infrastructure
│   │   │   │       ├── websocket.module.ts
│   │   │   │       ├── websocket.gateway.ts
│   │   │   │       ├── adapters/
│   │   │   │       │   ├── orderbook.adapter.ts
│   │   │   │       │   ├── price.adapter.ts
│   │   │   │       │   └── auth.adapter.ts
│   │   │   │       └── guards/
│   │   │   │           └── ws-jwt.guard.ts
│   │   │   └── migrations/           # Database migrations (TypeORM/Drizzle)
│   │   │       ├── 001-initial-schema.ts
│   │   │       ├── 002-add-portfolio.ts
│   │   │       ├── 003-add-bots.ts
│   │   │       └── 004-add-notifications.ts
│   │   ├── test/                     # Backend tests (unit, integration, e2e)
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── e2e/
│   │   ├── Dockerfile                # Dockerfile for backend service
│   │   ├── docker-entrypoint.sh      # Entrypoint script for Docker
│   │   ├── nest-cli.json
│   │   └── package.json
│   │
│   └── frontend/                   # Next.js Frontend Application
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx                # Landing page
│   │   │   │   ├── globals.css
│   │   │   │   ├── not-found.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── (auth)/             # Authentication routes
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   ├── register/page.tsx
│   │   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   │   └── reset-password/[token]/page.tsx
│   │   │   │   ├── (dashboard)/        # Authenticated user dashboard
│   │   │   │   │   ├── layout.tsx          # Sidebar + header layout
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   ├── page.tsx            # Dashboard home
│   │   │   │   │   ├── trading/            # Trading interface
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [symbol]/page.tsx
│   │   │   │   │   │   └── components/
│   │   │   │   │   │       ├── OrderBook.tsx
│   │   │   │   │   │       ├── TradingChart.tsx
│   │   │   │   │   │       ├── OrderForm.tsx
│   │   │   │   │   │       ├── OpenOrders.tsx
│   │   │   │   │   │       ├── TradeHistory.tsx
│   │   │   │   │   │       ├── PositionPanel.tsx
│   │   │   │   │   │       ├── RoutingResult.tsx
│   │   │   │   │   │       ├── TickerBar.tsx
│   │   │   │   │   │       ├── MarketSelector.tsx
│   │   │   │   │   │       └── SwapPanel.tsx
│   │   │   │   │   ├── portfolio/          # Portfolio management
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── components/
│   │   │   │   │   │       ├── HoldingsTable.tsx
│   │   │   │   │   │       ├── PerformanceChart.tsx
│   │   │   │   │   │       └── RebalanceWidget.tsx
│   │   │   │   │   ├── bots/               # Bot management interface
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── components/
│   │   │   │   │   │       ├── BotList.tsx
│   │   │   │   │   │       ├── CreateBotForm.tsx
│   │   │   │   │   │       └── BotPerformanceChart.tsx
│   │   │   │   │   ├── settings/           # User settings
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── components/
│   │   │   │   │   │       ├── ProfileSettings.tsx
│   │   │   │   │   │       ├── ApiKeySettings.tsx
│   │   │   │   │   │       └── NotificationSettings.tsx
│   │   │   │   │   └── ai-copilot/         # AI Copilot interface
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── components/
│   │   │   │   │           ├── NlInput.tsx
│   │   │   │   │           └── StrategySuggestion.tsx
│   │   │   │   └── api/                  # Frontend API client
│   │   │   │       └── client.ts
│   │   │   ├── components/           # Reusable UI components
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   ├── lib/                  # Utility functions
│   │   │   └── styles/               # Global styles
│   │   ├── public/                   # Static assets
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│
├── packages/                     # Shared packages/libraries
│   ├── shared/                   # Common types, utilities, constants
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── types.ts            # Core interfaces (ExchangeConfig, OrderBook, RoutingResult, etc.)
│   │   │   ├── utils.ts            # General utility functions
│   │   │   └── constants.ts        # Global constants
│   │   └── package.json
│   │
│   ├── routing-engine/           # Core Smart Order Routing logic
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routing-engine.ts   # Main routing algorithm (Dijkstra/Bellman-Ford variants)
│   │   │   ├── exchange-adapter.ts # Interface for exchange-specific routing logic
│   │   │   └── path-optimizer.ts   # Multi-objective optimization for paths
│   │   └── package.json
│   │
│   ├── security/                 # Token security scanning and risk assessment library
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── token-scanner.ts    # Main token scanning logic
│   │   │   ├── honeypot-detector.ts
│   │   │   ├── rugpull-detector.ts
│   │   │   └── contract-analyzer.ts
│   │   └── package.json
│   │
│   ├── blockchain-sdk/           # Abstraction layer for blockchain interactions
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── evm-provider.ts     # EVM chain interactions (Wagmi, Viem, Ethers.js)
│   │   │   ├── solana-provider.ts  # Solana chain interactions
│   │   │   └── cosmos-provider.ts  # Cosmos chain interactions
│   │   └── package.json
│   │
│   ├── database/                 # Database schema, entities, and migration tools
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── entities/           # TypeORM/Drizzle entities
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── api-key.entity.ts
│   │   │   │   ├── portfolio.entity.ts
│   │   │   │   ├── trade.entity.ts
│   │   │   │   ├── order.entity.ts
│   │   │   │   ├── bot.entity.ts
│   │   │   │   ├── bot-trade.entity.ts
│   │   │   │   ├── notification.entity.ts
│   │   │   │   └── session.entity.ts
│   │   │   └── migrations/         # Drizzle migration scripts
│   │   └── package.json
│   │
│   └── contracts/                # Smart contracts (Solidity)
│       ├── src/
│       │   ├── AxiomRouter.sol       # Main routing contract
│       │   ├── AxiomSecurity.sol     # Security-related contracts
│       │   ├── interfaces/
│       │   │   ├── IAxiomRouter.sol
│       │   │   └── IAxiomSecurity.sol
│       │   └── libraries/
│       │       ├── MathLib.sol
│       │       └── SecurityLib.sol
│       ├── test/                   # Smart contract tests
│       ├── scripts/                # Deployment and interaction scripts
│       ├── hardhat.config.ts
│       └── package.json
│
├── .github/                      # GitHub Actions CI/CD workflows
│   └── workflows/
│       ├── ci.yml                  # Continuous Integration (lint, test, build)
│       ├── cd-staging.yml          # Continuous Deployment to staging
│       └── cd-prod.yml             # Continuous Deployment to production
│
├── .env.example                  # Example environment variables
├── .env.test                     # Test environment variables
├── docker-compose.yml            # Local development Docker Compose
├── docker-compose.prod.yml       # Production Docker Compose
├── turbo.json                    # Turborepo configuration
├── tsconfig.base.json            # Base TypeScript configuration
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── jest.config.js                # Jest configuration
├── package.json                  # Root package.json
└── AXIOMX_MASTER_PRD.md          # Original Master Product Requirements Document

```

**1.2 Critical Fixes & Initial Setup (Mandatory First Steps):**

To ensure a stable and consistent development environment, the following critical fixes and setup steps **MUST** be performed immediately:

1.  **Delete Redundant/Conflicting Files:**
    -   `apps/backend/package.json.upgraded`
    -   `apps/backend/src/main.upgraded.ts`
    -   `apps/frontend/package.json.upgraded`
    -   `apps/frontend/src/services/api.upgraded.ts`
    -   `apps/frontend/src/store/authStore.ts` (Replace with Axios-based version)
    -   `apps/frontend/src/components/TradeTerminal.upgraded.tsx`
    -   `packages/routing-engine/src/routing-engine.ts` (Will be refactored; current version has TypeScript errors)

2.  **Unify Package Manager:**
    All `package.json` files across the monorepo **MUST** specify `"packageManager": "pnpm@9.0.0"`. After updating, run `corepack enable` followed by `pnpm install` at the monorepo root to ensure consistent dependency management.

3.  **Strict TypeScript Enforcement:**
    Ensure `"strict": true` is enabled in all `tsconfig.json` files. Resolve any resulting TypeScript errors across the codebase, prioritizing type safety and code quality.

4.  **Redis Password in Docker Compose:**
    Update `docker-compose.yml` and `docker-compose.prod.yml` to enforce a password for Redis, utilizing environment variables for security. Example snippet:
    ```yaml
    redis:
      image: redis:7-alpine
      command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
      environment:
        REDIS_PASSWORD: ${REDIS_PASSWORD}
      healthcheck:
        test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
        interval: 10s
        timeout: 5s
        retries: 5
    ```

5.  **CCXT Upgrade to CCXT Pro:**
    Migrate all `ccxt` dependencies to `ccxt.pro` for WebSocket support and enhanced real-time capabilities. This involves:
    -   Running `pnpm remove ccxt` and `pnpm add ccxt-pro` in relevant packages.
    -   Updating import statements from `import { Exchange as IExchange } from 'ccxt';` to `import { Exchange as IExchange } from 'ccxt.pro';`.

6.  **Database Synchronization (Production Safety):**
    Ensure `synchronize: false` and `migrationsRun: true` are set for TypeORM/Drizzle configurations in production environments to prevent accidental schema changes. Example:
    ```typescript
    TypeOrmModule.forRoot({
      synchronize: false,  // NEVER true in production
      migrationsRun: true,
      logging: process.env.NODE_ENV === 'development',
    })
    ```

================================================================================
SECTION 2: CORE ARCHITECTURE & FEATURE ENHANCEMENTS
================================================================================

**2.1 Smart Order Routing (SOR) Engine (packages/routing-engine):**

This is the brain of AxiomX. The existing `routing-engine.ts` needs significant enhancement to support future-proof features.

**Current State Analysis:**
-   Basic path calculation and multi-objective optimization (price, speed, safety).
-   Mock `fetchOrderBook` and simplified `calculatePaths`.
-   Limited `ExchangeMetrics` and `RoutingPath` parameters.

**Enhancements Required:**
-   **Intent-Based Optimization:** The `findOptimalRoute` function must be refactored to accept a broader `RoutingIntent` object, allowing users to specify high-level goals (e.g., "minimize gas fees," "avoid front-running," "execute within 5 seconds") rather than just `optimizationTarget`. The engine should then dynamically adjust weights and strategies [1] [2].
-   **Advanced Graph Algorithms:** Implement sophisticated graph algorithms (e.g., A*, Yen's algorithm for K-shortest paths) to find truly optimal and alternative routes across multiple exchanges and chains, considering complex factors like gas costs, MEV risk, and liquidity depth [8].
-   **Real-time Liquidity & Slippage Prediction:** Integrate real-time order book data from `ccxt-pro.service` and `order-book-aggregator.service` to accurately predict slippage and fill probability. This requires a more granular `calculatePaths` that performs VWAP (Volume Weighted Average Price) calculations across multiple order book levels.
-   **MEV Protection Integration:** The `RoutingPath` and `RoutingContext` must be extended to include detailed MEV (Maximal Extractable Value) parameters. The `path-optimizer.ts` should incorporate strategies like private transaction relays, batching, and threshold-based execution to minimize MEV exposure [5].
-   **Cross-Chain Routing:** The engine must be capable of routing orders that involve multiple blockchain networks. This implies integration with the `bridge-aggregator.service` to find optimal cross-chain paths, considering bridge fees, latency, and security [7].
-   **Dynamic Exchange Metrics:** The `exchangeMetrics` should be dynamically updated based on real-time performance data (latency, reliability, liquidity, fee rates) from `ccxt-pro.service` and internal monitoring. Implement a mechanism to penalize or de-prioritize underperforming exchanges.
-   **Simulated Execution & Pre-flight Checks:** Before executing a trade, the routing engine should perform a simulated execution to provide users with a highly accurate estimate of the final price, fees, and potential slippage.

**Updated `packages/shared/src/types.ts` (Additions/Modifications):**

```typescript
// Routing
export interface RoutingIntent {
  userId: string;
  symbol: string;
  amount: number;
  side: 'buy' | 'sell';
  orderType: TradeOrder['type'];
  maxSlippagePercent: number; // Renamed for clarity
  preferredExchanges?: string[];
  avoidExchanges?: string[];
  mevProtectionLevel: 'none' | 'low' | 'medium' | 'high' | 'max'; // Granular MEV control
  privacyLevel: 'none' | 'zk_proof' | 'private_relay'; // Zero-knowledge or private transaction options
  optimizationGoals: {
    minimizeSlippage?: number; // Weight 0-1
    minimizeFees?: number;
    maximizeSpeed?: number;
    maximizeFillProbability?: number;
    avoidFrontRunning?: number;
  }; // Multi-objective optimization goals
  gasPriceGwei?: number; // For on-chain transactions
  targetChain?: string; // For cross-chain routing
  timeoutMs: number; // Timeout for route finding
  clientOrderId?: string;
}

export interface RoutingPath {
  exchange: string;
  symbol: string;
  price: number;
  amount: number;
  liquidity: number;
  slippage: number;
  gasCost: number;
  mevRiskScore: number; // 0-1, higher = more risky
  fillProbability: number;
  estimatedTimeMs: number; // Renamed for clarity
  fee: number;
  score: number;
  chain?: string; // For cross-chain paths
  bridgeFees?: number; // If cross-chain
  bridgeLatencyMs?: number; // If cross-chain
  pathDetails: Array<{ exchange: string; symbol: string; amount: number; type: 'cex' | 'dex' | 'bridge' }>; // Detailed steps
}

export interface RoutingResult {
  bestPath: RoutingPath;
  alternativePaths: RoutingPath[];
  totalPrice: number;
  effectivePrice: number;
  totalSlippage: number;
  totalFee: number;
  estimatedTimeMs: number;
  confidenceScore: number; // 0-1, how confident the engine is in the route
  recommendation: string;
  timestamp: number;
  warnings?: string[]; // E.g., 

'High MEV risk detected'
}

// AI Agent Integration
export interface AIAgentConfig {
  agentId: string;
  userId: string;
  name: string;
  status: 'active' | 'paused' | 'stopped';
  strategy: 'arbitrage' | 'dca' | 'grid' | 'sentiment' | 'nl_intent';
  permissions: string[]; // e.g., ['trade:spot', 'view:portfolio']
  walletAddress: string; // Associated AI agent wallet
  lastExecutedAt: number;
  performanceMetrics: {
    totalProfitUSD: number;
    winRate: number;
    roi: number;
  };
}

// Account Abstraction (Future)
export interface AccountAbstractionWallet {
  address: string;
  ownerAddress: string; // EOA or another smart contract
  modules: string[]; // e.g., ['social_recovery', 'multi_sig', 'session_keys']
  entryPoint: string;
  factory: string;
}
```

**2.2 Trading Module (apps/backend/src/modules/trading):**

This module handles all interactions with exchanges and manages order execution.

**Current State Analysis:**
-   Basic `TradingService` using `ccxt` (needs upgrade to `ccxt.pro`).
-   `CcxtProService` for WebSocket order book subscriptions.
-   `OrderBookAggregatorService` and `SyntheticLimitOrderService` are present but likely need full implementation.

**Enhancements Required:**
-   **Full CCXT Pro Integration:** Ensure `CcxtProService` fully leverages `ccxt.pro` for all market data (tickers, trades, order books) and order management (placing, canceling, fetching orders) across all supported exchanges. This includes robust error handling and reconnection logic.
-   **Unified Order Management:** Implement a unified interface for placing and managing orders across CEXs and DEXs. For DEXs, this will involve interacting with the `blockchain-sdk` to construct and sign transactions.
-   **Advanced Order Types:** Expand support for advanced order types beyond basic market/limit, including stop-limit, OCO (One Cancels the Other), trailing stops, TWAP (Time-Weighted Average Price), and VWAP (Volume-Weighted Average Price) orders. Some of these might be synthetic, managed by the `SyntheticLimitOrderService`.
-   **Real-time Position & PnL Tracking:** Integrate with `portfolio.service` to provide real-time updates on user positions, unrealized PnL, and margin levels (for CEXs).
-   **Execution Monitoring & Retries:** Implement intelligent retry mechanisms with exponential backoff for failed order placements or cancellations, especially for transient network issues.
-   **WebSockets for User Updates:** The `TradingGateway` (Socket.IO) should broadcast real-time updates to users regarding their orders, trades, and routing results.

**2.3 Security Module (packages/security & apps/backend/src/modules/security):**

Crucial for protecting users from scams and risky assets.

**Current State Analysis:**
-   `TokenScanner` is present.
-   `TokenSecurityReport` interface defined.

**Enhancements Required:**
-   **Comprehensive Risk Scoring:** Develop a sophisticated risk scoring model that combines multiple factors: honeypot probability, rugpull indicators, contract vulnerabilities (mintable, pausable, blacklistable, transfer tax), liquidity analysis (locked liquidity, pool health), and social sentiment [9].
-   **AI-Powered Anomaly Detection:** Integrate ML models (via `ai.service`) to detect unusual trading patterns, sudden liquidity withdrawals, or suspicious contract interactions that might indicate a scam or exploit.
-   **Real-time Vulnerability Scanning:** Implement continuous scanning of smart contracts for known vulnerabilities and deviations from standard token implementations.
-   **External Data Integration:** Pull data from reputable blockchain security firms (e.g., CertiK, PeckShield APIs) to augment internal analysis.
-   **User Alerts:** Trigger real-time notifications (via `notifications.service`) to users if they attempt to interact with a high-risk token or if a token in their portfolio is flagged.

**2.4 AI Module (apps/backend/src/modules/ai):**

Leveraging AI for intelligent trading and user experience.

**Current State Analysis:**
-   `AiService`, `StrategyGeneratorService`, `SentimentAnalyzerService` are defined.
-   `nl-trading.dto.ts` and `generate-strategy.dto.ts` exist.

**Enhancements Required:**
-   **Natural Language Trading (Enhanced):** Expand the `nl-trading` capabilities to handle complex, multi-step instructions and follow-up questions. Integrate with the `routing.service` to execute trades based on natural language intent [1] [2].
-   **Personalized Strategy Generation:** The `StrategyGeneratorService` should leverage user's historical trading data, risk tolerance, and market sentiment to suggest and generate custom trading strategies (e.g., 
DCA, grid, arbitrage) that can be deployed as bots [10].
-   **Predictive Analytics:** Implement ML models to predict price movements, liquidity shifts, and potential market anomalies. These predictions can feed into the routing engine and bot strategies.
-   **Sentiment Analysis Expansion:** Broaden `SentimentAnalyzerService` to cover more data sources (news, social media, on-chain data) and provide more nuanced sentiment scores for tokens and markets.
-   **AI Agent Wallet Orchestration:** Develop APIs for AI agents to securely interact with AxiomX, enabling them to query market data, execute trades, and manage their portfolios autonomously within defined parameters [3] [4].

**2.5 Bridge Module (apps/backend/src/modules/bridge):**

Facilitating seamless cross-chain asset transfers.

**Current State Analysis:**
-   `BridgeService` and `BridgeAggregatorService` are defined.

**Enhancements Required:**
-   **Multi-Protocol Bridge Aggregation:** The `BridgeAggregatorService` must integrate with multiple leading cross-chain bridging protocols (e.g., LayerZero, Wormhole, Connext) to find the most efficient and secure routes for asset transfers [7].
-   **Atomic Swaps & Liquidity Networks:** Explore and implement atomic swap mechanisms for direct peer-to-peer cross-chain exchanges without relying on centralized bridges. Integrate with decentralized liquidity networks for enhanced capital efficiency.
-   **Security & Trustless Verification:** Prioritize bridges with strong security audits and trustless verification mechanisms. Implement monitoring for bridge vulnerabilities and potential exploits.
-   **Fee & Latency Optimization:** The `BridgeAggregatorService` should optimize for minimal fees and latency, providing users with clear estimates before execution.

**2.6 Bots Module (apps/backend/src/modules/bots):**

Empowering users with automated trading strategies.

**Current State Analysis:**
-   DCA, Grid, Arbitrage, and Sniper bot services are defined.
-   `BotSchedulerService` uses BullMQ.

**Enhancements Required:**
-   **Advanced Bot Strategies:** Expand the range of automated strategies to include more sophisticated options like market making, trend following, and mean reversion bots.
-   **Backtesting & Simulation:** Provide users with tools to backtest their bot strategies against historical data and simulate performance before deploying real capital.
-   **No-Code Strategy Builder:** Integrate a user-friendly interface (via frontend) for users to design and customize their own bot strategies without writing code, potentially leveraging the `ai.service` for suggestions.
-   **Performance Analytics & Reporting:** Enhance `bot-performance.entity.ts` and related services to provide detailed analytics on bot performance, including PnL, drawdowns, and risk metrics.
-   **Event-Driven Automation:** Allow bots to react to specific market events (e.g., sudden price changes, new token listings) or external signals.

**2.7 Frontend (apps/frontend):**

User interface for AxiomX.

**Current State Analysis:**
-   Next.js App Router, Tailwind CSS, shadcn/ui.
-   Basic trading, portfolio, and bot interfaces.

**Enhancements Required:**
-   **Intuitive & Responsive UI/UX:** Design a highly intuitive and responsive user interface that provides a seamless experience across desktop and mobile devices. Focus on clear data visualization, easy navigation, and accessible trading controls.
-   **Real-time Data Dashboards:** Leverage WebSockets to provide real-time updates for order books, tickers, user portfolios, and bot performance. Implement customizable dashboards.
-   **Interactive TradingView Integration:** Integrate advanced charting capabilities (e.g., TradingView library) with custom indicators and drawing tools.
-   **Intent-Based Trading Interface:** A conversational interface for natural language trading, allowing users to express their trading goals in plain English.
-   **AI Copilot Integration:** A dedicated section for the Axiom AI Copilot, where users can generate strategies, get market insights, and receive personalized recommendations.
-   **Security Alerts & Notifications:** Prominent display of security alerts for high-risk tokens and real-time notifications for order fills, bot actions, and portfolio changes.
-   **Account Abstraction & AI Agent Wallet Management:** Future-proof the frontend to support user interfaces for managing smart contract wallets and delegating permissions to AI agents.

**2.8 Blockchain SDK (packages/blockchain-sdk):**

Abstracting blockchain interactions.

**Current State Analysis:**
-   EVM provider (Wagmi, Viem, Ethers.js) is planned.

**Enhancements Required:**
-   **Multi-Chain Support:** Implement dedicated providers for major non-EVM chains (Solana, Cosmos, Polkadot, etc.) to ensure broad liquidity access.
-   **Account Abstraction Integration:** Develop modules within the SDK to interact with Account Abstraction (ERC-4337) compatible smart contract wallets, enabling features like gas sponsorship, batch transactions, and social recovery [11].
-   **Transaction Simulation:** Integrate tools for simulating on-chain transactions before execution to predict outcomes, gas costs, and potential failures.
-   **Gas Optimization:** Implement strategies for optimizing gas usage for on-chain transactions, including gas price prediction and transaction bundling.
-   **WalletConnect v2 Integration (Enhanced):** Ensure robust and secure integration with WalletConnect v2 for connecting various user wallets, including hardware wallets and mobile wallets.

**2.9 Smart Contracts (packages/contracts):**

On-chain logic for AxiomX.

**Current State Analysis:**
-   `AxiomRouter.sol` and `AxiomSecurity.sol` are defined.

**Enhancements Required:**
-   **Intent-Based Resolver Contracts:** Develop smart contracts that can receive user intents and coordinate with off-chain solvers to execute complex multi-step, multi-chain trades. These contracts would act as a trust-minimized intermediary [1] [2].
-   **MEV-Resistant Order Execution:** Implement smart contract logic that can submit orders to decentralized exchanges in a way that minimizes MEV exploitation, potentially using commit-reveal schemes or private transaction pools.
-   **Account Abstraction Entry Point:** Deploy an ERC-4337 compatible Entry Point contract to enable Account Abstraction features for users, allowing for more flexible and secure wallet management [11].
-   **Formal Verification:** Critical smart contracts (e.g., `AxiomRouter.sol`, `AxiomSecurity.sol`) should undergo formal verification to ensure their correctness and security against known vulnerabilities.
-   **Upgradeability:** Implement upgradeable proxy patterns (e.g., UUPS, Transparent Proxies) for smart contracts to allow for future enhancements and bug fixes without requiring a full redeployment and migration of user funds.

================================================================================
SECTION 3: ENGINEERING STANDARDS & BEST PRACTICES
================================================================================

-   **Clean Architecture & Domain-Driven Design:** Strict adherence to separation of concerns, ensuring modularity, testability, and maintainability across the monorepo.
-   **Comprehensive Testing:** Maintain 90%+ code coverage with a robust suite of unit, integration, and end-to-end tests. Implement property-based testing for critical logic.
-   **Performance Optimization:** All critical paths (especially routing and trading) must be optimized for sub-50ms response times. This includes efficient data structures, caching strategies, and asynchronous processing.
-   **Security Audits & Penetration Testing:** Regular third-party security audits and penetration testing for both smart contracts and off-chain infrastructure.
-   **Observability:** Implement advanced logging, tracing, and metrics collection using Prometheus, Grafana, and ELK Stack to ensure full visibility into system health and performance.
-   **Documentation:** Comprehensive TSDoc for all TypeScript code, OpenAPI (Swagger) specs for all API endpoints, and detailed architectural documentation.
-   **Scalability & Resilience:** Design for horizontal scalability across all services. Implement fault tolerance, circuit breakers, and graceful degradation strategies.
-   **Developer Experience (DX):** Ensure a smooth developer experience with clear documentation, consistent coding standards, and efficient CI/CD pipelines.

================================================================================
REFERENCES
================================================================================

[1] Eco. (2026, April 24). *Intent-Based DEX Guide 2026*. Retrieved from https://eco.com/support/en/articles/11852634-intent-based-dex-guide-2026
[2] Osiz Technologies. (2026, April 22). *Ultimate Guide to Intent-Based Swaps & DEX Development*. Retrieved from https://www.osiztechnologies.com/blog/how-to-launch-intent-based-swaps-complete-dex-development-guide-2026
[3] Dcent Wallet. (2026, April 7). *AI Agents Are Getting Crypto Wallets — What It Means for You*. Retrieved from https://store.dcentwallet.com/blogs/post/ai-agents-crypto-wallets-autonomous-future
[4] Cobo. (2026, May 7). *AI Agent Wallet: Complete Guide to Autonomous Crypto*. Retrieved from https://www.cobo.com/post/ai-agent-wallet-complete-guide
[5] DLAPiper. (2026, May 15). *Blockchain and Digital Assets News and Trends – Q1 2026*. Retrieved from https://www.dlapiper.com/en-hk/insights/publications/blockchain-and-digital-assets-news-and-trends/2026/blockchain-and-digital-assets-news-and-trends-q1-2026
[6] Substack. (2026). *Privacy Trends for 2026*. Retrieved from https://insights4vc.substack.com/p/privacy-trends-for-2026
[7] Eco. (2026, April 29). *Top Cross-Chain Liquidity Protocols for 2026*. Retrieved from https://eco.com/support/en/articles/11776421-top-cross-chain-liquidity-protocols-for-2026
[8] IEEE Xplore. (2026). *6G AI Security: From Fundamentals to Offensive and Defensive Landscape in 6G*. Retrieved from https://ieeexplore.ieee.org/abstract/document/11368903/
[9] Finextra. (2026, May 28). *Top Crypto Trading Bot Development Approaches to Watch in 2026*. Retrieved from https://www.finextra.com/blogposting/31837/top-crypto-trading-bot-development-approaches-to-watch-in-2026
[10] DeFi Planet. (2026, January 23). *DeFi Aggregators in 2026: How They Work, the Risks, and the Best Platforms*. Retrieved from https://defi-planet.com/2026/01/defi-aggregators-2026-how-they-work-risks-best-platforms/
[11] HeinOnline. (2023). *Bridging the divide between DeFi and regulators: Showcasing decentralized autonomous governance as the future for self-custody wallet regulation*. Retrieved from https://heinonline.org/hol-cgi-bin/get_pdf.cgi?handle=hein.journals/jltp2023&section=14
```
