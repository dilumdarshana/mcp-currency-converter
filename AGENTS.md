# AGENTS.md for @alcorme/mcp-currency-converter

## Quick start
```bash
pnpm install
cp .env_sample .env    # set FREE_CURRENCY_API_KEY
pnpm build             # tsc + chmod dist/index.js
pnpm test              # vitest v4
pnpm coverage          # vitest --coverage
pnpm mcp:stdio         # build + run stdio mode
pnpm mcp:http          # build + run http mode
pnpm build:dev         # tsx --watch (no rebuild needed)
pnpm inspector         # build + launch MCP Inspector
```

## Architecture
- **Entry**: `src/index.ts` → `src/server.ts` → `src/utils/registrations.ts`
- **MCP SDK `^1.29.0`**: Uses `registerTool()` / `registerResource()` / `registerPrompt()` (NOT the deprecated `tool()` / `resource()` / `prompt()`)
- **3 transports**: `TRANSPORT=stdio` (default), `http`, `sse`
- **1 tool**: `convert-currency` — `z.object({ fromCurrency, toCurrency, amount, date? })`
- **1 resource**: `list-currencies`
- **1 prompt**: `currency-conversion-prompt`
- **API**: https://freecurrencyapi.com (requires key)

## Critical gotchas
- **dotenv v17**: `dotenv.config()` writes to stdout, breaking MCP stdio JSON-RPC. **Always** use `dotenv.config({ quiet: true })` in `src/server.ts:11`.
- **LKR unsupported**: Sri Lankan Rupee returns `undefined` from the freecurrency API — optional chaining guard at `src/tools/convertCurrency.ts:84` handles this.
- **SDK union types**: `result.content[0]` needs `as { type: 'text'; text: string }` cast in tests for strict TS 6.0 discriminated unions.
- **vitest v4 ESM-only**: `vitest.config.ts` must exclude `dist/` to avoid CJS crash. vitest config in `package.json` not recognized.
- **TypeScript 6.0**: `tsconfig.json` must include `"types": ["node", "express", "cors"]` — these are no longer auto-included.

## Tests
```bash
pnpm test                   # run all tests
pnpm test -- -t "convert"   # single test pattern
pnpm coverage               # with coverage
```
- All tests mock `global.fetch` — no real API calls.
- Logger is always mocked as `{ info: vi.fn(), error: vi.fn(), ... }`.

## Release
- **semantic-release v25** runs on push to `master` / `next` via `.github/workflows/publish.yml`
- **Breaking changes**: Use `BREAKING CHANGE:` footer or `!` after type (e.g., `chore!:`)
- **CI order**: `pnpm install` → `pnpm build` → `pnpm test` → `semantic-release`
- Tags published to npm via `NPM_TOKEN` secret, GitHub release via `GITHUB_TOKEN`
- PRs merge to `master` for stable releases, `next` for prereleases
- `package.json` `version` field is ignored — semantic-release derives version from git tags
