export declare const DOMAINS: {
    readonly WEATHER: {
        readonly key: "weather";
        readonly displayName: "Weather & Environment";
    };
    readonly EVENTS: {
        readonly key: "events";
        readonly displayName: "Events";
    };
    readonly SPORTS: {
        readonly key: "sports";
        readonly displayName: "Sports";
    };
    readonly MARKETS: {
        readonly key: "markets";
        readonly displayName: "Markets & Commodities";
    };
    readonly TRENDS: {
        readonly key: "trends";
        readonly displayName: "Trends";
    };
    readonly PRODUCTS: {
        readonly key: "products";
        readonly displayName: "Products";
    };
    readonly FINANCE: {
        readonly key: "finance";
        readonly displayName: "Finance";
    };
    readonly KNOWLEDGE: {
        readonly key: "knowledge";
        readonly displayName: "Knowledge";
    };
    readonly MOVIES: {
        readonly key: "movies";
        readonly displayName: "Movies & TV";
    };
    readonly HEALTH: {
        readonly key: "health";
        readonly displayName: "Health";
    };
    readonly TRANSIT: {
        readonly key: "transit";
        readonly displayName: "Transit";
    };
    readonly UTILITIES: {
        readonly key: "utilities";
        readonly displayName: "Utilities";
    };
    readonly COMPUTE: {
        readonly key: "compute";
        readonly displayName: "Compute";
    };
    readonly MARITIME: {
        readonly key: "maritime";
        readonly displayName: "Maritime";
    };
    readonly ENERGY: {
        readonly key: "energy";
        readonly displayName: "Energy";
    };
    readonly COMMUNICATION: {
        readonly key: "communication";
        readonly displayName: "Communication";
    };
    readonly CREATIVE: {
        readonly key: "creative";
        readonly displayName: "Creative";
    };
    readonly GAMING: {
        readonly key: "gaming";
        readonly displayName: "Gaming";
    };
    readonly DISCORD: {
        readonly key: "discord";
        readonly displayName: "Discord";
    };
    readonly SMART_HOME: {
        readonly key: "smart_home";
        readonly displayName: "Smart Home";
    };
    readonly WEB: {
        readonly key: "web";
        readonly displayName: "Web";
    };
    readonly BROWSER: {
        readonly key: "browser";
        readonly displayName: "Browser";
    };
    readonly TASKS: {
        readonly key: "tasks";
        readonly displayName: "Task Management";
    };
    readonly MEMORY: {
        readonly key: "memory";
        readonly displayName: "Memory";
    };
    readonly AGENTS: {
        readonly key: "agents";
        readonly displayName: "Agent Management";
    };
    readonly TOOLS: {
        readonly key: "tools";
        readonly displayName: "Tool Management";
    };
    readonly META: {
        readonly key: "meta";
        readonly displayName: "Meta";
    };
    readonly CONVERSATION_TIMERS: {
        readonly key: "timers";
        readonly displayName: "Timers";
    };
    readonly REASONING: {
        readonly key: "reasoning";
        readonly displayName: "Reasoning";
    };
    readonly CORE_ORCHESTRATOR: {
        readonly key: "core_orchestrator";
        readonly displayName: "Core Orchestrator Tools";
    };
    readonly SKILLS: {
        readonly key: "skills";
        readonly displayName: "Skills";
    };
    readonly CONTROL: {
        readonly key: "control";
        readonly displayName: "Control Flow";
    };
    readonly STRUCTURED: {
        readonly key: "structured";
        readonly displayName: "Structured Output";
    };
    readonly TORRENT: {
        readonly key: "torrent";
        readonly displayName: "Torrent";
    };
    readonly MCP: {
        readonly key: "mcp";
        readonly displayName: "Model Context Protocol";
    };
    readonly CORE_HARNESS: {
        readonly key: "core_harness";
        readonly displayName: "Core Harness Tools";
    };
    readonly CORE_WORKSPACE: {
        readonly key: "core_workspace";
        readonly displayName: "Core Workspace Tools";
    };
    readonly CORE_SKILL: {
        readonly key: "core_skill";
        readonly displayName: "Core Skill Tools";
    };
    readonly CORE_SCHEDULE: {
        readonly key: "core_schedule";
        readonly displayName: "Core Schedule Tools";
    };
    readonly CORE_USER: {
        readonly key: "core_user";
        readonly displayName: "Core User Tools";
    };
    readonly CORE_DISCOVER: {
        readonly key: "core_discover";
        readonly displayName: "Core Discover Tools";
    };
    readonly CORE_TASK: {
        readonly key: "core_task";
        readonly displayName: "Core Task Tools";
    };
    readonly CORE_PLAN: {
        readonly key: "core_plan";
        readonly displayName: "Core Plan Tools";
    };
    readonly REDDIT: {
        readonly key: "reddit";
        readonly displayName: "Reddit";
    };
    readonly SECURITY: {
        readonly key: "security";
        readonly displayName: "Security";
    };
    readonly NETWORK_INTELLIGENCE: {
        readonly key: "network_intelligence";
        readonly displayName: "Network Intelligence";
    };
    readonly CALENDAR: {
        readonly key: "calendar";
        readonly displayName: "Calendar";
    };
    readonly INFRASTRUCTURE: {
        readonly key: "infrastructure";
        readonly displayName: "Infrastructure";
    };
};
export type DomainConstantKey = keyof typeof DOMAINS;
export type DomainEntry = (typeof DOMAINS)[DomainConstantKey];
export type DomainKey = DomainEntry["key"];
export type DomainDisplayName = DomainEntry["displayName"];
export declare const DOMAIN_TAGS: Record<DomainConstantKey, `domain:${DomainDisplayName}`>;
export declare const DOMAIN_KEY_TAGS: Record<DomainConstantKey, `domainKey:${DomainKey}`>;
export declare function isCoreDomain(domainDisplayName: string): boolean;
//# sourceMappingURL=domains.d.ts.map