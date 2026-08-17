import { z } from 'zod';
import type { CallToolResult } from '@modelcontextprotocol/server';
import { Logger } from '../utils/logger.js';
import { formatResponse } from '../utils/mcpResponse.js';
import { fetchRates } from '../utils/currencyApi.js';
import { parseDate } from '../utils/date.js';
import { formatRate } from '../utils/format.js';

export const compareRatesSchema = z.object({
  fromCurrency: z.string().describe('The base currency (e.g., USD)'),
  toCurrency: z.string().describe('The quote currency (e.g., EUR)'),
  dates: z
    .string()
    .min(1)
    .describe('Comma-separated dates to compare in DD-MM-YYYY format (e.g., "12-08-2025, 13-08-2025")'),
});

export type CompareRatesInput = z.infer<typeof compareRatesSchema>;

/**
 * Compares the exchange rate between two currencies across multiple dates.
 * Each date is a separate historical API call (cached per date).
 *
 * @param input The tool input (base/quote currency and the dates to compare)
 * @param logger Logger instance for logging messages and errors
 * @returns A CallToolResult containing the rates per date
 */
export async function compareRates(
  { fromCurrency, toCurrency, dates }: CompareRatesInput,
  logger: Logger,
): Promise<CallToolResult> {
  try {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();
    const dateList = dates
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);
    const rates: Array<{ date: string; rate: string }> = [];

    for (const date of dateList) {
      const { formattedDate, readableDate } = parseDate(date);
      const dateRates = await fetchRates(from, [to], formattedDate);
      const rate = dateRates[to];

      if (!rate) {
        throw new Error(`Invalid exchange rate for ${date}`);
      }

      rates.push({ date: readableDate ?? date, rate: formatRate(rate) });
    }

    return formatResponse({
      message: `Exchange rates from ${from} to ${to} across ${rates.length} dates`,
      rates,
    });
  } catch (error) {
    logger.error(`Error comparing rates: ${error}`);
    return formatResponse({ error: `Error: ${error}` });
  }
}