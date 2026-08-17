import { describe, it, expect, vi, beforeEach } from 'vitest';
import { compareRates } from './compareRates.js';
import { clearCache } from '../utils/currencyApi.js';
import { Logger } from '../utils/logger.js';

const mockLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  close: vi.fn(),
} as unknown as Logger;

describe('compareRates', () => {
  beforeEach(() => {
    process.env.FREE_CURRENCY_API_KEY = 'fake-api-key';
    global.fetch = vi.fn();
    clearCache();
  });

  it('should compare rates across multiple dates', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        json: async () => ({ data: { '2025-08-12': { EUR: 0.85 } } }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ data: { '2025-08-13': { EUR: 0.86 } } }),
      });

    const result = await compareRates(
      { fromCurrency: 'USD', toCurrency: 'EUR', dates: ['12-08-2025', '13-08-2025'] },
      mockLogger
    );

    const text = (result.content[0] as { type: 'text'; text: string }).text;
    expect(text).toContain('across 2 dates');
    expect(text).toContain('12 August 2025');
    expect(text).toContain('13 August 2025');
  });

  it('should handle an invalid exchange rate for a date', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ data: { '2025-08-12': {} } }),
    });

    const result = await compareRates(
      { fromCurrency: 'USD', toCurrency: 'EUR', dates: ['12-08-2025'] },
      mockLogger
    );

    expect((result.content[0] as { type: 'text'; text: string }).text).toContain('Error: Invalid exchange rate for 12-08-2025');
    expect(mockLogger.error).toHaveBeenCalled();
  });
});