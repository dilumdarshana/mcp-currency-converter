import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import { Logger } from '../utils/logger.js';

export function registerResources(server: McpServer, logger: Logger) {
  server.resource(
    'list-currencies',
    'list-currencies://list',
    {
      description: 'Lists all supported currencies',
      title: 'list-currencies',
      mimeType: 'text/plain',
    },
    (uri) => listCurrencies(uri, logger),
  );
};

async function listCurrencies (
  uri: URL,
  logger: Logger,
): Promise<ReadResourceResult> {
  const currencyFinderKey = process.env.FREE_CURRENCY_API_KEY;
  if (!currencyFinderKey) throw new Error('Missing FREE_CURRENCY_KEY');

  logger.error('Listing supported currencies');

  const response = await fetch(
    `https://api.freecurrencyapi.com/v1/currencies?apikey=${currencyFinderKey}`
  );
  const data: any = await response.json();
  const currencies = Object.keys(data.data).join(', ');
  logger.info(`Supported currencies: ${currencies}`);

  return {
    contents: [
      {
        uri: uri.toString(),
        text: currencies,
        mimeType: 'text/plain',
        description: 'List of supported currencies',
      },
    ],
  };
};
