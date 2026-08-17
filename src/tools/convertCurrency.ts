/**
 * Convert a given amount from one currency to another using the Free Currency API.
 * This function fetches the latest exchange rate for the specified currencies,
 * calculates the converted amount, and returns the result in a structured format.
 */
import { z } from 'zod';
import type { CallToolResult } from '@modelcontextprotocol/server';
import { Logger } from '../utils/logger.js';
import { formatResponse } from '../utils/mcpResponse.js';
import { fetchRates } from '../utils/currencyApi.js';
import { parseDate } from '../utils/date.js';

// Define the schema for the convert currency tool input
export const convertCurrencySchema = z.object({
  fromCurrency: z.string().describe('The currency to convert from (e.g., USD, EUR)'), // Source currency
  toCurrency: z.string().describe('The currency to convert to (e.g., USD, EUR)'),   // Target currency
  amount: z.number().positive().describe('The amount to convert'),                 // Amount to be converted
  date: z.string().optional().describe('The historical date for conversion in DD-MM-YYYY format')
});

// Define the TypeScript type for the input based on the schema
export type ConvertCurrencyInput = z.infer<typeof convertCurrencySchema>;

/**
 * Converts a given amount from one currency to another.
 *
 * @param fromCurrency The source currency code (e.g., USD)
 * @param toCurrency The target currency code (e.g., EUR)
 * @param amount The amount to convert
 * @param date The date want to get exchange rate (eg. 14-08-2025)
 * @param logger Logger instance for logging messages and errors
 * @returns A promise that resolves to a CallToolResult containing the conversion result
 */
export async function convertCurrency(
  { fromCurrency, toCurrency, amount, date }: ConvertCurrencyInput,
  logger: Logger,
): Promise<CallToolResult> {
  try {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();
    const { formattedDate, readableDate } = parseDate(date);

    // Log the conversion request for debugging purposes
    logger.info(`Converting ${amount} ${from} to ${to}...`);

    // Fetch the exchange rate for the specified currencies (cached by the API client)
    const rates = await fetchRates(from, [to], formattedDate);
    const exchangeRate = rates[to];

    // Throw an error if the exchange rate is invalid or missing
    if (!exchangeRate) {
      throw new Error('Invalid exchange rate');
    }

    // Calculate the converted amount using the exchange rate
    const convertedAmount = parseFloat((exchangeRate * amount).toFixed(2));

    // Use the formatResponse utility to standardize the response format
    return formatResponse({
      message: `Converted ${amount} ${from} to ${to} on ${readableDate || 'latest'}: ${convertedAmount} ${to}`,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error(`Error converting currency: ${error}`);

    // Use the formatResponse utility to standardize the error response
    return formatResponse({
      error: `Error: ${error}`,
    });
  }
}
