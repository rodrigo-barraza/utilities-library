// ─────────────────────────────────────────────────────────────
// SSE Event Types — cross-service streaming contract between
// prism-service (producer) and prism-client (consumer).
//
// IMPORTANT: Adding/removing/renaming an event type here will
// surface compile errors on BOTH sides of the contract.
// ─────────────────────────────────────────────────────────────

export const SERVER_SENT_EVENT_TYPES = {
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

  // ── Worker / Sub-Agent Tool Variants ──
  SUB_AGENT_TOOL_EXECUTION: "sub_agent_tool_execution",
  SUB_AGENT_TOOL_OUTPUT: "sub_agent_tool_output",
  USER_QUESTION: "user_question",

  // ── Benchmark / Workflow SSE ──
  RUN_INFO: "run_info",
  MODEL_START: "model_start",
  MODEL_COMPLETE: "model_complete",
  RUN_COMPLETE: "run_complete",

  // ── Legacy Alias ──
  TOKEN: "token",
} as const;

export type ServerSentEventType =
  (typeof SERVER_SENT_EVENT_TYPES)[keyof typeof SERVER_SENT_EVENT_TYPES];



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
  TOOL_SET_CHANGED: "tool_set_changed",
  VALIDATION_ERRORS_DETECTED: "validation_errors_detected",

  // ── Image Generation ──
  GENERATION_STARTED: "generation_started",
  GENERATION_PROGRESS: "generation_progress",

  // ── Branching & Synthesis (ToT / GoT) ──
  BRANCHING_STARTED: "branching_started",
  BRANCH_SELECTED: "branch_selected",
  BRANCH_BACKTRACKED: "branch_backtracked",
  SYNTHESIS_STARTED: "synthesis_started",
  SYNTHESIS_COMPLETE: "synthesis_complete",

  // ── Worktree ──
  WORKTREE_ENTERED: "worktree_entered",
  WORKTREE_EXITED: "worktree_exited",

  // ── Orchestrator ──
  SPAWNED: "spawned",
  PHASE: "phase",
  COMPLETE: "complete",
  FAILED: "failed",

  // ── Harness Engineering ──
  SYSTEM_REMINDER_INJECTED: "system_reminder_injected",
  COST_LIMIT_REACHED: "cost_limit_reached",
  SANDBOX_CHECKPOINT_CREATED: "sandbox_checkpoint_created",
  SANDBOX_RESTORED: "sandbox_restored",
  REPETITION_DETECTED: "repetition_detected",
  SEMANTIC_STALL_DETECTED: "semantic_stall_detected",
} as const;

export type StatusMessage =
  (typeof STATUS_MESSAGES)[keyof typeof STATUS_MESSAGES];
