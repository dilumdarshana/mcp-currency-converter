import { serveStdio } from '@modelcontextprotocol/server/stdio';
import dotenv from 'dotenv';
import { createFactory } from './factory.js';
import { createHttpTransport } from './transport/httpTransport.js';
import { Logger } from './utils/logger.js';

// Load environment variables from .env file to configure the application
dotenv.config({ quiet: true });

/**
 * Creates and initializes the MCP server with the chosen transport.
 * This function sets up the server, registers tools and resources, and
 * configures the transport layer based on the TRANSPORT environment variable.
 *
 * The v2 SDK is factory-based: `serveStdio` and `createMcpHandler` invoke the
 * factory to build a fresh server instance per connection.
 *
 * @returns Initialized MCP server
 */
export function createMcpServer() {
  // Initialize logger for logging server activities
  const logger = Logger.log();

  // Factory builds a fresh server per connection, capturing shared state
  // (logger) in a closure.
  const factory = createFactory(logger);

  // Configure the transport layer based on the TRANSPORT environment variable.
  // Defaults to stdio when TRANSPORT is unset — the inspector and most MCP
  // hosts spawn the server with a filtered environment, so they cannot rely on
  // an externally-set TRANSPORT variable.
  const transport = process.env.TRANSPORT || 'stdio';

  if (transport === 'http') {
    createHttpTransport(factory, logger);
  } else if (transport === 'stdio') {
    serveStdio(factory);
  } else {
    logger.error('Invalid transport specified. Please set TRANSPORT to http | stdio');
    process.exit(1);
  }
}
