import { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import { Logger } from '../utils/logger.js';

/**
 * Lists all supported currencies using the Free Currency API.
 * This function fetches the list of available currencies from the API,
 * logs the supported currencies, and returns them in a structured format.
 *
 * @param uri The URI for the resource being accessed
 * @param logger Logger instance for logging messages and errors
 * @returns A promise that resolves to a ReadResourceResult containing the list of currencies
 */
export async function listCurrencies(
  uri: URL,
  logger: Logger,
): Promise<ReadResourceResult> {
  // Retrieve the API key for the Free Currency API from environment variables
  const currencyFinderKey = process.env.FREE_CURRENCY_API_KEY;
  if (!currencyFinderKey) throw new Error('Missing FREE_CURRENCY_KEY');

  // Log the start of the currency listing process
  logger.error('Listing supported currencies');

  // Fetch the list of supported currencies from the Free Currency API
  const response = await fetch(
    `https://api.freecurrencyapi.com/v1/currencies?apikey=${currencyFinderKey}`
  );

  // Parse the response data and extract the list of currencies
  const data: any = await response.json();
  const currencies = Object.keys(data.data).join(', ');

  // Log the supported currencies for debugging purposes
  logger.info(`Supported currencies: ${currencies}`);

  // Return the list of currencies in a structured format
  return {
    contents: [
      {
        uri: uri.toString(), // The URI of the resource
        text: currencies,    // The list of currencies as a comma-separated string
        mimeType: 'text/plain', // The MIME type of the response
        description: 'List of supported currencies', // A description of the response
      },
    ],
  };
}
