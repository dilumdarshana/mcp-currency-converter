import { z } from 'zod';

/**
 * Represents a tool in the MCP server.
 *
 * @template TInput - The Zod schema type for the tool's input.
 * @property title - The title of the tool.
 * @property description - A brief description of the tool's functionality.
 * @property schema - The Zod schema used to validate the tool's input.
 * @property handler - The function that processes the tool's input and returns a result.
 */
export interface MCPTool<TInput extends z.ZodTypeAny = any> {
  title: string; // The name of the tool
  description: string; // A short description of what the tool does
  schema: TInput; // The input schema for validating tool inputs
  handler: (input: z.infer<TInput>) => Promise<any>; // The function to handle the tool's logic
};

/**
 * Represents the response from the currency API.
 *
 * @property data - A record where the keys are currency codes (e.g., USD, EUR)
 *                  and the values are the exchange rates relative to a base currency.
 */
export interface CurrencyApiResponse {
  data: Record<string, number>; // Mapping of currency codes to their exchange rates
};
