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

The Lambda entry is `src/serverless.ts`, esbuild-bundled into a self-contained `dist/serverless.mjs` by `pnpm build`, and declared in the root `serverless.yml`:

```yml
provider:
  name: aws
  region: ${env:AWS_REGION, 'us-west-2'}
  stage: ${opt:stage, 'prod'}
  runtime: nodejs24.x
  endpointType: REGIONAL

mcp:
  servers:
    currency-converter:
      server: dist/serverless.mjs
      timeout: 30
      environment:
        FREE_CURRENCY_API_KEY: ${env:FREE_CURRENCY_API_KEY}
```

Because the entry is bundled, `node_modules` is excluded from the Lambda package (`package.patterns: ['!node_modules/**']`), keeping the upload at ~1 MB.

The endpoint is public (no authorizer) and served at:

```
https://<api-id>.execute-api.us-west-2.amazonaws.com/prod/currency-converter/mcp
```

### Prerequisites

- **Node.js >= 24** and **pnpm**
- A **serverless.com account** with an access key ([app.serverless.com](https://app.serverless.com) → Access Keys). Serverless Framework v4 requires this for every command.
- An **AWS account** with an IAM role that GitHub Actions can assume via OIDC to deploy CloudFormation stacks.
- **GitHub repository secrets** (Settings → Secrets and variables → Actions):
  - `AWS_DEPLOY_ROLE_ARN` — ARN of the OIDC IAM role
  - `SERVERLESS_ACCESS_KEY` — serverless.com access key
  - `FREE_CURRENCY_API_KEY` — freecurrencyapi.com API key

### One-time AWS setup (OIDC)

1. Create the GitHub OIDC provider (once per account):

   ```bash
   aws iam create-open-id-connect-provider \
     --url https://token.actions.githubusercontent.com \
     --client-id-list sts.amazonaws.com \
     --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
   ```

2. Create an IAM role (e.g. `github_cicd_admin`) with this trust policy:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
           },
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:<OWNER>/<REPO>:ref:refs/heads/*"
           }
         }
       }
     ]
   }
   ```

3. Attach a permissions policy allowing the role to deploy Serverless Framework stacks (CloudFormation, S3, Lambda, API Gateway, IAM, CloudWatch Logs, etc.) and set the role ARN as the `AWS_DEPLOY_ROLE_ARN` secret.

### Deploy from your machine

```bash
$ pnpm build
$ SERVERLESS_ACCESS_KEY=xxx FREE_CURRENCY_API_KEY=xxx npx serverless@4 deploy
```

The stack deploys to `us-west-2` by default (override with `AWS_REGION`). The endpoint is printed at the end of the deploy.

### Deploy from GitHub Actions (CI/CD)

Pushes to `master` that touch `serverless.yml`, `src/**`, or the dependency manifests trigger `.github/workflows/deploy-aws.yml`. The workflow:

1. Assumes the OIDC role (`AWS_DEPLOY_ROLE_ARN`) for AWS credentials
2. Installs dependencies, builds (`pnpm build`), and runs tests (`pnpm test`)
3. Deploys with `npx serverless@4 deploy` using `SERVERLESS_ACCESS_KEY` and `FREE_CURRENCY_API_KEY`

The workflow pins `AWS_REGION: us-west-2` so CI and local deploys target the same stack.

### Verify the deployment

```bash
$ curl -s -X POST "https://<api-id>.execute-api.us-west-2.amazonaws.com/prod/currency-converter/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### Remove the deployment

```bash
$ npx serverless@4 remove
```

This deletes the CloudFormation stack (Lambda, API Gateway, etc.). The Serverless Framework deployment S3 bucket is left behind and can be deleted manually.

## License

ISC License

---

## Resources

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop Integration](https://claude.ai/docs/mcp)
