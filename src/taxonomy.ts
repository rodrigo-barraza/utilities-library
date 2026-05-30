// ─────────────────────────────────────────────────────────────
// Tool Taxonomy Constants
// ─────────────────────────────────────────────────────────────

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
  WEATHER: "Weather & Environment",
  EVENTS: "Events",
  SPORTS: "Sports",
  MARKETS: "Markets & Commodities",
  TRENDS: "Trends",
  PRODUCTS: "Products",
  FINANCE: "Finance",
  KNOWLEDGE: "Knowledge",
  MOVIES: "Movies & TV",
  HEALTH: "Health",
  TRANSIT: "Transit",
  UTILITIES: "Utilities",
  COMPUTE: "Compute",
  MARITIME: "Maritime",
  ENERGY: "Energy",
  COMMUNICATION: "Communication",
  CREATIVE: "Creative",
  GAMING: "Gaming",
  DISCORD: "Discord",
  SMART_HOME: "Smart Home",
  FILES: "Workspace",
  SEARCH: "Workspace",
  WEB: "Web",
  COMMAND: "Workspace",
  GIT: "Workspace",
  BROWSER: "Browser",
  CODE_INTEL: "Workspace",
  TASKS: "Task Management",
  MEMORY: "Memory",
  AGENTS: "Agent Management",
  WORKSPACE: "Workspace",
  TOOLS: "Tool Management",
  META: "Meta",
  CRON_JOBS: "Cron Jobs",
  CONVERSATION_TIMERS: "Timers",
  REASONING: "Reasoning",
  COORDINATOR: "Coordinator",
  SKILLS: "Skills",
  CONTROL: "Control Flow",
  STRUCTURED: "Structured Output",
  GIT_ISOLATION: "Workspace",
  TASK_MGMT: "Task Management",
  TORRENT: "Torrent",
} as const;

export type DomainKey = keyof typeof DOMAINS;
export type DomainValue = (typeof DOMAINS)[DomainKey];

export const LABEL_TAGS = Object.fromEntries(
  Object.entries(LABELS).map(([key, value]) => [key, `label:${value}`]),
) as Record<LabelKey, `label:${LabelValue}`>;

export const DOMAIN_TAGS = Object.fromEntries(
  Object.entries(DOMAINS).map(([key, value]) => [key, `domain:${value}`]),
) as Record<DomainKey, `domain:${DomainValue}`>;
