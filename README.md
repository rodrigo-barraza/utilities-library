# @rodrigo-barraza/utilities

Shared JavaScript utility functions used across sun workspace projects. Zero runtime dependencies, isomorphic design.

## Install

```bash
# In any sun workspace project:
npm install --save @rodrigo-barraza/utilities

# Or via file: protocol (local development):
# "dependencies": { "@rodrigo-barraza/utilities": "file:../utilities-library" }
```

## Usage

### Browser-safe imports (works everywhere)

```js
import { sleep, formatCompact, stripHtml, timeAgo, chunk } from "@rodrigo-barraza/utilities";

await sleep(1000);
formatCompact(3500);       // "3.5K"
stripHtml("<b>Hello</b>"); // "Hello"
timeAgo("2026-04-28");     // "1d ago"
chunk([1,2,3,4,5], 2);     // [[1,2], [3,4], [5]]
```

### Node.js-only imports (backend services)

```js
import { logger, asyncHandler, HealthTracker, createVaultClient } from "@rodrigo-barraza/utilities/node";

logger.info("Server starting...");

const vault = createVaultClient({ localEnvFile: "./.env" });
const secrets = await vault.fetch();

router.get("/api/data", asyncHandler(async (req) => {
  return { data: await fetchData() };
}, "Data fetch"));
```

## Modules

### Isomorphic (`@rodrigo-barraza/utilities`)

| Module | Exports |
|--------|---------|
| **format** | `formatCompact`, `formatNumber`, `formatTokenCount`, `formatCost`, `formatCostAdaptive`, `formatCostTag`, `formatLatency`, `formatLatencyMs`, `formatDuration`, `formatElapsedTime`, `formatFileSize`, `formatTokensPerSec`, `formatContextTokens`, `roundMs` |
| **text** | `stripHtml`, `normalizeName`, `renderToolName`, `humanizeToolName` |
| **date** | `toISODate`, `timeAgo`, `daysSinceIso` |
| **async** | `sleep` |
| **arrays** | `chunk`, `shuffleArray`, `pickRandom`, `compactPayload` |
| **validation** | `parseIntParam`, `parsePrice`, `validateMaxLength` |
| **crypto** | `generateUUID` |

### Node-only (`@rodrigo-barraza/utilities/node`)

| Module | Exports |
|--------|---------|
| **logger** | `logger` (default), `COLORS` |
| **express** | `asyncHandler`, `HealthTracker`, `setupStreamingSSE`, `TokenManager`, `lazyImport` |
| **vault** | `createVaultClient` |
