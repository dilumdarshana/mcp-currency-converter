# TypeScript-based MCP Currency Converter

A currency converter created with Model Context Protocol (MCP) servers using the v2 TypeScript SDK (`@modelcontextprotocol/server` and `@modelcontextprotocol/node`). This server exposes currency conversion as an MCP tool and resource, allowing LLMs or clients to convert between currencies or list supported currencies via MCP.

```bash
pnpm add @alcorme/mcp-currency-converter
```

## Features

- **MCP-compliant server** using `@modelcontextprotocol/server` v2 (stateless, no session handshake)
- **Transport Support**: Stdio and Streamable HTTP (stateless)
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

# Test with MCP Inspector (stdio)
$ pnpm inspector

# Test with MCP Inspector (http, starts server on :3000 automatically)
$ pnpm inspector-http
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
      "environment": {
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
      "environment": {
        "TRANSPORT": "stdio",
        "PORT": "3000",
        "FREE_CURRENCY_API_KEY": "xxxxx"
      }
    }
  }
}
```

## Deploy to AWS (Serverless Framework)

The server can be deployed as a managed MCP server on AWS Lambda using the Serverless Framework v4's native `mcp:` property. The Framework owns the REST endpoint, response streaming, packaging, and the Lambda entry that bridges its streaming runtime to the server's web-standard `fetch` handler.

The Lambda entry is `src/serverless.ts` (compiled to `dist/serverless.js`), declared in the root `serverless.yml`:

```yml
mcp:
  servers:
    currency-converter:
      server: dist/serverless.js
      timeout: 30
      environment:
        FREE_CURRENCY_API_KEY: ${env:FREE_CURRENCY_API_KEY}
```

The endpoint is public (no authorizer) and served at `https://<api-id>.execute-api.<region>.amazonaws.com/<stage>/currency-converter/mcp`.

### Prerequisites

- A serverless.com account and an access key ([serverless.com](https://app.serverless.com))
- An AWS IAM role that trusts GitHub Actions (OIDC) and can deploy CloudFormation stacks
- GitHub repository secrets:
  - `AWS_DEPLOY_ROLE_ARN` — ARN of the OIDC IAM role
  - `SERVERLESS_ACCESS_KEY` — serverless.com access key
  - `FREE_CURRENCY_API_KEY` — freecurrencyapi.com API key

### Deploy from your machine

```bash
$ pnpm build
$ SERVERLESS_ACCESS_KEY=xxx FREE_CURRENCY_API_KEY=xxx npx serverless@4 deploy
```

### Deploy from GitHub Actions

Pushes to `master` that touch `serverless.yml`, `src/**`, or the dependency manifests trigger `.github/workflows/deploy-aws.yml`, which builds, tests, and deploys with `npx serverless@4 deploy`.

## License

ISC License

---

## Resources

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop Integration](https://claude.ai/docs/mcp)
