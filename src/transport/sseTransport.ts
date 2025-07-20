import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { Logger } from '../utils/logger';

export function createSseTransport(server: McpServer, logger: Logger) {
  const app = express();
  app.use(express.json());
  
  // Store transports for each session type
  const transports = {
    sse: {} as Record<string, SSEServerTransport>
  };

  // Legacy SSE endpoint for older clients
  app.get('/sse', async (_req, res) => {
    logger.info('Calling MCP all endpoint');
    // Create SSE transport for legacy clients
    const transport = new SSEServerTransport('/messages', res);
    transports.sse[transport.sessionId] = transport;
    
    res.on('close', () => {
      delete transports.sse[transport.sessionId];
    });
    
    await server.connect(transport);
  });

  // Legacy message endpoint for older clients
  app.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.sse[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res, req.body);
    } else {
      res.status(400).send('No transport found for sessionId');
    }
  });

  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(3000, () => {
    logger.info(`MCP HTTP server listening on port ${port}`);
  });

  return app;
}
