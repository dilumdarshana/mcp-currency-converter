import { z } from 'zod';
import { Logger } from '../utils/logger.js';
import { formatMessageResponse } from '../utils/mcpResponse.js';

// Define the schema for the currency conversion prompt
export const currencyPromptSchema = z.object({
  fromCurrency: z.string().describe('The currency to convert from (e.g., USD, EUR)'), // Source currency
  toCurrency: z.string().describe('The currency to convert to (e.g., USD, EUR)'),   // Target currency
  amount: z.string().describe('The amount to convert'),                            // Amount to be converted (as a string)
});

// Define the TypeScript type for the input based on the schema
export type CurrencyPromptInput = z.infer<typeof currencyPromptSchema>;

/**
 * Handles the currency conversion prompt.
 *
 * This function processes the user-provided input for the currency conversion prompt,
 * validates the input, and returns a standardized response.
 *
 * @param input The user-provided input for the prompt, including the source currency,
 *              target currency, and the amount to convert.
 * @param logger Logger instance for logging messages and errors.
 * @returns A formatted response with the prompt result, including a message
 *          describing the conversion request.
 */
export async function handleCurrencyPrompt(
  input: CurrencyPromptInput,
  logger: Logger,
) {
  // Log the received prompt input for debugging purposes
  logger.info(`Prompt received: ${JSON.stringify(input)}`);

  // Extract the input fields
  const { fromCurrency, toCurrency, amount } = input;

  // Parse the amount field to a number for validation
  const parsedAmount = parseFloat(amount);

  // Check if the parsed amount is a valid number
  if (isNaN(parsedAmount)) {
    throw new Error('Invalid amount provided. Please enter a valid number.');
  }

  // Return a standardized response using the formatMessageResponse utility
  return formatMessageResponse(
    `You want to convert ${amount} from ${fromCurrency} to ${toCurrency}.`, // Response message
  );
}
