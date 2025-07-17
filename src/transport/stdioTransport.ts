import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

/**
 * Creates an instance of the MCP Stdio transport.
 * Stdio is typically used when running the MCP server locally or in CLI contexts.
 */
export function createStdioTransport() {
  return new StdioServerTransport();
}
