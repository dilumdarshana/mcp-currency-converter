import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { Logger } from '../utils/logger';

/**
 * Creates an instance of the MCP HTTP transport.
 * This allows communication over HTTP for remote use.
 */
export function createHttpTransport(server: McpServer, logger: Logger) {
  const app = express();
  app.use(cors({
    origin: '*', // Configure appropriately for production, for example:
    // origin: ['https://your-remote-domain.com', 'https://your-other-remote-domain.com'],
    exposedHeaders: ['Mcp-Session-Id'],
    allowedHeaders: ['Content-Type', 'mcp-session-id'],
  }));
  app.use(express.json());

  const transports = new Map<string, StreamableHTTPServerTransport>();

  app.all('/mcp', async (req: Request, res: Response) => {
    logger.info('Calling MCP all endpoint');
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports.has(sessionId)) {
      // Reuse existing transport
      transport = transports.get(sessionId)!;
    } else if (!sessionId && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => sessionId || randomUUID(),
        onsessioninitialized: (sessionId) => {
          // Store the transport by session ID
          transports.set(sessionId, transport);
        },
      });
      transports.set(transport.sessionId!, transport);

      server.connect(transport);

      transport.onclose = () => {
        transports.delete(transport.sessionId!);
      };
    } else {
      // Invalid request
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  });

  // Health check endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.send(`Convert Currency MCP Server is running`);
  });

  app.get('/mcp', async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    if (!sessionId || !transports.has(sessionId)) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }

    const transport = transports.get(sessionId)!;

    await transport.handleRequest(req, res);
  });

  app.delete('/mcp', async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    if (!sessionId || !transports.has(sessionId)) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }

    const transport = transports.get(sessionId)!;

    await transport.handleRequest(req, res);
  });

  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`MCP HTTP server listening on port ${port}`);
  });

  return app;
}
