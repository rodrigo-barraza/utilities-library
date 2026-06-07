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
  ORCHESTRATOR: { key: "orchestrator", displayName: "Orchestrator" },
  SKILLS: { key: "skills", displayName: "Skills" },
  CONTROL: { key: "control", displayName: "Control Flow" },
  STRUCTURED: { key: "structured", displayName: "Structured Output" },
  GIT_ISOLATION: { key: "workspace", displayName: "Workspace" },
  TASK_MGMT: { key: "tasks", displayName: "Task Management" },
  TORRENT: { key: "torrent", displayName: "Torrent" },
  MCP: { key: "mcp", displayName: "Model Context Protocol" },
  CORE: { key: "core", displayName: "Core Tools" },
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

export const CORE_AGENTIC_TOOLS = [
  "upsert_memory",
  "create_task",
  "list_tasks",
  "update_task",
  "calculate_precise",
  "execute_javascript",
  "execute_python",
  "search_tools",
  "search_web",
  "read_url",
  "get_web_content",
  "enter_plan_mode",
  "exit_plan_mode",
  "ask_user_question",
  "write_todo",
  "brief",
  "enter_worktree",
  "exit_worktree",
  "create_skill",
  "execute_skill",
  "list_skills",
  "delete_skill",
] as const;

export const CORE_ORCHESTRATOR_TOOLS = [
  "create_team",
  "send_message",
  "stop_agent",
  "get_task_output",
  "delete_team",
] as const;

// ─────────────────────────────────────────────────────────────
// Tool Name Constants — single source of truth for programmatic
// tool name references across all services.
//
// IMPORTANT: These are for *programmatic* comparisons, `requires[]`
// arrays, `Set` membership checks, and `enabledTools[]` entries.
// Prose references inside LLM system prompts are NOT covered here.
// ─────────────────────────────────────────────────────────────

export const TOOL_NAMES = {
  // ── Creative ──
  GENERATE_IMAGE: "generate_image",
  DESCRIBE_IMAGE: "describe_image",
  CONVERT_IMAGE_TO_ASCII: "convert_image_to_ascii",
  MANIPULATE_IMAGE: "manipulate_image",

  // ── Web & Knowledge ──
  SEARCH_WEB: "search_web",
  READ_URL: "read_url",
  GET_WEB_CONTENT: "get_web_content",
  GET_WIKIPEDIA_SUMMARY: "get_wikipedia_summary",
  GET_TRENDS: "get_trends",
  GET_HOT_TRENDS: "get_hot_trends",
  GET_TOP_TRENDS: "get_top_trends",
  GET_ON_THIS_DAY: "get_on_this_day",

  // ── Events & Products ──
  GET_EVENTS: "get_events",
  SEARCH_PRODUCTS: "search_products",
  GET_TRENDING_PRODUCTS: "get_trending_products",

  // ── Workspace / Coding ──
  READ_FILE: "read_file",
  WRITE_FILE: "write_file",
  STR_REPLACE_FILE: "str_replace_file",
  PATCH_FILE: "patch_file",
  MOVE_FILE: "move_file",
  DELETE_FILE: "delete_file",
  MULTI_FILE_READ: "multi_file_read",
  GREP_SEARCH: "grep_search",
  PROJECT_SUMMARY: "project_summary",
  GIT: "git",

  // ── Execution ──
  RUN_COMMAND: "run_command",
  EXECUTE_SHELL: "execute_shell",
  EXECUTE_PYTHON: "execute_python",
  EXECUTE_JAVASCRIPT: "execute_javascript",
  EXECUTE_CODE: "execute_code",

  // ── Browser ──
  BROWSER_ACTION: "browser_action",

  // ── Health / Nutrition ──
  SEARCH_USDA_NUTRITION: "search_usda_nutrition",
  SEARCH_GYM_EXERCISES: "search_gym_exercises",
  RANK_FOODS_BY_CATEGORY: "rank_foods_by_category",
  RANK_FOODS_BY_NUTRIENT: "rank_foods_by_nutrient",
  COMPARE_FOOD_NUTRITION: "compare_food_nutrition",
  CALCULATE_CALORIC_NEEDS: "calculate_caloric_needs",
  BUILD_MEAL_PLAN: "build_meal_plan",
  ANALYZE_NUTRIENT_GAPS: "analyze_nutrient_gaps",
  SEARCH_DRUG_NUTRIENT_INTERACTIONS: "search_drug_nutrient_interactions",
  SEARCH_FDA_DRUGS: "search_fda_drugs",
  CALCULATE_HYDRATION_NEEDS: "calculate_hydration_needs",

  // ── Task & Memory ──
  CREATE_TASK: "create_task",
  LIST_TASKS: "list_tasks",
  UPDATE_TASK: "update_task",
  UPSERT_MEMORY: "upsert_memory",

  // ── Compute ──
  CALCULATE_PRECISE: "calculate_precise",

  // ── Smart Home ──
  LIFX_BREATHE_EFFECT: "lifx_breathe_effect",
  LIFX_PULSE_EFFECT: "lifx_pulse_effect",

  // ── Weather & Environment ──
  GET_WEATHER: "get_weather",
  GET_WEATHER_FORECAST: "get_weather_forecast",
  GET_LOCAL_ENVIRONMENT: "get_local_environment",
  GET_EARTHQUAKES: "get_earthquakes",
  GET_WILDFIRES: "get_wildfires",
  GET_ISS_LOCATION: "get_iss_location",
  GET_NEAR_EARTH_OBJECTS: "get_near_earth_objects",
  GET_SOLAR_ACTIVITY: "get_solar_activity",

  // ── Meta ──
  SEARCH_TOOLS: "search_tools",
  CREATE_CUSTOM_AGENT: "create_custom_agent",
  LIST_CUSTOM_AGENTS: "list_custom_agents",
  UPDATE_CUSTOM_AGENT: "update_custom_agent",

  // ── Compaction (provider-agnostic aliases matching upstream API names) ──
  WEB_CONTENT: "web_content",
  WEB_SEARCH: "web_search",
  SEARCH_FILES: "search_files",
  LIST_DIRECTORY: "list_directory",
  READ_IMAGE: "read_image",
  PYTHON_INTERPRETER: "python_interpreter",
  JAVASCRIPT_INTERPRETER: "javascript_interpreter",
  SHELL: "shell",
  GENERATE_AUDIO: "generate_audio",

  // ── Modality Detection ──
  // TODO(cleanup): Remove WEB_SEARCH_PREVIEW once historical sessions have aged out
  WEB_SEARCH_PREVIEW: "web_search_preview",
  SEARCH_WEB_PREVIEW: "search_web_preview",
  CODE_EXECUTION: "code_execution",
} as const;

