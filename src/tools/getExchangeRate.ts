import { z } from 'zod';
import type { CallToolResult } from '@modelcontextprotocol/server';
import { Logger } from '../utils/logger.js';
import { formatResponse } from '../utils/mcpResponse.js';
import { fetchRates } from '../utils/currencyApi.js';
import { parseDate } from '../utils/date.js';
import { formatRate } from '../utils/format.js';

export const getExchangeRateSchema = z.object({
  fromCurrency: z.string().describe('The base currency (e.g., USD)'),
  toCurrency: z.string().describe('The quote currency (e.g., EUR)'),
  date: z.string().optional().describe('The historical date for the rate in DD-MM-YYYY format'),
});

export type GetExchangeRateInput = z.infer<typeof getExchangeRateSchema>;

/**
 * Returns the exchange rate between two currencies, for the latest date or a
 * specific historical date.
 *
 * @param input The tool input (base/quote currency and optional date)
 * @param logger Logger instance for logging messages and errors
 * @returns A CallToolResult containing the exchange rate
 */
export async function getExchangeRate(
  { fromCurrency, toCurrency, date }: GetExchangeRateInput,
  logger: Logger,
): Promise<CallToolResult> {
  try {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();
    const { formattedDate, readableDate } = parseDate(date);
    const rates = await fetchRates(from, [to], formattedDate);
    const rate = rates[to];

    if (!rate) {
      throw new Error('Invalid exchange rate');
    }

    return formatResponse({
      message: `Exchange rate from ${from} to ${to} on ${readableDate || 'latest'}: ${formatRate(rate)}`,
      fromCurrency: from,
      toCurrency: to,
      rate: formatRate(rate),
      date: readableDate || 'latest',
    });
  } catch (error) {
    logger.error(`Error fetching exchange rate: ${error}`);
    return formatResponse({ error: `Error: ${error}` });
  }
}
