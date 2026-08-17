# [3.2.0-next.1](https://github.com/dilumdarshana/mcp-currency-converter/compare/v3.1.0...v3.2.0-next.1) (2026-08-17)


### Features

* add get-exchange-rate, convert-batch, compare-rates tools ([#11](https://github.com/dilumdarshana/mcp-currency-converter/issues/11)) ([2034c4f](https://github.com/dilumdarshana/mcp-currency-converter/commit/2034c4fff28eb6371291462682489b9adaf71c96))

# [3.1.0](https://github.com/dilumdarshana/mcp-currency-converter/compare/v3.0.0...v3.1.0) (2026-08-12)


### Bug Fixes

* **logger:** fall back to console output when home dir is not writable ([73f9b2b](https://github.com/dilumdarshana/mcp-currency-converter/commit/73f9b2b5ca874f90f159e9390265acd2eb2611e0))
* **serverless:** shim require in esbuild ESM bundle for dotenv ([6435600](https://github.com/dilumdarshana/mcp-currency-converter/commit/64356000205104392a08eb5e5367bb52b2485b30))
* shrink AWS Lambda package by esbuild-bundling the serverless entry ([fc91fe2](https://github.com/dilumdarshana/mcp-currency-converter/commit/fc91fe26fd8e798f9906f9423f195359fd69000a))


### Features

* deploy MCP server to AWS Lambda via Serverless Framework v4 native mcp: property ([962ab41](https://github.com/dilumdarshana/mcp-currency-converter/commit/962ab4178b3e451c512f62ee8469c11f9f10b15a))

# [3.0.0](https://github.com/dilumdarshana/mcp-currency-converter/compare/v2.0.0...v3.0.0) (2026-08-12)


* feat!: migrate to MCP SDK v2 (stateless protocol, ESM-only) ([e2ee92c](https://github.com/dilumdarshana/mcp-currency-converter/commit/e2ee92c65825694b616fa9259502835e90a76248))


### BREAKING CHANGES

* replace @modelcontextprotocol/sdk v1 with @modelcontextprotocol/server and @modelcontextprotocol/node v2. New stateless 2026-07-28 protocol: no initialize handshake, no Mcp-Session-Id, SSE transport removed. ESM-only (type: module). stdio is now the default transport.

# [3.0.0-next.1](https://github.com/dilumdarshana/mcp-currency-converter/compare/v2.0.0...v3.0.0-next.1) (2026-08-12)


* feat!: migrate to MCP SDK v2 (stateless protocol, ESM-only) ([e2ee92c](https://github.com/dilumdarshana/mcp-currency-converter/commit/e2ee92c65825694b616fa9259502835e90a76248))


### BREAKING CHANGES

* replace @modelcontextprotocol/sdk v1 with @modelcontextprotocol/server and @modelcontextprotocol/node v2. New stateless 2026-07-28 protocol: no initialize handshake, no Mcp-Session-Id, SSE transport removed. ESM-only (type: module). stdio is now the default transport.

# [2.0.0](https://github.com/dilumdarshana/mcp-currency-converter/compare/v1.1.0...v2.0.0) (2026-06-17)


* chore!: specify node >=24 engine requirement ([4c225f8](https://github.com/dilumdarshana/mcp-currency-converter/commit/4c225f8714eb6b352760fc0de788965067440730))


### BREAKING CHANGES

* require Node.js >=24, update to zod 4, TypeScript 6, and migrate MCP SDK API

# [1.1.0](https://github.com/dilumdarshana/mcp-currency-converter/compare/v1.0.3...v1.1.0) (2025-08-14)


### Features

* Add historical exchange rates support to the Tool ([8634879](https://github.com/dilumdarshana/mcp-currency-converter/commit/8634879e66ebeb0b57dec3fe0fccc3b78f2c3bc6))
* Add historical exchange rates support to the Tool ([bb9117b](https://github.com/dilumdarshana/mcp-currency-converter/commit/bb9117b1888a0a78654c40846d8cee1171fd256f))

# [1.1.0-next.1](https://github.com/dilumdarshana/mcp-currency-converter/compare/v1.0.3...v1.1.0-next.1) (2025-08-14)


### Features

* Add historical exchange rates support to the Tool ([8634879](https://github.com/dilumdarshana/mcp-currency-converter/commit/8634879e66ebeb0b57dec3fe0fccc3b78f2c3bc6))
* Add historical exchange rates support to the Tool ([bb9117b](https://github.com/dilumdarshana/mcp-currency-converter/commit/bb9117b1888a0a78654c40846d8cee1171fd256f))

## [1.0.3](https://github.com/dilumdarshana/mcp-currency-converter/compare/v1.0.2...v1.0.3) (2025-07-23)


### Bug Fixes

* Round conversion to two decimal places ([f224713](https://github.com/dilumdarshana/mcp-currency-converter/commit/f224713efc92c87f812ce2e862d386aeb327622a))

## [1.0.2](https://github.com/dilumdarshana/mcp-currency-converter/compare/v1.0.1...v1.0.2) (2025-07-23)


### Bug Fixes

* Adding unit tests ([048e0e8](https://github.com/dilumdarshana/mcp-currency-converter/commit/048e0e85a49915481ccb46d3baaab58b1a7229d6))
* Adding unit tests ([1dc8cdf](https://github.com/dilumdarshana/mcp-currency-converter/commit/1dc8cdfadc373dd5e3a33cb14a48fd974929dd57))

## [1.0.2-next.1](https://github.com/dilumdarshana/mcp-currency-converter/compare/v1.0.1...v1.0.2-next.1) (2025-07-23)


### Bug Fixes

* Adding unit tests ([1dc8cdf](https://github.com/dilumdarshana/mcp-currency-converter/commit/1dc8cdfadc373dd5e3a33cb14a48fd974929dd57))

## [1.0.1](https://github.com/dilumdarshana/mcp-currency-converter/compare/v1.0.0...v1.0.1) (2025-07-23)


### Bug Fixes

* CI/CD in action ([adbfe8c](https://github.com/dilumdarshana/mcp-currency-converter/commit/adbfe8c6ae865a503403a065958deb14f9e222bf))

# 1.0.0 (2025-07-23)


### Bug Fixes

* CI/CD with Semantic Release ([c949fdc](https://github.com/dilumdarshana/mcp-currency-converter/commit/c949fdc7a028e30275c24e479c41b5edba88542a))
* typescript dependency added ([c6cda12](https://github.com/dilumdarshana/mcp-currency-converter/commit/c6cda1200b85628a351ead8769b6f7c8a5ac46b8))


### Features

* Adding http stream endpoint ([d3a622c](https://github.com/dilumdarshana/mcp-currency-converter/commit/d3a622c237b6f090f5b9fccc804b88e808ef7681))
* Adding meaning comments in the codes ([8661b75](https://github.com/dilumdarshana/mcp-currency-converter/commit/8661b75271797a781b26dbf02ade11551fc8294a))
* Adding resources init ([af6a50a](https://github.com/dilumdarshana/mcp-currency-converter/commit/af6a50a2182ac26e8aa8e6582c044d6bb1cafa0d))
* Env sample ([ac5482b](https://github.com/dilumdarshana/mcp-currency-converter/commit/ac5482bb5568f406f1b8f001f3d53d321ed3deb9))
* First tool ([b2ea16d](https://github.com/dilumdarshana/mcp-currency-converter/commit/b2ea16d334efed0520bc7dc04a632b9482f75705))
* Initial structure ([d5fe4c4](https://github.com/dilumdarshana/mcp-currency-converter/commit/d5fe4c4c16acd4cbc105c1155da08c0b23975abd))
* logger feature ([d8b67e1](https://github.com/dilumdarshana/mcp-currency-converter/commit/d8b67e1976285e19b319f2834b749e509f5a84ac))
* Prompt capability added ([09d1a74](https://github.com/dilumdarshana/mcp-currency-converter/commit/09d1a74c695ffd60028c1dd2c4b2604275b09082))
* SSE transport legacy added ([ea19d68](https://github.com/dilumdarshana/mcp-currency-converter/commit/ea19d689443c06d9b5a32a60fb1a27a503621e65))