export type ToolName = (typeof TOOL_NAMES)[keyof typeof TOOL_NAMES];

// ─────────────────────────────────────────────────────────────
// Tool Input Modalities — maps tools to the file types they can
// consume from user-uploaded attachments. Used by prism-client
// to dynamically show the correct upload button icons and accept
// filters, and by prism-service to enrich client-facing schemas.
//
// Modalities:
//   image    → image/* files (JPEG, PNG, WebP, GIF, etc.)
//   audio    → audio/* files (MP3, WAV, M4A, WEBM, etc.)
//   video    → video/* files (MP4, WebM, MOV, etc.)
//   pdf      → PDF documents
//   document → Office/tabular documents (DOCX, XLSX, CSV, TSV)
// ─────────────────────────────────────────────────────────────

export const INPUT_MODALITIES = {
  IMAGE: "image",
  AUDIO: "audio",
  VIDEO: "video",
  PDF: "pdf",
  DOCUMENT: "document",
} as const;

export type InputModality =
  (typeof INPUT_MODALITIES)[keyof typeof INPUT_MODALITIES];

export const TOOL_INPUT_MODALITIES: Readonly<
  Record<string, readonly InputModality[]>
> = {
  generate_image: [INPUT_MODALITIES.IMAGE],
  manipulate_image: [INPUT_MODALITIES.IMAGE],
  convert_image_to_ascii: [INPUT_MODALITIES.IMAGE],
  describe_image: [INPUT_MODALITIES.IMAGE],
  create_3d_model: [INPUT_MODALITIES.IMAGE],
  create_3d_scene: [INPUT_MODALITIES.IMAGE],
  speech_to_text: [INPUT_MODALITIES.AUDIO],
  read_pdf: [INPUT_MODALITIES.PDF],
  read_docx: [INPUT_MODALITIES.DOCUMENT],
  read_spreadsheet: [INPUT_MODALITIES.DOCUMENT],
  convert_video_to_gif: [INPUT_MODALITIES.VIDEO],
  create_vector_animation: [INPUT_MODALITIES.IMAGE],
} as const;

