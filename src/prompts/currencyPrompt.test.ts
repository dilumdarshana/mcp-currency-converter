import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleCurrencyPrompt } from './currencyPrompt';
import { Logger } from '../utils/logger';

const mockLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  close: vi.fn(),
} as unknown as Logger;

describe('handleCurrencyPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle valid input correctly', async () => {
    const input = {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: '100',
    };

    const result = await handleCurrencyPrompt(input, mockLogger);

    // Adjust the assertion to match the actual response structure
    expect(result.messages[0].content.text).toContain('You want to convert 100 from USD to EUR.');
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Prompt received: {"fromCurrency":"USD","toCurrency":"EUR","amount":"100"}'
    );
  });

  it('should throw an error for invalid amount', async () => {
    const input = {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 'invalid',
    };

    await expect(handleCurrencyPrompt(input, mockLogger)).rejects.toThrow(
      'Invalid amount provided. Please enter a valid number.'
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Prompt received: {"fromCurrency":"USD","toCurrency":"EUR","amount":"invalid"}'
    );
  });

  it('should handle edge case for zero amount', async () => {
    const input = {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: '0',
    };

    const result = await handleCurrencyPrompt(input, mockLogger);

    // Adjust the assertion to match the actual response structure
    expect(result.messages[0].content.text).toContain('You want to convert 0 from USD to EUR.');
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Prompt received: {"fromCurrency":"USD","toCurrency":"EUR","amount":"0"}'
    );
  });
});
