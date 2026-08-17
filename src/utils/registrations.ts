import { McpServer } from '@modelcontextprotocol/server';
import { Logger } from './logger.js';
import { convertCurrency, convertCurrencySchema } from '../tools/convertCurrency.js';
import { getExchangeRate, getExchangeRateSchema } from '../tools/getExchangeRate.js';
import { convertBatch, convertBatchSchema } from '../tools/convertBatch.js';
import { compareRates, compareRatesSchema } from '../tools/compareRates.js';
import { listCurrencies } from '../resources/listCurrencies.js';
import { currencyPromptSchema, handleCurrencyPrompt } from '../prompts/currencyPrompt.js';

/**
 * Registers all tools to the MCP server.
 * @param server The MCP server instance
 * @param logger The logger instance
 */
export function registerTools(server: McpServer, logger: Logger) {
  server.registerTool(
    'convert-currency',
    {
      title: 'convert-currency',
      description: 'Converts an amount from one currency to another',
      inputSchema: convertCurrencySchema,
      annotations: {
        title: 'convert-currency',
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    (input) => convertCurrency(input, logger),
  );

  server.registerTool(
    'get-exchange-rate',
    {
      title: 'get-exchange-rate',
      description: 'Returns the exchange rate between two currencies',
      inputSchema: getExchangeRateSchema,
      annotations: {
        title: 'get-exchange-rate',
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    (input) => getExchangeRate(input, logger),
  );

  server.registerTool(
    'convert-batch',
    {
      title: 'convert-batch',
      description: 'Converts an amount from one currency to multiple currencies in a single call',
      inputSchema: convertBatchSchema,
      annotations: {
        title: 'convert-batch',
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    (input) => convertBatch(input, logger),
  );

  server.registerTool(
    'compare-rates',
    {
      title: 'compare-rates',
      description: 'Compares the exchange rate between two currencies across multiple dates',
      inputSchema: compareRatesSchema,
      annotations: {
        title: 'compare-rates',
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    (input) => compareRates(input, logger),
  );
}

/**
 * Registers all resources to the MCP server.
 * @param server The MCP server instance
 * @param logger The logger instance
 */
export function registerResources(server: McpServer, logger: Logger) {
  server.registerResource(
    'list-currencies',
    'list-currencies://list',
    {
      description: 'Lists all supported currencies',
      title: 'list-currencies',
      mimeType: 'text/plain',
    },
    (uri) => listCurrencies(uri, logger),
  );
}

/**
 * Registers all prompts to the MCP server.
 * @param server The MCP server instance
 * @param logger The logger instance
 */
export function registerPrompts(server: McpServer, logger: Logger) {
  server.registerPrompt(
    'currency-conversion-prompt',
    {
      description: 'Prompt for currency conversion details',
      argsSchema: currencyPromptSchema,
    },
    (input) => handleCurrencyPrompt(input, logger),
  );
}
