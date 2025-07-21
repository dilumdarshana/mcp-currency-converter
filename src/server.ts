import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import dotenv from 'dotenv';
import { PACKAGE_NAME, VERSION } from './utils/constants.js';
import { createHttpTransport } from './transport/httpTransport.js';
import { createStdioTransport } from './transport/stdioTransport.js';
import { Logger } from './utils/logger.js';
import { createSseTransport } from './transport/sseTransport.js';
import { registerResources, registerTools } from './utils/registrations.js';

// Load environment variables from .env file to configure the application
dotenv.config();

/**
 * Creates and initializes the MCP server with the chosen transport.
 * This function sets up the server, registers tools and resources, and
 * configures the transport layer based on the TRANSPORT environment variable.
 * @returns Initialized MCP server
 */
export function createMcpServer() {
  // Initialize logger for logging server activities
  const logger = Logger.log();

  // Create the MCP server instance with basic configuration
  const server = new McpServer({
    name: PACKAGE_NAME, // Name of the package
    version: VERSION,   // Version of the package
    capabilities: {
      resources: {}, // Placeholder for custom resources
      tools: {},     // Placeholder for tools
      prompts: {},   // Placeholder for prompts
    },
  });

  // Register tools and resources to the server
  registerTools(server, logger); // Add tools for server functionality
  registerResources(server, logger); // Add resources for server functionality

  // Configure the transport layer based on the TRANSPORT environment variable
  if (process.env.TRANSPORT === 'http') {
    // Use HTTP transport for communication
    createHttpTransport(server, logger);
  } else if (process.env.TRANSPORT === 'stdio') {
    // Use standard input/output transport for communication
    const transport = createStdioTransport();
    server.connect(transport);
  } else if (process.env.TRANSPORT === 'sse') {
    // Use Server-Sent Events (SSE) transport for communication
    createSseTransport(server, logger);
  } else {
    // Log an error and exit if an invalid transport is specified
    logger.error('Invalid transport specified. Please set TRANSPORT to http | stdio | sse');
    process.exit(1);
  }
}
