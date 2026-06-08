export declare const LABELS: {
    readonly CODING: "coding";
    readonly DATA: "data";
    readonly WEB: "web";
    readonly HEALTH: "health";
    readonly FINANCE: "finance";
    readonly LOCATION: "location";
    readonly REFERENCE: "reference";
    readonly MEDIA: "media";
    readonly SHOPPING: "shopping";
    readonly SPORTS: "sports";
    readonly MARITIME: "maritime";
    readonly ENERGY: "energy";
    readonly COMMUNICATION: "communication";
    readonly CREATIVE: "creative";
    readonly SMART_HOME: "smart_home";
    readonly LIFX: "lifx";
    readonly DISCORD: "discord";
    readonly GIT: "git";
    readonly META: "meta";
    readonly AUTOMATION: "automation";
    readonly DATA_SCIENCE: "data_science";
    readonly ORCHESTRATION: "orchestration";
    readonly DOWNLOAD: "download";
};
export type LabelKey = keyof typeof LABELS;
export type LabelValue = (typeof LABELS)[LabelKey];
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
    readonly FILES: {
        readonly key: "workspace";
        readonly displayName: "Workspace";
    };
    readonly SEARCH: {
        readonly key: "workspace";
        readonly displayName: "Workspace";
    };
    readonly WEB: {
        readonly key: "web";
        readonly displayName: "Web";
    };
    readonly COMMAND: {
        readonly key: "workspace";
        readonly displayName: "Workspace";
    };
    readonly GIT: {
        readonly key: "workspace";
        readonly displayName: "Workspace";
    };
    readonly BROWSER: {
        readonly key: "browser";
        readonly displayName: "Browser";
    };
    readonly CODE_INTEL: {
        readonly key: "workspace";
        readonly displayName: "Workspace";
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
    readonly WORKSPACE: {
        readonly key: "workspace";
        readonly displayName: "Workspace";
    };
    readonly TOOLS: {
        readonly key: "tools";
        readonly displayName: "Tool Management";
    };
    readonly META: {
        readonly key: "meta";
        readonly displayName: "Meta";
    };
    readonly CRON_JOBS: {
        readonly key: "cron_jobs";
        readonly displayName: "Cron Jobs";
    };
    readonly CONVERSATION_TIMERS: {
        readonly key: "timers";
        readonly displayName: "Timers";
    };
    readonly REASONING: {
        readonly key: "reasoning";
        readonly displayName: "Reasoning";
    };
    readonly ORCHESTRATOR: {
        readonly key: "orchestrator";
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
    readonly GIT_ISOLATION: {
        readonly key: "workspace";
        readonly displayName: "Workspace";
    };
    readonly TASK_MGMT: {
        readonly key: "tasks";
        readonly displayName: "Task Management";
    };
    readonly TORRENT: {
        readonly key: "torrent";
        readonly displayName: "Torrent";
    };
    readonly MCP: {
        readonly key: "mcp";
        readonly displayName: "Model Context Protocol";
    };
    readonly CORE: {
        readonly key: "core";
        readonly displayName: "Core Tools";
    };
    readonly CORE_HARNESS: {
        readonly key: "core_harness";
        readonly displayName: "Core Harness Tools";
    };
    readonly REDDIT: {
        readonly key: "reddit";
        readonly displayName: "Reddit";
    };
};
export type DomainConstantKey = keyof typeof DOMAINS;
export type DomainEntry = (typeof DOMAINS)[DomainConstantKey];
export type DomainKey = DomainEntry["key"];
export type DomainDisplayName = DomainEntry["displayName"];
export declare const LABEL_TAGS: Record<LabelKey, `label:${LabelValue}`>;
export declare const DOMAIN_TAGS: Record<DomainConstantKey, `domain:${DomainDisplayName}`>;
export declare const DOMAIN_KEY_TAGS: Record<DomainConstantKey, `domainKey:${DomainKey}`>;
//# sourceMappingURL=domains.d.ts.map