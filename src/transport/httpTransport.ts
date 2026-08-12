import { createMcpHandler, type McpServer } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';
import express from 'express';
import cors from 'cors';
import { Logger } from '../utils/logger.js';

/**
 * Creates an instance of the MCP HTTP transport.
 * This allows communication over HTTP for remote use.
 *
 * The v2 SDK exposes a web-standard handler (`createMcpHandler`) which is
 * adapted to a Node/Express middleware via `toNodeHandler`. The transport is
 * stateless — no session IDs are negotiated and a fresh server is built per
 * request via the factory.
 *
 * @param factory Builds a fresh server instance per request
 * @param logger The logger instance
 */
export function createHttpTransport(factory: () => McpServer, logger: Logger) {
  const app = express();
  app.use(
    cors({
      origin: '*', // Configure appropriately for production, for example:
      // origin: ['https://your-remote-domain.com', 'https://your-other-remote-domain.com'],
    }),
  );

  const handler = createMcpHandler(factory, {
    onerror: (error) => logger.error(`MCP HTTP handler error: ${error}`),
  });
  const mcpHandler = toNodeHandler(handler);

  // MCP endpoint for the streamable HTTP transport
  app.all('/mcp', mcpHandler);

  // Health check endpoint
  app.get('/', (_req: express.Request, res: express.Response) => {
    res.send('Convert Currency MCP Server is running');
  });

  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`MCP HTTP server listening on port ${port}`);
  });

  return app;
}
