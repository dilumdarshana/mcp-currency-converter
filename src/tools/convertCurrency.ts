/**
 * Convert given amount from one currency to another using the Free Currency API.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { z } from 'zod';
import { MCPTool } from '../types';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

type CurrencyApiResponse = {
  data: Record<string, number>;
};

// Schema for the convert currency tool
const schema = z.object({
  fromCurrency: z.string().describe('The currency to convert from (e.g., USD, EUR)'),
  toCurrency: z.string().describe('The currency to convert to (e.g., USD, EUR)'),
  amount: z.number().positive().describe('The amount to convert'),
});

type ConvertCurrencyInput = z.infer<typeof schema>;

export function registerTools(server: McpServer) {
  server.tool(
    'convert-currency', 
    'Converts an amount from one currency to another',
    schema.shape,
    {
      title: 'convert-currency',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    convertCurrency,
  );
};

async function convertCurrency (
  { fromCurrency, toCurrency, amount }: ConvertCurrencyInput
): Promise<CallToolResult> {
  const currencyFinderKey = process.env.FREE_CURRENCY_API_KEY;
  if (!currencyFinderKey) throw new Error('Missing FREE_CURRENCY_KEY');

  try {
    const response = await fetch(
      `https://api.freecurrencyapi.com/v1/latest?apikey=${currencyFinderKey}&base_currency=${fromCurrency}&currencies=${toCurrency}`
    );

    const data = (await response.json()) as CurrencyApiResponse;
    const exchangeRate = data.data?.[toCurrency];

    if (!exchangeRate) throw new Error('Invalid exchange rate');

    const convertedAmount = exchangeRate * amount;

    return {
      content: [
        {
          type: 'text',
          text: `Converted ${amount} ${fromCurrency} to ${toCurrency}: ${convertedAmount} ${toCurrency}`,
          _meta: {},
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${error}`,
        },
      ],
      _meta: {
      },
    };
  }
}


