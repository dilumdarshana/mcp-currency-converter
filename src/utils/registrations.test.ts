import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from './logger.js';
import { registerTools, registerResources, registerPrompts } from './registrations';
import { convertCurrencySchema } from '../tools/convertCurrency.js';
import { currencyPromptSchema } from '../prompts/currencyPrompt.js';

describe('MCP Server Registrations', () => {
  const mockServer = {
    tool: vi.fn(),
    resource: vi.fn(),
    prompt: vi.fn(),
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

    expect(mockServer.tool).toHaveBeenCalledWith(
      'convert-currency',
      'Converts an amount from one currency to another',
      convertCurrencySchema.shape,
      expect.objectContaining({
        title: 'convert-currency',
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      }),
      expect.any(Function)
    );
  });

  it('should register resources correctly', () => {
    registerResources(mockServer, mockLogger);

    expect(mockServer.resource).toHaveBeenCalledWith(
      'list-currencies',
      'list-currencies://list',
      expect.objectContaining({
        description: 'Lists all supported currencies',
        title: 'list-currencies',
        mimeType: 'text/plain',
      }),
      expect.any(Function)
    );
  });

  it('should register prompts correctly', () => {
    registerPrompts(mockServer, mockLogger);

    expect(mockServer.prompt).toHaveBeenCalledWith(
      'currency-conversion-prompt',
      'Prompt for currency conversion details',
      currencyPromptSchema.shape,
      expect.any(Function)
    );
  });
});
