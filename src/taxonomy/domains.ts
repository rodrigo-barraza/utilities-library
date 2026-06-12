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
  WEB: { key: "web", displayName: "Web" },
  BROWSER: { key: "browser", displayName: "Browser" },
  TASKS: { key: "tasks", displayName: "Task Management" },
  MEMORY: { key: "memory", displayName: "Memory" },
  AGENTS: { key: "agents", displayName: "Agent Management" },
  TOOLS: { key: "tools", displayName: "Tool Management" },
  META: { key: "meta", displayName: "Meta" },
  CONVERSATION_TIMERS: { key: "timers", displayName: "Timers" },
  REASONING: { key: "reasoning", displayName: "Reasoning" },
  CORE_ORCHESTRATOR: { key: "core_orchestrator", displayName: "Core Orchestrator Tools" },
  SKILLS: { key: "skills", displayName: "Skills" },
  CONTROL: { key: "control", displayName: "Control Flow" },
  STRUCTURED: { key: "structured", displayName: "Structured Output" },
  TORRENT: { key: "torrent", displayName: "Torrent" },
  MCP: { key: "mcp", displayName: "Model Context Protocol" },
  CORE_HARNESS: { key: "core_harness", displayName: "Core Harness Tools" },
  CORE_WORKSPACE: { key: "core_workspace", displayName: "Core Workspace Tools" },
  CORE_SKILL: { key: "core_skill", displayName: "Core Skill Tools" },
  CORE_SCHEDULE: { key: "core_schedule", displayName: "Core Schedule Tools" },
  CORE_USER: { key: "core_user", displayName: "Core User Tools" },
  CORE_DISCOVER: { key: "core_discover", displayName: "Core Discover Tools" },
  CORE_TASK: { key: "core_task", displayName: "Core Task Tools" },
  CORE_PLAN: { key: "core_plan", displayName: "Core Plan Tools" },
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

const CORE_DOMAIN_DISPLAY_NAMES = new Set<DomainDisplayName>([
  DOMAINS.CORE_HARNESS.displayName,
  DOMAINS.CORE_WORKSPACE.displayName,
  DOMAINS.CORE_ORCHESTRATOR.displayName,
  DOMAINS.CORE_SKILL.displayName,
  DOMAINS.CORE_SCHEDULE.displayName,
  DOMAINS.CORE_USER.displayName,
  DOMAINS.CORE_DISCOVER.displayName,
  DOMAINS.CORE_TASK.displayName,
  DOMAINS.CORE_PLAN.displayName,
]);

export function isCoreDomain(domainDisplayName: string): boolean {
  return CORE_DOMAIN_DISPLAY_NAMES.has(domainDisplayName as DomainDisplayName);
}
