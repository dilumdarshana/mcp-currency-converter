# TypeScript-based MCP Currency Converter

A currency converter created with Model Context Protocol (MCP) servers using the `@modelcontextprotocol/sdk`. This server exposes currency conversion as an MCP tool and resource, allowing LLMs or clients to convert between currencies or list supported currencies via MCP.


## Features

- **MCP-compliant server** using `@modelcontextprotocol/sdk`
- **Transport Support**: Stdio, HTTP, and SSE
- **Currency Conversion**: Real-time exchange rates or mock data
- **Resource Management**: List supported currencies via resources
- **Prompt Capability**: Interactive prompts for dynamic input
- **Type Safety**: Built with TypeScript
- **Package Management**: Uses `pnpm` for efficient dependency management
- **Authentication for http transport**: TBD

---

## Prerequisites
- Node.js (tested on v22.11.0)
- API key from https://freecurrencyapi.com
- pnpm


```

## Development

```bash
# Close repository
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

# Testing with Inspector
$ pnpm inspector
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

# Using npm module,
{
  "mcpServers": {
    "currency-converter": {
      "command": "pnpx",
      "args": ["alcorme-mcp-server"],
      "env": {
        "TRANSPORT": "stdio",
        "PORT": "3000",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}

# Using http transport. (This is still testing on Claude)
# TBD
```

## Integrate with VS Code Github Copilot

## Integrate with Typescript MCP Client

## License

MIT License

---

## Resources

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop Integration](https://claude.ai/docs/mcp)