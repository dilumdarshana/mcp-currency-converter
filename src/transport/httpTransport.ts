import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'node:crypto';

/**
 * Creates an instance of the MCP HTTP transport.
 * This allows communication over HTTP for remote use.
 */
export function createHttpTransport() {
  return new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });
}
