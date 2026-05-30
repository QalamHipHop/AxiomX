# AxiomX Frontend

Next.js-based frontend for AxiomX - Non-Custodial Crypto Super Aggregator.

## Features

- **Next.js 15:** Modern React framework with App Router
- **TailwindCSS:** Utility-first CSS framework
- **TypeScript:** Type-safe development
- **Zustand:** Lightweight state management
- **Wallet Connect:** Web3 wallet integration
- **Trading Terminal:** Real-time market data and order book visualization
- **Responsive Design:** Mobile-first approach

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Running the Application

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/               # Next.js app router pages
├── components/        # Reusable React components
├── hooks/            # Custom React hooks
├── store/            # Zustand state management
├── services/         # API and external services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Pages

- `/` - Home page with platform overview
- `/trading` - Trading terminal with market data
- `/auth/login` - User login
- `/auth/register` - User registration
- `/dashboard` - User dashboard (to be implemented)

## API Integration

The frontend communicates with the backend API at the URL specified in `NEXT_PUBLIC_BACKEND_URL`. All API calls are handled through the `services/api.ts` file with automatic token management.

## Styling

The project uses TailwindCSS with a custom color scheme:

- **Primary:** `#0066FF` (Blue)
- **Secondary:** `#1E1E2E` (Dark)
- **Accent:** `#00D4FF` (Cyan)

## Security Considerations

- API tokens are stored in localStorage and automatically included in requests
- Expired tokens trigger automatic logout and redirect to login page
- All API calls include CORS headers for security
