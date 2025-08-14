# TypeScript-based MCP Currency Converter

A currency converter created with Model Context Protocol (MCP) servers using the `@modelcontextprotocol/sdk`. This server exposes currency conversion as an MCP tool and resource, allowing LLMs or clients to convert between currencies or list supported currencies via MCP.

```bash
npm install @alcorme/mcp-currency-converter
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
- Node.js (tested on v22.11.0)
- API key from https://freecurrencyapi.com
- pnpm

## Development

```bash
# Clone repository
$ git clone git@github.com:dilumdarshana/mcp-currency-converter.git

# Set prefered Node.js version
$ nvm use

# Create .env file from .env_example with correct values

# Install dependecies
$ pnpm install

# Watch changes
$ pnpm build:dev

# Build
$ pnpm build

# Testing
$ pnpm test

# Testing with Inspector
$ pnpm inspector

# If want to test in stdio mode from local, make sure that .env has TRANSPORT=stdio
```
## Run with http transport

```bash
$ pnpm build:dev
```

## Integrate with Claude Desktop

Add to your Claude Desktop configuration:

Using clone the git repository to the local and need build,

```json
{
  "mcpServers": {
    "currency-converter": {
      "command": "/Users/xxxx/.nvm/versions/node/v22.11.0/bin/node",
      "args": ["/private/var/www/github/mcp-currency-converter/dist/index.js"],
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
  "mcpServers": {
    "currency-converter": {
      "command": "npx",
      "args": ["-y", "@alcorme/mcp-currency-converter"],
      "env": {
        "TRANSPORT": "stdio",
        "PORT": "3000",
        "FREE_CURRENCY_API_KEY": "xxxxxx"
      }
    }
  }
}
```

Claude does not work well with http. I need to research it further

## Integrate with VS Code Github Copilot

Edit the VS Code mcp.json file which is stored in Code/User folder

```json
{
  "servers": {
    "alcorme-mcp-currency-converter": {
      "command": "npx",
      "args": ["-y", "@alcorme/mcp-currency-converter"],
      "path": "/Users/dilum/.nvm/versions/node/v22.11.0/bin",
      "env": {
        "TRANSPORT": "stdio",
        "PORT": "3000",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}
```

VS Code Copilot Agent works well with http transport
```json
{
  "servers": {
    "alcorme-mcp-currency-converter": {
      "type": "http",
      "url": "http://localhost:3000/mcp",
      "env": {
        "TRANSPORT": "http",
        "PORT": "3000",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}
```

## Integrate with Typescript MCP Client
TBD

## License

MIT License

---

## Resources

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop Integration](https://claude.ai/docs/mcp)
