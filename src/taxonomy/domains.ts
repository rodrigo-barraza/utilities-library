export const DOMAINS = {
  WEATHER: { key: "weather", displayName: "Weather & Environment" },
  EVENTS: { key: "events", displayName: "Events" },
  SPORTS: { key: "sports", displayName: "Sports" },
  MARKETS: { key: "markets", displayName: "Markets & Commodities" },
  TRENDS: { key: "trends", displayName: "Trends" },
  PRODUCTS: { key: "products", displayName: "Products" },
  FINANCE: { key: "finance", displayName: "Finance" },
  KNOWLEDGE: { key: "knowledge", displayName: "Knowledge" },
  MOVIES: { key: "movies", displayName: "Movies & TV" },
  HEALTH: { key: "health", displayName: "Health" },
  TRANSIT: { key: "transit", displayName: "Transit" },
  UTILITIES: { key: "utilities", displayName: "Utilities" },
  COMPUTE: { key: "compute", displayName: "Compute" },
  MARITIME: { key: "maritime", displayName: "Maritime" },
  ENERGY: { key: "energy", displayName: "Energy" },
  COMMUNICATION: { key: "communication", displayName: "Communication" },
  CREATIVE: { key: "creative", displayName: "Creative" },
  GAMING: { key: "gaming", displayName: "Gaming" },
  DISCORD: { key: "discord", displayName: "Discord" },
  SMART_HOME: { key: "smart_home", displayName: "Smart Home" },
  FILES: { key: "core_workspace", displayName: "Core Workspace Tools" },
  SEARCH: { key: "core_workspace", displayName: "Core Workspace Tools" },
  WEB: { key: "web", displayName: "Web" },
  COMMAND: { key: "core_workspace", displayName: "Core Workspace Tools" },
  GIT: { key: "core_workspace", displayName: "Core Workspace Tools" },
  BROWSER: { key: "browser", displayName: "Browser" },
  CODE_INTEL: { key: "core_workspace", displayName: "Core Workspace Tools" },
  TASKS: { key: "tasks", displayName: "Task Management" },
  MEMORY: { key: "memory", displayName: "Memory" },
  AGENTS: { key: "agents", displayName: "Agent Management" },
  WORKSPACE: { key: "core_workspace", displayName: "Core Workspace Tools" },
  TOOLS: { key: "tools", displayName: "Tool Management" },
  META: { key: "meta", displayName: "Meta" },
  CRON_JOBS: { key: "cron_jobs", displayName: "Cron Jobs" },
  CONVERSATION_TIMERS: { key: "timers", displayName: "Timers" },
  REASONING: { key: "reasoning", displayName: "Reasoning" },
  ORCHESTRATOR: { key: "orchestrator", displayName: "Core Orchestrator Tools" },
  SKILLS: { key: "skills", displayName: "Skills" },
  CONTROL: { key: "control", displayName: "Control Flow" },
  STRUCTURED: { key: "structured", displayName: "Structured Output" },
  GIT_ISOLATION: { key: "core_workspace", displayName: "Core Workspace Tools" },
  TASK_MGMT: { key: "tasks", displayName: "Task Management" },
  TORRENT: { key: "torrent", displayName: "Torrent" },
  MCP: { key: "mcp", displayName: "Model Context Protocol" },
  CORE_HARNESS: { key: "core_harness", displayName: "Core Harness Tools" },
  CORE_WORKSPACE: { key: "core_workspace", displayName: "Core Workspace Tools" },
  REDDIT: { key: "reddit", displayName: "Reddit" },
  SECURITY: { key: "security", displayName: "Security" },
  NETWORK_INTELLIGENCE: { key: "network_intelligence", displayName: "Network Intelligence" },
  CALENDAR: { key: "calendar", displayName: "Calendar" },
} as const;

export type DomainConstantKey = keyof typeof DOMAINS;
export type DomainEntry = (typeof DOMAINS)[DomainConstantKey];
export type DomainKey = DomainEntry["key"];
export type DomainDisplayName = DomainEntry["displayName"];


export const DOMAIN_TAGS = Object.fromEntries(
  Object.entries(DOMAINS).map(([constantKey, entry]) => [
    constantKey,
    `domain:${entry.displayName}`,
  ]),
) as Record<DomainConstantKey, `domain:${DomainDisplayName}`>;

export const DOMAIN_KEY_TAGS = Object.fromEntries(
  Object.entries(DOMAINS).map(([constantKey, entry]) => [
    constantKey,
    `domainKey:${entry.key}`,
  ]),
) as Record<DomainConstantKey, `domainKey:${DomainKey}`>;
