/**
 * Convert a given amount from one currency to another using the Free Currency API.
 * This function fetches the latest exchange rate for the specified currencies,
 * calculates the converted amount, and returns the result in a structured format.
 */
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Logger } from '../utils/logger.js';
import { CurrencyApiResponse } from '../types.js';
import { formatResponse } from '../utils/mcpResponse.js';
import { CURRENCY_ENDPOINT_BASE } from '../utils/constants.js';

dayjs.extend(customParseFormat);

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
  // Retrieve the API key for the Free Currency API from environment variables
  const currencyFinderKey = process.env.FREE_CURRENCY_API_KEY;
  if (!currencyFinderKey) throw new Error('Missing FREE_CURRENCY_KEY');

  try {
    // Fetch the latest exchange rate for the specified currencies
    // Normalize the date format to YYYY-MM-DD if a date is provided
    let formattedDate: string | undefined;
    let readableDate: string | undefined;
    if (date) {
      const formats = ['DD-MM-YYYY', 'YYYY-MM-DD', 'MMMM D, YYYY', 'MM/DD/YYYY', 'D MMMM YYYY'];
      const parsedDate = dayjs(date, formats, true);

      if (!parsedDate.isValid()) {
        throw new Error('Invalid date format. Please provide a valid date.');
      }
      formattedDate = parsedDate.format('YYYY-MM-DD');
      readableDate = parsedDate.format('D MMMM YYYY'); // Format to a human-readable date
    }

    // Here have two endpoint to decide
    const endpoint = formattedDate
      ? `${CURRENCY_ENDPOINT_BASE}/historical?apikey=${currencyFinderKey}&base_currency=${fromCurrency}&currencies=${toCurrency}&date=${formattedDate}`
      : `${CURRENCY_ENDPOINT_BASE}/latest?apikey=${currencyFinderKey}&base_currency=${fromCurrency}&currencies=${toCurrency}`;

    const response = await fetch(endpoint);

    // Log the conversion request for debugging purposes
    logger.info(`Converting ${amount} ${fromCurrency} to ${toCurrency}...`);

    // Parse the response data and extract the exchange rate
    const data = (await response.json()) as CurrencyApiResponse;

    // Extract the exchange rate based on the response structure
    let exchangeRate: number | undefined;

    if (formattedDate) {
      // Historical response structure
      const historicalData = data.data[formattedDate] as Record<string, number>;
      exchangeRate = historicalData?.[toCurrency];
    } else {
      // Latest response structure
      exchangeRate = data.data[toCurrency] as number;
    }

    // Throw an error if the exchange rate is invalid or missing
    if (!exchangeRate) {
      throw new Error('Invalid exchange rate');
    }

    // Calculate the converted amount using the exchange rate
    const convertedAmount = parseFloat((exchangeRate * amount).toFixed(2));

    // Use the formatResponse utility to standardize the response format
    return formatResponse({
      message: `Converted ${amount} ${fromCurrency} to ${toCurrency} on ${readableDate || 'latest'}: ${convertedAmount} ${toCurrency}`,
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
