import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import dotenv from 'dotenv';
import { PACKAGE_NAME, VERSION } from './utils/constants.js';
import { createHttpTransport } from './transport/httpTransport.js';
import { createStdioTransport } from './transport/stdioTransport.js';
import { registerTools } from './tools/convertCurrency.js';
import { Logger } from './utils/logger.js';


import express from 'express';
import cors from 'cors';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';

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

  if (process.env.TRANSPORT === 'http') {
    const transport = createHttpTransport(server, logger);
  } else {
    const transport = createStdioTransport();
    server.connect(transport);
  }

  // const app = express();
  // // app.use(cors());
  // app.use(express.json());

  // // Connect the server to the transport
  // app.all('/mcp', async (req: Request, res: Response) => {
  //   const transport = new StreamableHTTPServerTransport({
  //     sessionIdGenerator: () => randomUUID(),
  //   });
  //   server.connect(transport);

  //   await transport.handleRequest(req, res, req.body);
  // });

  // app.get('/', (_req: Request, res: Response) => {
  //   res.send('MCP HTTP Transport is running');
  // });

  // app.listen(3000, () => {
  //   // console.log('MCP Server is running at http://localhost:3000/mcp');
  // });

  // logger.info(`[MCP SERVER] Started using ${process.env.TRANSPORT?.toUpperCase()} transport`);

  // return server;
}
