import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchRates, clearCache } from './currencyApi.js';

describe('currencyApi', () => {
  beforeEach(() => {
    process.env.FREE_CURRENCY_API_KEY = 'fake-api-key';
    global.fetch = vi.fn();
    clearCache();
  });

  it('should fetch latest rates', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { EUR: 0.85, GBP: 0.75 } }),
    });

    const rates = await fetchRates('USD', ['EUR', 'GBP']);

    expect(rates).toEqual({ EUR: 0.85, GBP: 0.75 });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should fetch historical rates', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { '2025-08-12': { EUR: 0.85 } } }),
    });

    const rates = await fetchRates('USD', ['EUR'], '2025-08-12');

    expect(rates).toEqual({ EUR: 0.85 });
  });

  it('should cache repeated calls within the TTL', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { EUR: 0.85 } }),
    });

    const first = await fetchRates('USD', ['EUR']);
    const second = await fetchRates('USD', ['EUR']);

    expect(first).toEqual(second);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw when the API key is missing', async () => {
    delete process.env.FREE_CURRENCY_API_KEY;

    await expect(fetchRates('USD', ['EUR'])).rejects.toThrow('Missing FREE_CURRENCY_KEY');
  });
});