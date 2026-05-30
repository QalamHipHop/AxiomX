# AxiomX Backend

NestJS-based backend API for AxiomX - Non-Custodial Crypto Super Aggregator.

## Features

- **User Management:** Registration, login, and user profile management
- **API Key Management:** Secure API key generation and management with encryption
- **CCXT Integration:** Support for 50+ cryptocurrency exchanges
- **Trading Data:** Real-time market data, order books, and ticker information
- **Swagger Documentation:** Complete API documentation at `/api/docs`
- **Security:** JWT authentication, password hashing, encrypted API secrets

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory (or use the provided `.env.example`):

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=axiomx_db
JWT_SECRET=your-secret-key-change-in-production
ENCRYPTION_KEY=default-encryption-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

## Running the Application

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Trading

- `GET /trading/exchanges` - Get all available exchanges
- `GET /trading/exchanges/:exchangeName/info` - Get exchange information
- `GET /trading/exchanges/:exchangeName/markets` - Get markets for an exchange
- `GET /trading/exchanges/:exchangeName/orderbook/:symbol` - Get order book
- `GET /trading/exchanges/:exchangeName/ticker/:symbol` - Get ticker data

### Health

- `GET /health` - Health check endpoint

## Project Structure

```
src/
├── modules/
│   ├── auth/          # Authentication module
│   ├── users/         # User management module
│   ├── keys/          # API key management module
│   ├── trading/       # Trading and market data module
│   └── health/        # Health check module
├── common/            # Shared utilities and guards
├── config/            # Configuration files
├── database/          # Database entities and migrations
├── app.module.ts      # Main application module
└── main.ts            # Application entry point
```

## Documentation

Swagger documentation is available at `http://localhost:3001/api/docs` when the server is running.

## Security Considerations

- Never commit `.env` files to version control
- Always use strong JWT secrets in production
- Rotate encryption keys regularly
- Implement rate limiting for production
- Use HTTPS in production
- Validate all user inputs
