export const LABELS = {
  CODING: "coding",
  DATA: "data",
  WEB: "web",
  HEALTH: "health",
  FINANCE: "finance",
  LOCATION: "location",
  REFERENCE: "reference",
  MEDIA: "media",
  SHOPPING: "shopping",
  SPORTS: "sports",
  MARITIME: "maritime",
  ENERGY: "energy",
  COMMUNICATION: "communication",
  CREATIVE: "creative",
  SMART_HOME: "smart_home",
  LIFX: "lifx",
  DISCORD: "discord",
  GIT: "git",
  META: "meta",
  AUTOMATION: "automation",
  DATA_SCIENCE: "data_science",
  ORCHESTRATION: "orchestration",
  DOWNLOAD: "download",
} as const;

export type LabelKey = keyof typeof LABELS;
export type LabelValue = (typeof LABELS)[LabelKey];

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
  FILES: { key: "workspace", displayName: "Workspace" },
  SEARCH: { key: "workspace", displayName: "Workspace" },
  WEB: { key: "web", displayName: "Web" },
  COMMAND: { key: "workspace", displayName: "Workspace" },
  GIT: { key: "workspace", displayName: "Workspace" },
  BROWSER: { key: "browser", displayName: "Browser" },
  CODE_INTEL: { key: "workspace", displayName: "Workspace" },
  TASKS: { key: "tasks", displayName: "Task Management" },
  MEMORY: { key: "memory", displayName: "Memory" },
  AGENTS: { key: "agents", displayName: "Agent Management" },
  WORKSPACE: { key: "workspace", displayName: "Workspace" },
  TOOLS: { key: "tools", displayName: "Tool Management" },
  META: { key: "meta", displayName: "Meta" },
  CRON_JOBS: { key: "cron_jobs", displayName: "Cron Jobs" },
  CONVERSATION_TIMERS: { key: "timers", displayName: "Timers" },
  REASONING: { key: "reasoning", displayName: "Reasoning" },
  ORCHESTRATOR: { key: "orchestrator", displayName: "Core Orchestrator Tools" },
  SKILLS: { key: "skills", displayName: "Skills" },
  CONTROL: { key: "control", displayName: "Control Flow" },
  STRUCTURED: { key: "structured", displayName: "Structured Output" },
  GIT_ISOLATION: { key: "workspace", displayName: "Workspace" },
  TASK_MGMT: { key: "tasks", displayName: "Task Management" },
  TORRENT: { key: "torrent", displayName: "Torrent" },
  MCP: { key: "mcp", displayName: "Model Context Protocol" },
  CORE_HARNESS: { key: "core_harness", displayName: "Core Harness Tools" },
  REDDIT: { key: "reddit", displayName: "Reddit" },
} as const;

export type DomainConstantKey = keyof typeof DOMAINS;
export type DomainEntry = (typeof DOMAINS)[DomainConstantKey];
export type DomainKey = DomainEntry["key"];
export type DomainDisplayName = DomainEntry["displayName"];

export const LABEL_TAGS = Object.fromEntries(
  Object.entries(LABELS).map(([key, value]) => [key, `label:${value}`]),
) as Record<LabelKey, `label:${LabelValue}`>;

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
