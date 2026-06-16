import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from './logger.js';
import { convertCurrency, convertCurrencySchema } from '../tools/convertCurrency.js';
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
      argsSchema: currencyPromptSchema.shape,
    },
    (input) => handleCurrencyPrompt(input, logger),
  );
}
