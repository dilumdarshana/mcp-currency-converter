#!/usr/bin/env node

// Import the function responsible for creating and starting the MCP server
import { createMcpServer } from './server.js';

/**
 * Main entry point for the MCP (Model Context Protocol) server.
 * This function initializes the server and ensures that any errors
 * during startup are properly handled and logged.
 */
async function main() {
  // Start the MCP server
  createMcpServer();
}

// Execute the main function and handle any uncaught errors during startup
main().catch((error) => {
  // Log the error to the console for debugging purposes
  console.error('Error starting MCP server:', error);
  // Exit the process with a non-zero status code to indicate failure
  process.exit(1);
});
