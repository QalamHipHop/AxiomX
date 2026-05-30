/**
 * Utility Functions for AxiomX
 * Common helpers for calculations, formatting, and data processing
 */

/**
 * Calculate slippage percentage
 */
export function calculateSlippage(
  expectedPrice: number,
  actualPrice: number,
  side: 'buy' | 'sell'
): number {
  if (side === 'buy') {
    return ((actualPrice - expectedPrice) / expectedPrice) * 100;
  } else {
    return ((expectedPrice - actualPrice) / expectedPrice) * 100;
  }
}

/**
 * Calculate weighted average price
 */
export function calculateWeightedAveragePrice(
  prices: number[],
  amounts: number[]
): number {
  if (prices.length === 0) return 0;
  if (prices.length !== amounts.length) {
    throw new Error('Prices and amounts arrays must have the same length');
  }

  const totalValue = prices.reduce((sum, price, i) => sum + price * amounts[i], 0);
  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);

  return totalAmount > 0 ? totalValue / totalAmount : 0;
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (value >= 1e9) return (value / 1e9).toFixed(decimals) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(decimals) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(decimals) + 'K';
  return value.toFixed(decimals);
}

/**
 * Convert timestamp to readable format
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        const delay = initialDelayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retry attempts reached');
}

/**
 * Validate Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate token symbol
 */
export function isValidTokenSymbol(symbol: string): boolean {
  return /^[A-Z0-9]{1,20}$/.test(symbol);
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects recursively
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(
          result[key] || {},
          source[key] as Record<string, any>
        );
      } else {
        result[key] = source[key] as any;
      }
    }
  }

  return result;
}

/**
 * Rate limiter implementation
 */
export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

/**
 * Normalize symbol format (e.g., BTC/USD)
 */
export function normalizeSymbol(symbol: string): string {
  return symbol.toUpperCase().replace(/\s+/g, '');
}

/**
 * Parse symbol into base and quote
 */
export function parseSymbol(symbol: string): { base: string; quote: string } {
  const normalized = normalizeSymbol(symbol);
  const [base, quote] = normalized.split('/');
  return { base: base || '', quote: quote || '' };
}
