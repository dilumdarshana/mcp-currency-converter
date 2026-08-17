import { CURRENCY_ENDPOINT_BASE } from './constants.js';
import { CurrencyApiResponse } from '../types.js';

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  rates: Record<string, number>;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Returns the Free Currency API key from the environment.
 * @throws When the key is missing
 */
export function getApiKey(): string {
  const key = process.env.FREE_CURRENCY_API_KEY;
  if (!key) throw new Error('Missing FREE_CURRENCY_KEY');
  return key;
}

/**
 * Fetches exchange rates for a base currency against one or more quote
 * currencies, for the latest date or a specific historical date. Results are
 * cached in-memory for CACHE_TTL_MS to avoid redundant API calls.
 *
 * @param baseCurrency The base currency code (e.g. USD)
 * @param currencies The quote currency codes (e.g. ['EUR', 'GBP'])
 * @param date The historical date in YYYY-MM-DD format, or undefined for latest
 * @returns A record mapping quote currency codes to exchange rates
 */
export async function fetchRates(
  baseCurrency: string,
  currencies: string[],
  date?: string,
): Promise<Record<string, number>> {
  const normalizedBase = baseCurrency.toUpperCase();
  const normalizedCurrencies = currencies.map((c) => c.toUpperCase());
  const cacheKey = `${normalizedBase}:${[...normalizedCurrencies].sort().join(',')}:${date ?? 'latest'}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.rates;
  }

  const apiKey = getApiKey();
  const currencyParam = normalizedCurrencies.join(',');
  const endpoint = date
    ? `${CURRENCY_ENDPOINT_BASE}/historical?apikey=${apiKey}&base_currency=${normalizedBase}&currencies=${currencyParam}&date=${date}`
    : `${CURRENCY_ENDPOINT_BASE}/latest?apikey=${apiKey}&base_currency=${normalizedBase}&currencies=${currencyParam}`;

  const response = await fetch(endpoint);
  const data = (await response.json()) as CurrencyApiResponse;

  const rates = date
    ? ((data.data?.[date] as Record<string, number>) ?? {})
    : ((data.data as Record<string, number>) ?? {});

  cache.set(cacheKey, { rates, expiresAt: now + CACHE_TTL_MS });
  return rates;
}

/**
 * Clears the in-memory rate cache. Primarily used by tests.
 */
export function clearCache(): void {
  cache.clear();
}
