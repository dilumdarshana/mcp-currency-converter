import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from './logger.js';
import { registerTools, registerResources, registerPrompts } from './registrations';
import { convertCurrencySchema } from '../tools/convertCurrency.js';
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
