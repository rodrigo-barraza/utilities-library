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
  ORCHESTRATOR: { key: "orchestrator", displayName: "Core Orchestrator Tools" },
  SKILLS: { key: "skills", displayName: "Skills" },
  CONTROL: { key: "control", displayName: "Control Flow" },
  STRUCTURED: { key: "structured", displayName: "Structured Output" },
  GIT_ISOLATION: { key: "workspace", displayName: "Workspace" },
  TASK_MGMT: { key: "tasks", displayName: "Task Management" },
  TORRENT: { key: "torrent", displayName: "Torrent" },
  MCP: { key: "mcp", displayName: "Model Context Protocol" },
  CORE: { key: "core", displayName: "Core Tools" },
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

// Defer CORE_AGENTIC_TOOLS / CORE_ORCHESTRATOR_TOOLS to after TOOL_NAMES
// so they can reference constants instead of duplicating raw strings.

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
  STR_REPLACE_FILE: "replace_in_file",
  PATCH_FILE: "patch_file",
  MOVE_FILE: "move_file",
  DELETE_FILE: "delete_file",
  MULTI_FILE_READ: "read_files",
  GREP_SEARCH: "search_file_contents",
  PROJECT_SUMMARY: "summarize_project",
  GIT: "run_git",

  // ── Execution ──
  RUN_COMMAND: "execute_command",
  EXECUTE_SHELL: "execute_shell",
  EXECUTE_PYTHON: "execute_python",
  EXECUTE_JAVASCRIPT: "execute_javascript",
  EXECUTE_CODE: "execute_code",

  // ── Browser ──
  BROWSER_ACTION: "control_browser",

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
  EXTRACT_MEMORIES: "extract_memories",
  CONSOLIDATE_MEMORIES: "consolidate_memories",
  SEARCH_MEMORIES: "search_memories",

  // ── Compute ──
  CALCULATE_PRECISE: "evaluate_expression",

  // ── Smart Home ──
  LIFX_BREATHE_EFFECT: "start_light_breathe_effect",
  LIFX_PULSE_EFFECT: "start_light_pulse_effect",

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
  SYNTHESIZE_SPEECH: "synthesize_speech",
  TRANSCRIBE_AUDIO: "transcribe_audio",
  GENERATE_AUDIO: "generate_audio",

  // ── Modality Detection ──
  // TODO(cleanup): Remove WEB_SEARCH_PREVIEW once historical sessions have aged out
  WEB_SEARCH_PREVIEW: "web_search_preview",
  SEARCH_WEB_PREVIEW: "search_web_preview",
  CODE_EXECUTION: "code_execution",

  // ── Internal / Prism-Local Tools ──
  ENTER_PLAN_MODE: "enter_plan_mode",
  EXIT_PLAN_MODE: "exit_plan_mode",
  ASK_USER: "ask_user",
  WRITE_TODO: "write_todo",
  SUMMARIZE_CONVERSATION: "summarize_conversation",
  ENTER_WORKTREE: "enter_worktree",
  EXIT_WORKTREE: "exit_worktree",
  CREATE_SKILL: "create_skill",
  EXECUTE_SKILL: "execute_skill",
  LIST_SKILLS: "list_skills",
  DELETE_SKILL: "delete_skill",
  SET_TIMER: "set_timer",
  LIST_TIMERS: "list_timers",
  CANCEL_TIMER: "cancel_timer",
  LIST_MCP_RESOURCES: "list_mcp_resources",
  READ_MCP_RESOURCE: "read_mcp_resource",
  AUTHENTICATE_MCP_SERVER: "authenticate_mcp_server",

  // ── Orchestrator Tools ──
  CREATE_TEAM: "create_team",
  SEND_MESSAGE: "send_message",
  STOP_AGENT: "stop_agent",
  GET_TASK_OUTPUT: "get_task_output",
  DELETE_TEAM: "delete_team",

  // ── Approval Engine Aliases ──
  // Keys matching the tool's own snake_case name for intuitive lookups
  // in AutoApprovalEngine, ToolCallBadge, etc.
  SEARCH_FILE_CONTENTS: "search_file_contents",
  FIND_FILES: "find_files",
  READ_WEB_PAGE: "read_web_page",
  READ_FILES: "read_files",
  GET_FILE_INFO: "get_file_info",
  DIFF_FILES: "diff_files",
  GIT_STATUS: "git_status",
  GIT_DIFF: "git_diff",
  GIT_LOG: "git_log",
  SUMMARIZE_PROJECT: "summarize_project",
  REPLACE_IN_FILE: "replace_in_file",
  CONTROL_BROWSER: "control_browser",
  EXECUTE_COMMAND: "execute_command",
  GET_TASK: "get_task",
  SLEEP: "sleep",
  EMIT_STRUCTURED_OUTPUT: "emit_structured_output",

  // ── Scheduling / Notebook ──
  CREATE_CRON: "create_cron",
  REMOTE_TRIGGER: "remote_trigger",
  CREATE_CRON_JOB: "create_cron_job",
  LIST_CRON_JOBS: "list_cron_jobs",
  DELETE_CRON_JOB: "delete_cron_job",
  TRIGGER_CRON_JOB: "trigger_cron_job",
  EDIT_NOTEBOOK: "edit_notebook",

  // ── Provider-Native Tools ──
  GOOGLE_SEARCH: "googleSearch",
} as const;

