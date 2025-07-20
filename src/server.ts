import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import dotenv from 'dotenv';
import { PACKAGE_NAME, VERSION } from './utils/constants.js';
import { createHttpTransport } from './transport/httpTransport.js';
import { createStdioTransport } from './transport/stdioTransport.js';
import { registerTools } from './tools/convertCurrency.js';
import { Logger } from './utils/logger.js';
import { registerResources } from './resources/listCurrencies.js';
import { createSseTransport } from './transport/sseTransport.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Creates and initializes the MCP server with the chosen transport.
 * @returns Initialized MCP server
 */
export function createMcpServer() {
  // Initialize logger
  const logger = Logger.log();

  // Create the MCP server instance
  const server = new McpServer({
    name: PACKAGE_NAME,
    version: VERSION,
    capabilities: {
      resources: {}, // Add custom resources here
      tools: {},     // Add tools here
      prompts: {},   // Add prompts here
    },
  });

  // Register tools and resources
  registerTools(server, logger);

  registerResources(server, logger);

  if (process.env.TRANSPORT === 'http') {
    createHttpTransport(server, logger);
  } else if (process.env.TRANSPORT === 'stdio') {
    const transport = createStdioTransport();
    server.connect(transport);
  } else if (process.env.TRANSPORT === 'sse') {
    createSseTransport(server, logger);
  } else {
    logger.error('Invalid transport specified. Please set TRANSPORT to http | stdio | sse');
    process.exit(1);
  }
}
