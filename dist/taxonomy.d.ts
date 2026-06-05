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
    readonly COORDINATOR: {
        readonly key: "coordinator";
        readonly displayName: "Coordinator";
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
export declare const CORE_AGENTIC_TOOLS: readonly ["upsert_memory", "create_task", "list_tasks", "update_task", "calculate_precise", "execute_javascript", "execute_python", "search_tools", "search_web", "read_url", "get_web_content", "enter_plan_mode", "exit_plan_mode", "ask_user_question", "write_todo", "brief", "enter_worktree", "exit_worktree", "create_skill", "execute_skill", "list_skills", "delete_skill", "create_team", "send_message", "stop_agent", "get_task_output", "delete_team"];
export declare const TOOL_NAMES: {
    readonly GENERATE_IMAGE: "generate_image";
    readonly DESCRIBE_IMAGE: "describe_image";
    readonly CONVERT_IMAGE_TO_ASCII: "convert_image_to_ascii";
    readonly MANIPULATE_IMAGE: "manipulate_image";
    readonly SEARCH_WEB: "search_web";
    readonly READ_URL: "read_url";
    readonly GET_WEB_CONTENT: "get_web_content";
    readonly GET_WIKIPEDIA_SUMMARY: "get_wikipedia_summary";
    readonly GET_TRENDS: "get_trends";
    readonly GET_HOT_TRENDS: "get_hot_trends";
    readonly GET_TOP_TRENDS: "get_top_trends";
    readonly GET_ON_THIS_DAY: "get_on_this_day";
    readonly GET_EVENTS: "get_events";
    readonly SEARCH_PRODUCTS: "search_products";
    readonly GET_TRENDING_PRODUCTS: "get_trending_products";
    readonly READ_FILE: "read_file";
    readonly WRITE_FILE: "write_file";
    readonly STR_REPLACE_FILE: "str_replace_file";
    readonly PATCH_FILE: "patch_file";
    readonly MOVE_FILE: "move_file";
    readonly DELETE_FILE: "delete_file";
    readonly MULTI_FILE_READ: "multi_file_read";
    readonly GREP_SEARCH: "grep_search";
    readonly PROJECT_SUMMARY: "project_summary";
    readonly GIT: "git";
    readonly RUN_COMMAND: "run_command";
    readonly EXECUTE_SHELL: "execute_shell";
    readonly EXECUTE_PYTHON: "execute_python";
    readonly EXECUTE_JAVASCRIPT: "execute_javascript";
    readonly EXECUTE_CODE: "execute_code";
    readonly BROWSER_ACTION: "browser_action";
    readonly SEARCH_USDA_NUTRITION: "search_usda_nutrition";
    readonly SEARCH_GYM_EXERCISES: "search_gym_exercises";
    readonly RANK_FOODS_BY_CATEGORY: "rank_foods_by_category";
    readonly RANK_FOODS_BY_NUTRIENT: "rank_foods_by_nutrient";
    readonly COMPARE_FOOD_NUTRITION: "compare_food_nutrition";
    readonly CALCULATE_CALORIC_NEEDS: "calculate_caloric_needs";
    readonly BUILD_MEAL_PLAN: "build_meal_plan";
    readonly ANALYZE_NUTRIENT_GAPS: "analyze_nutrient_gaps";
    readonly SEARCH_DRUG_NUTRIENT_INTERACTIONS: "search_drug_nutrient_interactions";
    readonly SEARCH_FDA_DRUGS: "search_fda_drugs";
    readonly CALCULATE_HYDRATION_NEEDS: "calculate_hydration_needs";
    readonly CREATE_TASK: "create_task";
    readonly LIST_TASKS: "list_tasks";
    readonly UPDATE_TASK: "update_task";
    readonly UPSERT_MEMORY: "upsert_memory";
    readonly CALCULATE_PRECISE: "calculate_precise";
    readonly LIFX_BREATHE_EFFECT: "lifx_breathe_effect";
    readonly LIFX_PULSE_EFFECT: "lifx_pulse_effect";
    readonly GET_WEATHER: "get_weather";
    readonly GET_WEATHER_FORECAST: "get_weather_forecast";
    readonly GET_LOCAL_ENVIRONMENT: "get_local_environment";
    readonly GET_EARTHQUAKES: "get_earthquakes";
    readonly GET_WILDFIRES: "get_wildfires";
    readonly GET_ISS_LOCATION: "get_iss_location";
    readonly GET_NEAR_EARTH_OBJECTS: "get_near_earth_objects";
    readonly GET_SOLAR_ACTIVITY: "get_solar_activity";
    readonly SEARCH_TOOLS: "search_tools";
    readonly CREATE_CUSTOM_AGENT: "create_custom_agent";
    readonly LIST_CUSTOM_AGENTS: "list_custom_agents";
    readonly UPDATE_CUSTOM_AGENT: "update_custom_agent";
    readonly WEB_CONTENT: "web_content";
    readonly WEB_SEARCH: "web_search";
    readonly SEARCH_FILES: "search_files";
    readonly LIST_DIRECTORY: "list_directory";
    readonly READ_IMAGE: "read_image";
    readonly PYTHON_INTERPRETER: "python_interpreter";
    readonly JAVASCRIPT_INTERPRETER: "javascript_interpreter";
    readonly SHELL: "shell";
    readonly GENERATE_AUDIO: "generate_audio";
    readonly WEB_SEARCH_PREVIEW: "web_search_preview";
    readonly SEARCH_WEB_PREVIEW: "search_web_preview";
    readonly CODE_EXECUTION: "code_execution";
};
export type ToolName = (typeof TOOL_NAMES)[keyof typeof TOOL_NAMES];
export declare const INPUT_MODALITIES: {
    readonly IMAGE: "image";
    readonly AUDIO: "audio";
    readonly VIDEO: "video";
    readonly PDF: "pdf";
    readonly DOCUMENT: "document";
};
export type InputModality = (typeof INPUT_MODALITIES)[keyof typeof INPUT_MODALITIES];
export declare const TOOL_INPUT_MODALITIES: Readonly<Record<string, readonly InputModality[]>>;
export declare const SSE_EVENT_TYPES: {
    readonly CHUNK: "chunk";
    readonly THINKING: "thinking";
    readonly IMAGE: "image";
    readonly AUDIO: "audio";
    readonly TOOL_CALL: "toolCall";
    readonly TOOL_EXECUTION: "tool_execution";
    readonly TOOL_OUTPUT: "tool_output";
    readonly USAGE_UPDATE: "usage_update";
    readonly STATUS: "status";
    readonly DONE: "done";
    readonly ERROR: "error";
    readonly TODO_UPDATE: "todo_update";
    readonly BRIEF_UPDATE: "brief_update";
    readonly TEXT: "text";
    readonly WORKER_STATUS: "worker_status";
    readonly PLAN_PROPOSAL: "plan_proposal";
    readonly APPROVAL_REQUIRED: "approval_required";
    readonly EXECUTABLE_CODE: "executableCode";
    readonly CODE_EXECUTION_RESULT: "codeExecutionResult";
    readonly WEB_SEARCH_RESULT: "webSearchResult";
};
export type SseEventType = (typeof SSE_EVENT_TYPES)[keyof typeof SSE_EVENT_TYPES];
export declare const STATUS_MESSAGES: {
    readonly TASKS_UPDATED: "tasks_updated";
    readonly WORKERS_UPDATED: "workers_updated";
    readonly MEMORIES_UPDATED: "memories_updated";
    readonly CUSTOM_TOOLS_UPDATED: "custom_tools_updated";
    readonly COMPACTION_STARTED: "compaction_started";
    readonly COMPACTION_COMPLETE: "compaction_complete";
    readonly COMPACTION_FAILED: "compaction_failed";
    readonly PLAN_MODE_ENTERED: "plan_mode_entered";
    readonly PLAN_MODE_EXITED: "plan_mode_exited";
    readonly ITERATION_LIMIT_REACHED: "iteration_limit_reached";
    readonly ITERATION_PROGRESS: "iteration_progress";
    readonly CONTEXT_TRUNCATED: "context_truncated";
    readonly MAX_TOKENS_TRUNCATED: "max_tokens_truncated";
    readonly SKILLS_INJECTED: "skills_injected";
    readonly VALIDATION_ERRORS_DETECTED: "validation_errors_detected";
    readonly GENERATION_STARTED: "generation_started";
    readonly GENERATION_PROGRESS: "generation_progress";
    readonly BRANCHING_STARTED: "branching_started";
    readonly BRANCH_SELECTED: "branch_selected";
    readonly BRANCH_BACKTRACKED: "branch_backtracked";
    readonly WORKTREE_ENTERED: "worktree_entered";
    readonly WORKTREE_EXITED: "worktree_exited";
    readonly SPAWNED: "spawned";
    readonly PHASE: "phase";
    readonly COMPLETE: "complete";
    readonly FAILED: "failed";
};
export type StatusMessage = (typeof STATUS_MESSAGES)[keyof typeof STATUS_MESSAGES];
export declare const AGENT_IDS: {
    readonly CODING: "CODING";
    readonly LUPOS: "LUPOS";
    readonly IMAGE: "IMAGE";
    readonly STICKERS: "STICKERS";
    readonly LIGHTS: "LIGHTS";
    readonly OOG: "OOG";
    readonly DIGEST: "DIGEST";
    readonly META: "META";
    readonly OMNI: "OMNI";
    readonly MEEPO: "MEEPO";
    readonly NONE: "NONE";
    readonly ALL: "ALL";
};
export type AgentId = (typeof AGENT_IDS)[keyof typeof AGENT_IDS];
//# sourceMappingURL=taxonomy.d.ts.map