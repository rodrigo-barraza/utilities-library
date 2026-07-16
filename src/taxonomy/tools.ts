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
  STRING_REPLACE_FILE: "replace_in_file",
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
  SAVE_MEMORY: "save_memory",
  EXTRACT_MEMORIES: "extract_memories",
  CONSOLIDATE_MEMORIES: "consolidate_memories",
  SEARCH_MEMORIES: "search_memories",
  SEARCH_CONVERSATIONS: "search_conversations",

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
  LIST_AGENTS: "list_agents",
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
  ENABLE_TOOLS: "enable_tools",
  DISABLE_TOOLS: "disable_tools",
  DISCOVER_AND_ENABLE_TOOLS: "discover_and_enable_tools",
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
  // Context management (lossless offload + rubric-gated compaction)
  RETRIEVE_OFFLOADED_CONTENT: "retrieve_offloaded_content",
  COMPACT_CONTEXT: "compact_context",

  // ── Orchestrator Tools ──
  CREATE_SUBAGENT: "create_subagent",
  CREATE_SUBAGENTS: "create_subagents",
  SEND_SUBAGENT_MESSAGE: "send_subagent_message",
  STOP_SUBAGENT: "stop_subagent",
  GET_SUBAGENT_OUTPUT: "get_subagent_output",
  DELETE_SUBAGENTS: "delete_subagents",
  RESUME_SUBAGENT: "resume_subagent",

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
  THINK: "think",

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
  TOOL_NAMES.ENABLE_TOOLS,
  TOOL_NAMES.DISABLE_TOOLS,
  TOOL_NAMES.DISCOVER_AND_ENABLE_TOOLS,
  TOOL_NAMES.SAVE_MEMORY,
  TOOL_NAMES.SEARCH_CONVERSATIONS,
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
  TOOL_NAMES.GET_TASK,
  TOOL_NAMES.SLEEP,
  TOOL_NAMES.EMIT_STRUCTURED_OUTPUT,
  TOOL_NAMES.THINK,
] as const;

export const CORE_ORCHESTRATOR_TOOLS = [
  TOOL_NAMES.CREATE_SUBAGENT,
  TOOL_NAMES.CREATE_SUBAGENTS,
  TOOL_NAMES.SEND_SUBAGENT_MESSAGE,
  TOOL_NAMES.STOP_SUBAGENT,
  TOOL_NAMES.GET_SUBAGENT_OUTPUT,
  TOOL_NAMES.DELETE_SUBAGENTS,
  TOOL_NAMES.RESUME_SUBAGENT,
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
