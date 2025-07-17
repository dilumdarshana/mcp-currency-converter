#!/usr/bin/env node
import { createMcpServer } from './server.js';

/**
 * Main entry point for the MCP server.
 * Handles error boundaries and starts the server.
 */
async function main() {
  createMcpServer();
}

main().catch((error) => {
  console.error('Error starting MCP server:', error);
  process.exit(1);
});
