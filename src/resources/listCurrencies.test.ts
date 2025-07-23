import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listCurrencies } from './listCurrencies';
import { Logger } from '../utils/logger';

const mockLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  close: vi.fn(),
} as unknown as Logger;

describe('listCurrencies', () => {
  beforeEach(() => {
    // Mock the environment variable
    process.env.FREE_CURRENCY_API_KEY = 'fake-api-key';

    // Mock the fetch function
    global.fetch = vi.fn();
  });

  it('should list supported currencies successfully', async () => {
    // Mock the API response
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({
        data: { USD: 'United States Dollar', EUR: 'Euro' },
      }),
    });

    const uri = new URL('https://example.com/resource');
    const result = await listCurrencies(uri, mockLogger);

    expect(result.contents[0].text).toContain('USD, EUR');
    expect(mockLogger.info).toHaveBeenCalledWith('Supported currencies: USD, EUR');
  });

  it('should handle missing API key', async () => {
    delete process.env.FREE_CURRENCY_API_KEY;

    const uri = new URL('https://example.com/resource');
    await expect(listCurrencies(uri, mockLogger)).rejects.toThrow('Missing FREE_CURRENCY_KEY');
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

    const uri = new URL('https://example.com/resource');
    await expect(listCurrencies(uri, mockLogger)).rejects.toThrow('API Error');
    expect(mockLogger.error).toHaveBeenCalledWith('Listing supported currencies');
  });
});
