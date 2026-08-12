import { createMcpHandler } from '@modelcontextprotocol/server';
import dotenv from 'dotenv';
import { createFactory } from './factory.js';
import { Logger } from './utils/logger.js';

// Load environment variables from .env file to configure the application
// (a no-op in Lambda, where they come from the function configuration).
dotenv.config({ quiet: true });

const logger = Logger.log();

/**
 * Serverless Framework v4 Lambda entry point.
 *
 * The Framework's `mcp:` property requires the module's default export to be
 * the object `createMcpHandler` returns — a web-standard `fetch` handler. The
 * Framework owns the REST endpoint, response streaming, and the Lambda entry
 * that bridges its streaming runtime to this handler.
 */
const handler = createMcpHandler(createFactory(logger), {
  onerror: (error) => logger.error(`MCP serverless handler error: ${error}`),
});

export default handler;
