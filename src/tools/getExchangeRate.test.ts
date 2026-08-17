import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getExchangeRate } from './getExchangeRate.js';
import { clearCache } from '../utils/currencyApi.js';
import { Logger } from '../utils/logger.js';

const mockLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  close: vi.fn(),
} as unknown as Logger;

describe('getExchangeRate', () => {
  beforeEach(() => {
    process.env.FREE_CURRENCY_API_KEY = 'fake-api-key';
    global.fetch = vi.fn();
    clearCache();
  });

  it('should return the exchange rate without a date', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { EUR: 0.85 } }),
    });

    const result = await getExchangeRate(
      { fromCurrency: 'USD', toCurrency: 'EUR' },
      mockLogger
    );

    const text = (result.content[0] as { type: 'text'; text: string }).text;
    expect(text).toContain('Exchange rate from USD to EUR on latest');
    expect(text).toContain('0.85');
  });

  it('should return the exchange rate with a date', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { '2025-08-12': { EUR: 0.85 } } }),
    });

    const result = await getExchangeRate(
      { fromCurrency: 'USD', toCurrency: 'EUR', date: '12-08-2025' },
      mockLogger
    );

    const text = (result.content[0] as { type: 'text'; text: string }).text;
    expect(text).toContain('on 12 August 2025');
  });

  it('should default to latest rates when the date is empty or whitespace', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { EUR: 0.85 } }),
    });

    const result = await getExchangeRate(
      { fromCurrency: 'USD', toCurrency: 'EUR', date: '   ' },
      mockLogger
    );

    const text = (result.content[0] as { type: 'text'; text: string }).text;
    expect(text).toContain('on latest');
    expect(text).toContain('0.85');
  });

  it('should normalize lowercase currency codes to uppercase', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { EUR: 0.85 } }),
    });

    const result = await getExchangeRate(
      { fromCurrency: 'usd', toCurrency: 'eur', date: '' },
      mockLogger
    );

    const text = (result.content[0] as { type: 'text'; text: string }).text;
    expect(text).toContain('Exchange rate from USD to EUR on latest');
    expect(text).toContain('0.85');
    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('base_currency=USD');
    expect(url).toContain('currencies=EUR');
  });

  it('should handle an invalid exchange rate', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: {} }),
    });

    const result = await getExchangeRate(
      { fromCurrency: 'USD', toCurrency: 'EUR' },
      mockLogger
    );

    expect((result.content[0] as { type: 'text'; text: string }).text).toContain('Error: Invalid exchange rate');
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
