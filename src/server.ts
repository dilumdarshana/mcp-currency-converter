import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import dotenv from 'dotenv';
import { PACKAGE_NAME, VERSION } from './utils/constants.js';
import { createHttpTransport } from './transport/httpTransport.js';
import { createStdioTransport } from './transport/stdioTransport.js';
import { registerTools } from './tools/convertCurrency.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Creates and initializes the MCP server with the chosen transport.
 * @returns Initialized MCP server
 */
export function createMcpServer() {
  const server = new McpServer({
    name: PACKAGE_NAME,
    version: VERSION,
    capabilities: {
      resources: {}, // Add custom resources here
      tools: {},     // Add tools here
      prompts: {},   // Add prompts here
    },
  });

  const transport = process.env.TRANSPORT === 'http'
    ? createHttpTransport()
    : createStdioTransport();

  // Register tools and resources
  registerTools(server);

  server.connect(transport);

  // console.log(`[MCP SERVER] Started using ${process.env.TRANSPORT?.toUpperCase()} transport`);

  return server;
}
