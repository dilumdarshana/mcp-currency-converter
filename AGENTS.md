# AGENTS.md for @alcorme/mcp-currency-converter

## Quick start
```bash
pnpm install
cp .env_sample .env    # set FREE_CURRENCY_API_KEY
pnpm build             # tsc + chmod dist/index.js + esbuild bundle dist/serverless.mjs
pnpm test              # vitest v4
pnpm coverage          # vitest --coverage
pnpm mcp:stdio         # build + run stdio mode
pnpm mcp:http          # build + run http mode
pnpm build:dev         # tsx --watch (no rebuild needed)
pnpm inspector         # build + launch MCP Inspector (stdio)
pnpm inspector-http    # build + start http server on :3000 + launch MCP Inspector
```

## Architecture
- **Entry**: `src/index.ts` → `src/server.ts` → `src/utils/registrations.ts`; serverless: `src/serverless.ts` (default-export of `createMcpHandler`)
- **MCP SDK v2 `^2.0.0`**: Uses `@modelcontextprotocol/server` (`McpServer`, `createMcpHandler`) + `@modelcontextprotocol/node` (`toNodeHandler`) — NOT the deprecated `@modelcontextprotocol/sdk`
- **Factory-based**: `serveStdio(factory)` / `createMcpHandler(factory)` build a fresh `McpServer` per request (stateless — no initialize handshake, no `Mcp-Session-Id`). The factory lives in `src/factory.ts` (`createFactory(logger)`) and is shared by stdio, HTTP, and Lambda entries.
- **3 transports**: `TRANSPORT=stdio` (default when unset), `http`, and the Serverless Framework v4 Lambda entry (`src/serverless.ts`)
- **4 tools**: `convert-currency` (`z.object({ fromCurrency, toCurrency, amount, date? })`), `get-exchange-rate` (`{ fromCurrency, toCurrency, date? }`), `convert-batch` (`{ fromCurrency, amount, toCurrencies[], date? }`), `compare-rates` (`{ fromCurrency, toCurrency, dates[] }`)
- **1 resource**: `list-currencies`
- **1 prompt**: `currency-conversion-prompt`
- **API**: https://freecurrencyapi.com (requires key)
- **AWS deploy**: native `mcp:` property in root `serverless.yml` (`mcp.servers.currency-converter.server: dist/serverless.mjs`). Framework owns REST endpoint/streaming/packaging/Lambda entry. Config lives at repo root, NOT in `serverless/`. The Lambda entry is esbuild-bundled into one self-contained file and `node_modules` is excluded from the package. **Region is `us-west-2`** — `serverless.yml` defaults to it (`${env:AWS_REGION, 'us-west-2'}`) and `.github/workflows/deploy-aws.yml` pins `AWS_REGION: us-west-2` so CI and local deploys target the same stack. Endpoint: `https://<api-id>.execute-api.us-west-2.amazonaws.com/prod/currency-converter/mcp`.
- **CI/CD deploy**: `.github/workflows/deploy-aws.yml` runs on pushes to `master` touching `serverless.yml`, `src/**`, `package.json`, `pnpm-lock.yaml`, or the workflow itself. It assumes an OIDC IAM role (`AWS_DEPLOY_ROLE_ARN` secret), builds, tests, then `npx serverless@4 deploy` with `SERVERLESS_ACCESS_KEY` + `FREE_CURRENCY_API_KEY` secrets. Requires the GitHub OIDC provider (`token.actions.githubusercontent.com`, client `sts.amazonaws.com`) and a role trusting `repo:<owner>/<repo>:ref:refs/heads/*`.

