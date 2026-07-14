// tsc's rewriteRelativeImportExtensions rewrites .ts → .js in JS emit but
// not in declaration files, leaving dist/*.d.ts with "./x.ts" specifiers
// that some consumer tsconfigs fail to resolve (the root entry then types
// as any under skipLibCheck). Rewrite them here after every build.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith(".d.ts")) {
      const source = readFileSync(path, "utf8");
      const rewritten = source.replace(/(from\s+"\.[^"]*)\.ts"/g, '$1.js"');
      if (rewritten !== source) writeFileSync(path, rewritten);
    }
  }
}

walk(new URL("../dist", import.meta.url).pathname);
