import { z } from 'zod';
import type { CallToolResult } from '@modelcontextprotocol/server';
import { Logger } from '../utils/logger.js';
import { formatResponse } from '../utils/mcpResponse.js';
import { fetchRates } from '../utils/currencyApi.js';
import { parseDate } from '../utils/date.js';
import { formatAmount, formatRate } from '../utils/format.js';

export const convertBatchSchema = z.object({
  fromCurrency: z.string().describe('The currency to convert from (e.g., USD)'),
  amount: z.number().positive().describe('The amount to convert'),
  toCurrencies: z
    .array(z.string())
    .min(1)
    .describe('The currencies to convert to (e.g., ["EUR", "GBP"])'),
  date: z.string().optional().describe('The historical date for conversion in DD-MM-YYYY format'),
});

export type ConvertBatchInput = z.infer<typeof convertBatchSchema>;

/**
 * Converts an amount from one currency to multiple target currencies in a
 * single call, using one exchange-rate fetch.
 *
 * @param input The tool input (source currency, amount, target currencies, optional date)
 * @param logger Logger instance for logging messages and errors
 * @returns A CallToolResult containing the conversions
 */
export async function convertBatch(
  { fromCurrency, amount, toCurrencies, date }: ConvertBatchInput,
  logger: Logger,
): Promise<CallToolResult> {
  try {
    const from = fromCurrency.toUpperCase();
    const targets = toCurrencies.map((c) => c.toUpperCase());
    const { formattedDate, readableDate } = parseDate(date);
    const rates = await fetchRates(from, targets, formattedDate);

    const conversions = targets.map((toCurrency) => {
      const rate = rates[toCurrency];
      if (!rate) {
        throw new Error(`Invalid exchange rate for ${toCurrency}`);
      }
      return {
        toCurrency,
        rate: formatRate(rate),
        convertedAmount: formatAmount(amount * rate, toCurrency),
      };
    });

    return formatResponse({
      message: `Converted ${amount} ${from} to ${conversions.length} currencies on ${readableDate || 'latest'}`,
      conversions,
    });
  } catch (error) {
    logger.error(`Error converting batch: ${error}`);
    return formatResponse({ error: `Error: ${error}` });
  }
}