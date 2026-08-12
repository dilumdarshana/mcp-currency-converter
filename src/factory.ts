import { McpServer } from '@modelcontextprotocol/server';
import { PACKAGE_NAME, VERSION } from './utils/constants.js';
import { Logger } from './utils/logger.js';
import { registerPrompts, registerResources, registerTools } from './utils/registrations.js';

/**
 * Creates the MCP server factory shared by every entry point (stdio, HTTP,
 * and the Serverless Framework v4 Lambda entry).
 *
 * The v2 SDK is factory-based: `serveStdio` and `createMcpHandler` invoke the
 * returned closure to build a fresh `McpServer` per connection, capturing
 * shared state (the logger) in the closure.
 *
 * @param logger The logger instance shared by all server instances
 * @returns A factory that builds a fully registered `McpServer` per call
 */
export function createFactory(logger: Logger) {
  return () => {
    const server = new McpServer(
      {
        name: PACKAGE_NAME,
        version: VERSION,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      },
    );

    // Register tools, resources, and prompts to the server
    registerTools(server, logger);
    registerResources(server, logger);
    registerPrompts(server, logger);

    return server;
  };
}