// ─────────────────────────────────────────────────────────────
// SSE Event Types — cross-service streaming contract between
// prism-service (producer) and prism-client (consumer).
//
// IMPORTANT: Adding/removing/renaming an event type here will
// surface compile errors on BOTH sides of the contract.
// ─────────────────────────────────────────────────────────────

export const SSE_EVENT_TYPES = {
  CHUNK: "chunk",
  THINKING: "thinking",
  IMAGE: "image",
  AUDIO: "audio",
  TOOL_CALL: "toolCall",
  TOOL_EXECUTION: "tool_execution",
  TOOL_OUTPUT: "tool_output",
  USAGE_UPDATE: "usage_update",
  STATUS: "status",
  DONE: "done",
  ERROR: "error",
  TODO_UPDATE: "todo_update",
  BRIEF_UPDATE: "brief_update",
  TEXT: "text",
  SUB_AGENT_STATUS: "sub_agent_status",
  PLAN_PROPOSAL: "plan_proposal",
  APPROVAL_REQUIRED: "approval_required",
  EXECUTABLE_CODE: "executableCode",
  CODE_EXECUTION_RESULT: "codeExecutionResult",
  WEB_SEARCH_RESULT: "webSearchResult",
} as const;

export type SseEventType =
  (typeof SSE_EVENT_TYPES)[keyof typeof SSE_EVENT_TYPES];

// ─────────────────────────────────────────────────────────────
// Status Messages — the `{ type: "status", message: "..." }`
// sub-protocol used to trigger UI panel refreshes and display
// state transitions in prism-client.
// ─────────────────────────────────────────────────────────────

export const STATUS_MESSAGES = {
  // ── Panel Refreshes ──
  TASKS_UPDATED: "tasks_updated",
  SUB_AGENTS_UPDATED: "sub_agents_updated",
  MEMORIES_UPDATED: "memories_updated",
  CUSTOM_TOOLS_UPDATED: "custom_tools_updated",

  // ── Compaction Lifecycle ──
  COMPACTION_STARTED: "compaction_started",
  COMPACTION_COMPLETE: "compaction_complete",
  COMPACTION_FAILED: "compaction_failed",

  // ── Plan Mode ──
  PLAN_MODE_ENTERED: "plan_mode_entered",
  PLAN_MODE_EXITED: "plan_mode_exited",

  // ── Agentic Loop ──
  ITERATION_LIMIT_REACHED: "iteration_limit_reached",
  ITERATION_PROGRESS: "iteration_progress",
  CONTEXT_TRUNCATED: "context_truncated",
  MAX_TOKENS_TRUNCATED: "max_tokens_truncated",
  SKILLS_INJECTED: "skills_injected",
  VALIDATION_ERRORS_DETECTED: "validation_errors_detected",

  // ── Image Generation ──
  GENERATION_STARTED: "generation_started",
  GENERATION_PROGRESS: "generation_progress",

  // ── Tree-of-Thought Branching ──
  BRANCHING_STARTED: "branching_started",
  BRANCH_SELECTED: "branch_selected",
  BRANCH_BACKTRACKED: "branch_backtracked",

  // ── Worktree ──
  WORKTREE_ENTERED: "worktree_entered",
  WORKTREE_EXITED: "worktree_exited",

  // ── Orchestrator ──
  SPAWNED: "spawned",
  PHASE: "phase",
  COMPLETE: "complete",
  FAILED: "failed",
} as const;

export type StatusMessage =
  (typeof STATUS_MESSAGES)[keyof typeof STATUS_MESSAGES];

// ─────────────────────────────────────────────────────────────
// Agent / Persona IDs — canonical identifiers for built-in
// agent personas. Used as registry keys, default fallbacks,
// and special-case conditionals across prism-service and
// prism-client.
// ─────────────────────────────────────────────────────────────

export const AGENT_IDS = {
  CODING: "CODING",
  LUPOS: "LUPOS",
  IMAGE: "IMAGE",
  STICKERS: "STICKERS",
  LIGHTS: "LIGHTS",
  OOG: "OOG",
  DIGEST: "DIGEST",
  META: "META",
  OMNI: "OMNI",
  MEEPO: "MEEPO",
  NONE: "NONE",
  ALL: "ALL",
} as const;

export type AgentId = (typeof AGENT_IDS)[keyof typeof AGENT_IDS];
