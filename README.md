# Typescript based MCP Currency Converter

A currency converter created with Model Context Protocol (MCP) servers using the `@modelcontextprotocol/sdk`.
This server exposes currency conversion as an MCP tool and resource, allowing LLMs or clients to convert between currencies or list supported currencies via MCP.

## Features

- MCP-compliant server using @modelcontextprotocol/sdk
- Support all transporters. Stdio, http and SSE
- Currency conversion with real-time exchange rates or mock data
- List supported currencies via resources/list or resources/read
- Supports HTTP transport (POST endpoints and SSE if needed)
- Built with TypeScript for type safety
- Uses pnpm for package management

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run built server
npm start
```

### 3. Testing with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["path/to/your/project/dist/server.js"]
    }
  }
}
```

## Architecture

### Base Class: `BaseMcpServer`

The `BaseMcpServer` abstract class provides:

- **Handler setup**: Automatic MCP protocol handler registration
- **Error handling**: Consistent error handling across all operations
- **Utilities**: Helper methods for content creation and validation
- **Logging**: Structured logging to stderr

### Implementation: `ExampleMcpServer`

The example server demonstrates:

- **Tools**: `echo` and `add` tools with input validation
- **Resources**: File and data resources with different content types
- **Prompts**: Template-based prompt generation with arguments

## Creating Your Own Server

### 1. Extend the Base Class

```typescript
import { BaseMcpServer } from './server.js';

export class MyMcpServer extends BaseMcpServer {
  constructor() {
    super({
      name: 'my-custom-server',
      version: '1.0.0',
      description: 'My custom MCP server',
    });
  }

  // Implement abstract methods...
}
```

### 2. Implement Required Methods

```typescript
protected async getTools(): Promise<Tool[]> {
  return [
    {
      name: 'my-tool',
      description: 'Description of my tool',
      inputSchema: {
        type: 'object',
        properties: {
          param: { type: 'string', description: 'Parameter description' }
        },
        required: ['param']
      }
    }
  ];
}

protected async executeTool(name: string, args: Record<string, any>): Promise<any> {
  switch (name) {
    case 'my-tool':
      this.validateArgs(args, ['param']);
      return `Processed: ${args.param}`;
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
```

## Available Scripts

- `npm run build` - Build the TypeScript code
- `npm run dev` - Run in development mode with tsx
- `npm run start` - Run the built server
- `npm run watch` - Watch for changes and rebuild
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run clean` - Clean build directory

## Directory Structure

```
src/
├── server.ts          # Main server implementation
├── types/             # Custom type definitions
├── utils/             # Utility functions
└── handlers/          # Custom handlers (optional)

dist/                  # Built JavaScript files
```

## Configuration

### Server Configuration

```typescript
interface ServerConfig {
  name: string;          // Server name
  version: string;       // Server version
  description?: string;  // Server description
  author?: string;       // Author name
  license?: string;      // License type
}
```

### Environment Variables

You can use environment variables for configuration:

```typescript
const config: ServerConfig = {
  name: process.env.SERVER_NAME || 'my-mcp-server',
  version: process.env.SERVER_VERSION || '1.0.0',
  description: process.env.SERVER_DESCRIPTION || 'My MCP server',
};
```

## Error Handling

The boilerplate includes comprehensive error handling:

```typescript
// Tool execution errors are caught and returned as error responses
protected async executeTool(name: string, args: Record<string, any>): Promise<any> {
  try {
    // Your tool logic here
    return result;
  } catch (error) {
    // Error will be automatically wrapped and returned to client
    throw new Error(`Tool execution failed: ${error.message}`);
  }
}
```

## Logging

Use the built-in logging method:

```typescript
this.log('Server started', 'info');
this.log('Warning message', 'warn');
this.log('Error occurred', 'error');
```

## Validation

Use the validation helper:

```typescript
// Validate required arguments
this.validateArgs(args, ['required_param1', 'required_param2']);
```

## Content Creation Helpers

```typescript
// Create text content
const textContent = this.createTextContent('Hello, world!');

// Create image content
const imageContent = this.createImageContent(base64Data, 'image/png');

// Create embedded resource
const resource = this.createEmbeddedResource('data', { key: 'value' });
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Resources

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop Integration](https://claude.ai/docs/mcp)