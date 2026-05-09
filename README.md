# @rodrigo-barraza/utilities-library

Shared JavaScript utility functions used across Sun ecosystem projects. Zero runtime dependencies, isomorphic design — browser-safe by default with a dedicated Node.js entry point for server-only utilities.

## Installation

```bash
npm install @rodrigo-barraza/utilities-library
```

## Directory Structure

```
utilities-library/
├── src/
├── tests/
```

## Usage

### Browser-safe imports (works everywhere)

```js
import { sleep, formatCompact, stripHtml, timeAgo, chunk } from "@rodrigo-barraza/utilities-library";

await sleep(1000);
formatCompact(3500);       // "3.5K"
stripHtml("<b>Hello</b>"); // "Hello"
timeAgo("2026-04-28");     // "1d ago"
chunk([1,2,3,4,5], 2);     // [[1,2], [3,4], [5]]
```

### Node.js-only imports (backend services)

```js
import { logger, createLogger, asyncHandler, HealthTracker, createVaultClient } from "@rodrigo-barraza/utilities-library/node";

logger.info("Server starting...");  // [2026-04-29T18:37:24.123Z] INFO  Server starting...

// Or create a scoped logger for your service:
const log = createLogger("my-service");
log.info("Ready");  // [2026-04-29T18:37:24.123Z] INFO  [my-service] Ready

const vault = createVaultClient({ localEnvFile: "./.env" });
const secrets = await vault.fetch();

router.get("/api/data", asyncHandler(async (req) => {
  return { data: await fetchData() };
}, "Data fetch"));
```

### Vault client (dedicated entry point)

```js
import { createVaultClient } from "@rodrigo-barraza/utilities-library/vault";

const vault = createVaultClient({
  localEnvFile: "./.env",
  fallbackEnvFile: "../vault-service/.env",
});

const secrets = await vault.fetch();
const registry = await vault.fetchRegistry();
const toolsUrl = await vault.resolveServiceUrl("tools-service");
const mongoUrl = await vault.resolveInfraUrl("mongodb");
```

## Export Map

```json
{
  ".":       "./src/index.js",
  "./node":  "./src/node.js",
  "./vault": "./src/vault.js"
}
```

## Modules

### Isomorphic (`@rodrigo-barraza/utilities-library`)

| Module | Exports |
|--------|---------|
| **format** | `formatCompact`, `formatNumber`, `formatTokenCount`, `formatCost`, `formatCostAdaptive`, `formatCostTag`, `formatCurrency`, `formatLatency`, `formatLatencyMs`, `formatDuration`, `formatElapsedTime`, `formatFileSize`, `formatTokensPerSec`, `formatContextTokens`, `formatPercent`, `roundMs` |
| **text** | `stripHtml`, `normalizeName`, `renderToolName`, `humanizeToolName`, `truncate`, `escapeRegex`, `getRootDomain`, `getSubdomain`, `capitalize` |
| **date** | `toISODate`, `timeAgo`, `daysSinceIso`, `formatDateTime` |
| **async** | `sleep`, `retry`, `withTimeout`, `fetchWithTimeout` |
| **time** | `MS_PER_SECOND`, `MS_PER_MINUTE`, `MS_PER_HOUR`, `MS_PER_DAY`, `MS_PER_WEEK`, `seconds`, `minutes`, `hours`, `days`, `weeks` |
| **arrays** | `chunk`, `shuffleArray`, `pickRandom`, `compactPayload`, `groupBy`, `uniqueBy` |
| **objects** | `deepMerge`, `pick`, `omit` |
| **math** | `clamp`, `roundCents`, `randomInt`, `cosineSimilarity` |
| **validation** | `parseIntParam`, `parsePrice`, `validateMaxLength`, `parseJsonSafe`, `parseJsonFromLlmResponse` |
| **crypto** | `generateUUID` |
| **phone** | `formatPhone` |

### Node-only (`@rodrigo-barraza/utilities-library/node`)

| Module | Exports |
|--------|---------|
| **logger** | `logger` (default instance), `createLogger` (scoped) |
| **express** | `asyncHandler`, `HealthTracker`, `setupStreamingSSE`, `TokenManager`, `lazyImport`, `httpError` |

### Vault (`@rodrigo-barraza/utilities-library/vault`)

| Export | Description |
|--------|-------------|
| `createVaultClient` | Secret + registry bootstrap client with 4-layer resolution: `process.env` → local `.env` → Vault service → fallback `.env` |

#### Vault Client Methods

| Method | Description |
|--------|-------------|
| `vault.fetch()` | Fetch and merge secrets from all sources |
| `vault.fetchRegistry()` | Fetch the full infrastructure registry (services + infrastructure with resolved URLs) |
| `vault.resolveServiceUrl(id)` | Resolve a single service URL by its ID through the precedence chain |
| `vault.resolveInfraUrl(id)` | Resolve a single infrastructure URL by its ID |
| `vault.clearRegistryCache()` | Invalidate the cached registry |

## Testing

```bash
npm test           # Run all tests (Vitest)
npm run test:watch # Watch mode
```

## License

MIT
