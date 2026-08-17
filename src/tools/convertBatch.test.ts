import { describe, it, expect, vi, beforeEach } from 'vitest';
import { convertBatch } from './convertBatch.js';
import { clearCache } from '../utils/currencyApi.js';
import { Logger } from '../utils/logger.js';

const mockLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  close: vi.fn(),
} as unknown as Logger;

describe('convertBatch', () => {
  beforeEach(() => {
    process.env.FREE_CURRENCY_API_KEY = 'fake-api-key';
    global.fetch = vi.fn();
    clearCache();
  });

  it('should convert to multiple currencies', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { EUR: 0.85, GBP: 0.75 } }),
    });

    const result = await convertBatch(
      { fromCurrency: 'USD', amount: 100, toCurrencies: 'EUR, GBP' },
      mockLogger
    );

    const text = (result.content[0] as { type: 'text'; text: string }).text;
    expect(text).toContain('Converted 100 USD to 2 currencies on latest');
    expect(text).toContain('EUR');
    expect(text).toContain('GBP');
  });

  it('should handle an invalid exchange rate for a currency', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { EUR: 0.85 } }),
    });

    const result = await convertBatch(
      { fromCurrency: 'USD', amount: 100, toCurrencies: 'EUR, GBP' },
      mockLogger
    );

    expect((result.content[0] as { type: 'text'; text: string }).text).toContain('Error: Invalid exchange rate for GBP');
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should normalize lowercase codes and reject unsupported ones', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { EUR: 0.85 } }),
    });

    const result = await convertBatch(
      { fromCurrency: 'usd', amount: 100, toCurrencies: 'eur, XXX' },
      mockLogger
    );

    expect((result.content[0] as { type: 'text'; text: string }).text).toContain('Error: Unsupported currency code(s): XXX');
    expect(mockLogger.error).toHaveBeenCalled();
  });
});