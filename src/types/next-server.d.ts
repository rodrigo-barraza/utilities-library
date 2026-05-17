// ─────────────────────────────────────────────────────────────
// Ambient module declaration for next/server
// Next.js 16+ changed its exports map and no longer exposes
// ./server under moduleResolution: NodeNext. This shim provides
// the minimal types needed by our nextjs.ts proxy utilities.
// ─────────────────────────────────────────────────────────────

declare module "next/server" {
  export class NextResponse extends Response {
    static json(body: unknown, init?: ResponseInit): NextResponse;
    static next(init?: { headers?: HeadersInit }): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static rewrite(destination: string | URL, init?: { headers?: HeadersInit }): NextResponse;
  }

  export class NextRequest extends Request {
    readonly nextUrl: URL;
    readonly cookies: {
      get(name: string): { name: string; value: string } | undefined;
      getAll(): Array<{ name: string; value: string }>;
      set(name: string, value: string): void;
      delete(name: string): void;
      has(name: string): boolean;
    };
    readonly geo?: {
      city?: string;
      country?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };
    readonly ip?: string;
  }
}
