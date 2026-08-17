import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/server';
import { Logger } from './logger.js';
import { registerTools, registerResources, registerPrompts } from './registrations.js';
import { convertCurrencySchema } from '../tools/convertCurrency.js';
import { getExchangeRateSchema } from '../tools/getExchangeRate.js';
import { convertBatchSchema } from '../tools/convertBatch.js';
import { compareRatesSchema } from '../tools/compareRates.js';
import { currencyPromptSchema } from '../prompts/currencyPrompt.js';

describe('MCP Server Registrations', () => {
  const mockServer = {
    registerTool: vi.fn(),
    registerResource: vi.fn(),
    registerPrompt: vi.fn(),
  } as unknown as McpServer;

  const mockLogger: Logger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    close: vi.fn(),
  } as unknown as Logger;

  it('should register tools correctly', () => {
    registerTools(mockServer, mockLogger);

    expect(mockServer.registerTool).toHaveBeenCalledWith(
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
      expect.any(Function)
    );

    expect(mockServer.registerTool).toHaveBeenCalledWith(
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
      expect.any(Function)
    );

    expect(mockServer.registerTool).toHaveBeenCalledWith(
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
      expect.any(Function)
    );

    expect(mockServer.registerTool).toHaveBeenCalledWith(
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
      expect.any(Function)
    );
  });

  it('should register resources correctly', () => {
    registerResources(mockServer, mockLogger);

    expect(mockServer.registerResource).toHaveBeenCalledWith(
      'list-currencies',
      'list-currencies://list',
      {
        description: 'Lists all supported currencies',
        title: 'list-currencies',
        mimeType: 'text/plain',
      },
      expect.any(Function)
    );
  });

  it('should register prompts correctly', () => {
    registerPrompts(mockServer, mockLogger);

    expect(mockServer.registerPrompt).toHaveBeenCalledWith(
      'currency-conversion-prompt',
      {
        description: 'Prompt for currency conversion details',
        argsSchema: currencyPromptSchema.shape,
      },
      expect.any(Function)
    );
  });
});
