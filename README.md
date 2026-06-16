# TypeScript-based MCP Currency Converter

A currency converter created with Model Context Protocol (MCP) servers using the `@modelcontextprotocol/sdk`. This server exposes currency conversion as an MCP tool and resource, allowing LLMs or clients to convert between currencies or list supported currencies via MCP.

```bash
pnpm add @alcorme/mcp-currency-converter
```

## Features

- **MCP-compliant server** using `@modelcontextprotocol/sdk`
- **Transport Support**: Stdio, HTTP, and SSE
- **Currency Conversion**: Real-time exchange rates or historical exchange rates
- **Resource Management**: List supported currencies via resources
- **Prompt Capability**: Interactive prompts for dynamic input
- **Unit Testing**: Vitest powered unit testing
- **Type Safety**: Built with TypeScript
- **Package Management**: Uses `pnpm` for efficient dependency management
- **Authentication for http transport**: TBD

---

## Example queries
- Convert 1 USD to EUR
- Convert 1 USD to EUR on 12 August 2025


## Prerequisites
- Node.js >=24
- API key from https://freecurrencyapi.com
- pnpm

## Development

```bash
# Clone repository
$ git clone git@github.com:dilumdarshana/mcp-currency-converter.git

# Use the correct Node.js version
$ nvm use

# Create .env file from .env_sample with your API key
$ cp .env_sample .env

# Install dependencies
$ pnpm install

# Watch mode (no rebuild needed)
$ pnpm build:dev

# Build for production
$ pnpm build

# Run tests
$ pnpm test

# Test with MCP Inspector
$ pnpm inspector
```

## Integrate with Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

Using a local build,

```json
{
  "mcpServers": {
    "currency-converter": {
      "command": "node",
      "args": ["/path/to/mcp-currency-converter/dist/index.js"],
      "env": {
        "TRANSPORT": "stdio",
        "PORT": "3000",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}
```

Using the npm module (no local build needed),

```json
{
  "mcpServers": {
    "currency-converter": {
      "command": "npx",
      "args": ["-y", "@alcorme/mcp-currency-converter"],
      "env": {
        "TRANSPORT": "stdio",
        "PORT": "3000",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}
```

## Integrate with VS Code GitHub Copilot

Edit VS Code's `mcp.json` (`.vscode/mcp.json` in your project or the global User `mcp.json`):

Using stdio (local build),

```json
{
  "servers": {
    "currency-converter": {
      "command": "node",
      "args": ["/path/to/mcp-currency-converter/dist/index.js"],
      "env": {
        "TRANSPORT": "stdio",
        "PORT": "3000",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}
```

Using npm module,

```json
{
  "servers": {
    "currency-converter": {
      "command": "npx",
      "args": ["-y", "@alcorme/mcp-currency-converter"],
      "env": {
        "TRANSPORT": "stdio",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}
```

Using HTTP transport (works well with VS Code Copilot Agent),

```json
{
  "servers": {
    "currency-converter": {
      "type": "http",
      "url": "http://localhost:3000/mcp",
      "env": {
        "TRANSPORT": "http",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}
```

## Integrate with OpenCode

OpenCode uses its own MCP server configuration. Add to your `opencode.json` or `.opencode.json`:

Using a local build,

```json
{
  "mcp": {
    "currency-converter": {
      "type": "local",
      "command": ["node", "/path/to/mcp-currency-converter/dist/index.js"],
      "env": {
        "TRANSPORT": "stdio",
        "PORT": "3000",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}
```

Using the npm module,

```json
{
  "mcp": {
    "currency-converter": {
      "type": "local",
      "command": ["npx", "-y", "@alcorme/mcp-currency-converter"],
      "env": {
        "TRANSPORT": "stdio",
        "PORT": "3000",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}
```

## License

MIT License

---

## Resources

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop Integration](https://claude.ai/docs/mcp)