## Critical gotchas
- **dotenv v17**: `dotenv.config()` writes to stdout, breaking MCP stdio JSON-RPC. **Always** use `dotenv.config({ quiet: true })` in `src/server.ts:11`.
- **LKR unsupported**: Sri Lankan Rupee returns `undefined` from the freecurrency API — optional chaining guard at `src/tools/convertCurrency.ts:84` handles this.
- **SDK union types**: `result.content[0]` needs `as { type: 'text'; text: string }` cast in tests for strict TS 6.0 discriminated unions.
- **vitest v4 ESM-only**: `vitest.config.ts` must exclude `dist/` to avoid CJS crash. vitest config in `package.json` not recognized.
- **TypeScript 6.0**: `tsconfig.json` must include `"types": ["node", "express", "cors"]` — these are no longer auto-included.
- **`"type": "module"` required**: v2 SDK packages are ESM-only. All relative imports (incl. tests) must use `.js` extensions; dayjs plugin imports need the explicit `.js` suffix (`dayjs/plugin/customParseFormat.js`).
- **No `express.json()` in httpTransport**: `toNodeHandler` parses the request body itself — adding `express.json()` first drains the stream and causes `Parse error: Invalid JSON`.
- **HTTP client must accept `application/json, text/event-stream`**: otherwise the v2 handler returns 406 `Not Acceptable`.
- **inspector script**: uses `mcp-inspector node dist/index.js` (v2 CLI), not `npx @modelcontextprotocol/inspector`.
- **pnpm-workspace.yaml**: `allowBuilds` must keep `@modelcontextprotocol/inspector: true` (its postinstall builds the CLI).
- **stdio is the default transport**: `TRANSPORT` unset → stdio. Do **not** set `TRANSPORT` in `.env` — dotenv would override the default and force HTTP.
- **MCP Inspector filters env**: its `StdioClientTransport` spawns the server with only `HOME/LOGNAME/PATH/SHELL/TERM/USER` + env configured in the UI. Any required env (e.g. `FREE_CURRENCY_API_KEY`) must be added in the Inspector's server config "Environment" panel; shell env vars like `TRANSPORT=stdio` are NOT inherited.
- **Serverless MCP entry contract**: `dist/serverless.mjs` (from `src/serverless.ts`, esbuild-bundled by the `build` script) must default-export the object `createMcpHandler()` returns — a web-standard `fetch` handler. Anything else fails at cold start naming the `server:` property.
- **Serverless packaging**: the entry is bundled into one self-contained `dist/serverless.mjs`, so `node_modules/**` is excluded via `package.patterns` — the Lambda package is ~1 MB. Without the bundle, pnpm's `node_modules/.pnpm` store (dev + prod) ships whole and the upload balloons to ~370 MB. Run `pnpm build` (which runs esbuild) before `serverless deploy`.
- **Lambda package excludes `.env`** via `package.patterns` so the API key never ships in the artifact.
- **esbuild ESM bundle + dotenv**: dotenv v17 is CJS and does `require("fs")`, which throws `Dynamic require of "fs" is not supported` in pure ESM. The `build` script's esbuild command must include `--banner:js="import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);"` to shim `require`. Without it the Lambda cold start fails with `Runtime.Unknown`.
- **Logger in Lambda**: `src/utils/logger.ts` writes to `~/.mcp/logs`; in Lambda `$HOME` doesn't exist and `mkdirSync` throws `ENOENT`. The constructor catches this and falls back to `process.stdout`/`process.stderr` (→ CloudWatch). Don't remove the try/catch.
- **Logger stream types**: `logStream`/`errorStream` are typed `Writable` (from `node:stream`) because they can be either `fs.WriteStream` or `process.stdout` — TS 6.0 rejects the comparison otherwise.
- **Deploy region drift**: if the workflow's `AWS_REGION` differs from the `serverless.yml` default, CI creates a **second stack in another region** instead of updating the existing one. Keep both pinned to `us-west-2`.
- **Rate caching**: `src/utils/currencyApi.ts` caches exchange rates in a module-level `Map` for 5 minutes (key = base:currencies:date). Tests must call `clearCache()` in `beforeEach` or a cached response leaks across tests. `parseDate` (DD-MM-YYYY etc.) lives in `src/utils/date.ts`; locale formatting (`formatAmount`/`formatRate`) in `src/utils/format.ts`.

## Tests
```bash
pnpm test                   # run all tests
pnpm test -- -t "convert"   # single test pattern
pnpm coverage               # with coverage
```
- All tests mock `global.fetch` — no real API calls.
- Logger is always mocked as `{ info: vi.fn(), error: vi.fn(), ... }`.

## Release
- **semantic-release v25** runs on push to `master` / `next` via `.github/workflows/publish.yml` (auto-triggered on `src/**`, `package.json`, `pnpm-lock.yaml`, `.releaserc.json`, or the workflow itself)
- **Breaking changes**: Use `BREAKING CHANGE:` footer or `!` after type (e.g., `chore!:`)
- **CI order**: `pnpm install` → `pnpm build` → `pnpm test` → `semantic-release`
- Tags published to npm via `NPM_TOKEN` secret, GitHub release via `GITHUB_TOKEN`
- PRs merge to `master` for stable releases, `next` for prereleases
- `package.json` `version` field is ignored — semantic-release derives version from git tags
