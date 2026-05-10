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
  ".":         "./src/index.js",
  "./node":    "./src/node.js",
  "./vault":   "./src/vault.js",
  "./effects": "./src/effects.js",
  "./rate":    "./src/rate.js",
  "./color":   "./src/color.js"
}
```

## Modules

### Isomorphic (`@rodrigo-barraza/utilities-library`)

| Module | Exports |
|--------|---------|
| **format** | `formatCompact`, `formatNumber`, `formatTokenCount`, `formatCost`, `formatCostAdaptive`, `formatCostTag`, `formatCurrency`, `formatLatency`, `formatLatencyMs`, `formatDuration`, `formatElapsedTime`, `formatFileSize`, `formatBytes`, `formatTokensPerSec`, `formatContextTokens`, `formatPercent`, `roundMs` |
| **text** | `stripHtml`, `normalizeName`, `renderToolName`, `humanizeToolName`, `truncate`, `escapeRegex`, `getRootDomain`, `getSubdomain`, `capitalize`, `slugify`, `toKebabCase`, `toCamelCase`, `toPascalCase`, `toSnakeCase`, `pluralize`, `wordCount` |
| **date** | `toISODate`, `timeAgo`, `daysSinceIso`, `formatDateTime`, `daysAgo`, `toLocalDateString` |
| **async** | `sleep`, `retry`, `withTimeout`, `withTimeoutFallback`, `fetchWithTimeout`, `pMap`, `defer` |
| **time** | `MS_PER_SECOND`, `MS_PER_MINUTE`, `MS_PER_HOUR`, `MS_PER_DAY`, `SECONDS_PER_DAY`, `MS_PER_WEEK`, `seconds`, `minutes`, `hours`, `days`, `weeks`, `POLL_FAST`, `POLL_STANDARD`, `POLL_MODERATE`, `POLL_SLOW`, `POLL_LAZY` |
| **arrays** | `chunk`, `shuffleArray`, `pickRandom`, `compactPayload`, `groupBy`, `uniqueBy`, `partition`, `intersection`, `difference`, `sortBy`, `flatten` |
| **objects** | `deepMerge`, `pick`, `omit`, `mapValues`, `mapKeys`, `invert`, `isEmpty`, `deepEqual` |
| **math** | `clamp`, `roundCents`, `randomInt`, `cosineSimilarity`, `lerp`, `remap`, `sum`, `average`, `median`, `roundTo` |
| **validation** | `parseIntParam`, `parsePrice`, `validateMaxLength`, `parseJsonSafe`, `parseJsonFromLlmResponse`, `isEmail`, `isUrl`, `isNumeric` |
| **crypto** | `generateUUID` |
| **phone** | `formatPhone` |

### Browser-only (`@rodrigo-barraza/utilities-library/effects`)

| Export | Description |
|--------|-------------|
| `applyStatic` | Analog TV static noise overlay via SVG feTurbulence |
| `applyChromaticAberration` | RGB channel separation with animated or static text-shadow |
| `applyScanlines` | CRT scanline overlay with optional rolling animation |
| `applyGlitch` | Hue-cycling + jitter distortion (consolidated from prism-client) |
| `applyVhsTracking` | VHS tracking — sporadic horizontal skew + offset |
| `applyHueRotate` | Continuous 360° hue rotation (rainbow cycle) |
| `applyShimmer` | Loading shimmer highlight sweep |
| `applyDissolve` | Pixel dissolve / disintegration |
| `applyVignette` | CRT-style darkened edge vignette |
| `applyFlicker` | Fluorescent light flicker |
| `applyCRT` | Composite CRT effect (scanlines + vignette + static) |
| `composeEffects` | Chain multiple effects, returns single cleanup |

```js
import { applyStatic, applyChromaticAberration, applyCRT, composeEffects } from "@rodrigo-barraza/utilities-library/effects";

// Single effect
const cleanup = applyStatic(myElement, { intensity: 0.15 });

// Composite CRT monitor
const cleanupCRT = applyCRT(myPanel, { scanIntensity: 0.06, noiseIntensity: 0.1 });

// Compose ad-hoc
const cleanupAll = composeEffects(el, [
  (el) => applyChromaticAberration(el, { offset: 3 }),
  (el) => applyStatic(el, { intensity: 0.08 }),
]);

// Teardown
cleanup();
cleanupCRT();
cleanupAll();
```

### Rate limiting (`@rodrigo-barraza/utilities-library/rate`)

| Export | Description |
|--------|-------------|
| `debounce` | Classic debounce with `.cancel()` / `.flush()` + optional leading edge |
| `throttle` | Leading-edge throttle with trailing replay and `.cancel()` |

```js
import { debounce, throttle } from "@rodrigo-barraza/utilities-library/rate";

const search = debounce((query) => fetchResults(query), 300);
const resize = throttle(() => recalcLayout(), 100);
```

### Color manipulation (`@rodrigo-barraza/utilities-library/color`)

| Export | Description |
|--------|-------------|
| `parseHex` | Parse #RGB / #RRGGBB / #RRGGBBAA into `{ r, g, b, a }` |
| `toHex` | Convert `{ r, g, b }` back to hex string |
| `lerpColor` | Linear interpolation between two hex colors |
| `rgbToHsl` / `hslToRgb` | Color space conversion |
| `adjustBrightness` | Lighten or darken a hex color by percentage |

```js
import { lerpColor, adjustBrightness } from "@rodrigo-barraza/utilities-library/color";

lerpColor("#ff0000", "#0000ff", 0.5); // midpoint purple
adjustBrightness("#3366cc", 20);       // lighten by 20%
adjustBrightness("#3366cc", -15);      // darken by 15%
```

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
| `vault.fetchRegistry()` | Fetch the full infrastructure registry (projects + infrastructure with resolved URLs) |
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