export type ToolName = (typeof TOOL_NAMES)[keyof typeof TOOL_NAMES];

// ─────────────────────────────────────────────────────────────
// Core Tool Sets — built from TOOL_NAMES to guarantee a single
// source of truth. Renaming a tool in TOOL_NAMES automatically
// propagates to these arrays.
// ─────────────────────────────────────────────────────────────

export const CORE_AGENTIC_TOOLS = [
  TOOL_NAMES.UPSERT_MEMORY,
  TOOL_NAMES.CREATE_TASK,
  TOOL_NAMES.LIST_TASKS,
  TOOL_NAMES.UPDATE_TASK,
  TOOL_NAMES.CALCULATE_PRECISE,
  TOOL_NAMES.EXECUTE_JAVASCRIPT,
  TOOL_NAMES.EXECUTE_PYTHON,
  TOOL_NAMES.SEARCH_TOOLS,
  TOOL_NAMES.SEARCH_WEB,
  TOOL_NAMES.READ_URL,
  TOOL_NAMES.GET_WEB_CONTENT,
  TOOL_NAMES.ENTER_PLAN_MODE,
  TOOL_NAMES.EXIT_PLAN_MODE,
  TOOL_NAMES.ASK_USER,
  TOOL_NAMES.WRITE_TODO,
  TOOL_NAMES.SUMMARIZE_CONVERSATION,
  TOOL_NAMES.ENTER_WORKTREE,
  TOOL_NAMES.EXIT_WORKTREE,
  TOOL_NAMES.CREATE_SKILL,
  TOOL_NAMES.EXECUTE_SKILL,
  TOOL_NAMES.LIST_SKILLS,
  TOOL_NAMES.DELETE_SKILL,
] as const;

export const CORE_ORCHESTRATOR_TOOLS = [
  TOOL_NAMES.CREATE_TEAM,
  TOOL_NAMES.SEND_MESSAGE,
  TOOL_NAMES.STOP_AGENT,
  TOOL_NAMES.GET_TASK_OUTPUT,
  TOOL_NAMES.DELETE_TEAM,
] as const;



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
  transcribe_audio: [INPUT_MODALITIES.AUDIO],
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

/** Reusable synthetic "Agentless" agent object for UI agent pickers. */
export const AGENTLESS_AGENT = {
  id: AGENT_IDS.NONE,
  name: "Agentless",
} as const;

// ─────────────────────────────────────────────────────────────
// Orchestrator Topologies — multi-agent execution strategies.
// ─────────────────────────────────────────────────────────────

export const TOPOLOGIES = {
  HIERARCHICAL: "hierarchical",
  SEQUENTIAL: "sequential",
  PEER_TO_PEER: "peer_to_peer",
} as const;

export type TopologyType = (typeof TOPOLOGIES)[keyof typeof TOPOLOGIES];

export const DEFAULT_TOPOLOGY = TOPOLOGIES.HIERARCHICAL;

// ─────────────────────────────────────────────────────────────
// Default Labels & Fallback Constants — shared across
// prism-service and prism-client for consistency.
// ─────────────────────────────────────────────────────────────

export const DEFAULT_CONVERSATION_TITLE = "New Conversation";
export const DEFAULT_WORKFLOW_TITLE = "Untitled Workflow";
export const DEFAULT_USERNAME = "anonymous";
export const DEFAULT_PROJECT = "default";
