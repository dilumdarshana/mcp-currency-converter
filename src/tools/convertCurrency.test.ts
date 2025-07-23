import { describe, it, expect, vi, beforeEach } from 'vitest';
import { convertCurrency } from './convertCurrency';
import { Logger } from '../utils/logger';

const mockLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  close: vi.fn(),
} as unknown as Logger;

describe('convertCurrency', () => {
  beforeEach(() => {
    // Mock the environment variable
    process.env.FREE_CURRENCY_API_KEY = 'fake-api-key';

    // Mock the fetch function
    global.fetch = vi.fn();
  });

  it('should convert currency successfully', async () => {
    // Mock the API response
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({
        data: { EUR: 0.85 },
      }),
    });

    const result = await convertCurrency(
      { fromCurrency: 'USD', toCurrency: 'EUR', amount: 100 },
      mockLogger
    );

    expect(result.content[0].text).toContain('Converted 100 USD to EUR: 85 EUR');
    expect(mockLogger.info).toHaveBeenCalledWith('Converting 100 USD to EUR...');
  });

  it('should handle missing API key', async () => {
    delete process.env.FREE_CURRENCY_API_KEY;

    await expect(
      convertCurrency({ fromCurrency: 'USD', toCurrency: 'EUR', amount: 100 }, mockLogger)
    ).rejects.toThrow('Missing FREE_CURRENCY_KEY');
  });

  it('should handle invalid exchange rate', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({
        data: {},
      }),
    });

    const result = await convertCurrency(
      { fromCurrency: 'USD', toCurrency: 'EUR', amount: 100 },
      mockLogger
    );

    // Validate the content array for the error message
    expect(result.content[0].text).toContain('Error: Invalid exchange rate');
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
