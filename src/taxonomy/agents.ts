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
  BENDER: "BENDER",
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
  HIERARCHICAL_AGGREGATION: "hierarchical_aggregation",
  SEQUENTIAL: "sequential",
  PEER_TO_PEER: "peer_to_peer",
  TOURNAMENT: "tournament",
  CRITIC_LOOP: "critic_loop",
  DIVIDE_AND_CONQUER: "divide_and_conquer",
  MCTS: "mcts",
} as const;

export type TopologyType = (typeof TOPOLOGIES)[keyof typeof TOPOLOGIES];

export const DEFAULT_TOPOLOGY = TOPOLOGIES.HIERARCHICAL;

// ─────────────────────────────────────────────────────────────
// Recursive Sub-Agent Spawning — cross-cutting capability that
// allows sub-agents to spawn their own sub-agents via create_subagents.
//
// This is NOT a topology — it's a depth-gated mechanism that
// augments any existing topology.
//
// Depth semantics (total hierarchy levels below the root):
//   0 — Sub-agent spawning disabled entirely (root cannot use create_subagents)
//   1 — Flat fan-out: root spawns Workers (no recursive delegation)
//   2 — Root → Coordinators → Workers (one recursion level)
//   3 — Root → Coordinators → Coordinators → Workers (two recursion levels)
//  10 — Deep recursive hierarchies (absolute hard cap)
//
// Paper alignment:
//   THREAD (arXiv:2405.17402)  — recursive thread spawning
//   RAH (2026)                 — recursive agent harness architecture
//   RecursiveMAS (arXiv:2604.25917) — latent-space recursion
// ─────────────────────────────────────────────────────────────

export const MAXIMUM_RECURSIVE_SPAWNING_DEPTH = 10;
export const DEFAULT_RECURSIVE_SPAWNING_DEPTH = 1;

// ─────────────────────────────────────────────────────────────
// Thought Structures — single-agent reasoning decomposition shapes.
//
// Thought Structure → Topology mapping (structures are per-agent;
// topologies are multi-agent orchestration patterns):
//
// Single-agent thought structures (enum values below):
//   CoT   ↔ Sequential Pipeline         (linear chain)
//   ToT   ↔ Hierarchical Parallel       (branch → select best)
//   GoT   ↔ Graph of Thoughts           (branch → score → synthesize)
//
// Multi-agent topologies (see TOPOLOGIES above):
//   MoA   ↔ Hierarchical Aggregation    (branch → synthesize all)
//   BoN   ↔ Tournament                  (parallel → judge selects best)
//   RDD   ↔ Divide and Conquer          (decompose → solve → recompose)
//   LATS  ↔ MCTS                        (UCB tree search → backprop)
//   MAD   ↔ Peer-to-Peer Mesh           (multi-agent debate rounds)
//   MAR   ↔ Critic Loop                 (actor–critic iterative refinement)
// ─────────────────────────────────────────────────────────────

export const THOUGHT_STRUCTURES = {
  CHAIN_OF_THOUGHT: "chain_of_thought",
  TREE_OF_THOUGHTS: "tree_of_thoughts",
  GRAPH_OF_THOUGHTS: "graph_of_thoughts",
} as const;

export type ThoughtStructureType =
  (typeof THOUGHT_STRUCTURES)[keyof typeof THOUGHT_STRUCTURES];

export const DEFAULT_THOUGHT_STRUCTURE = THOUGHT_STRUCTURES.CHAIN_OF_THOUGHT;

// ─────────────────────────────────────────────────────────────
// Agentic Loop Defaults — cross-cutting constants shared
// between prism-service harnesses and prism-client settings.
// ─────────────────────────────────────────────────────────────

/** Default maximum tool-call iterations per agentic loop run. */
export const MAX_TOOL_ITERATIONS = 25;

/** Default project identifier for agent conversations and tool labels. */
export const DEFAULT_CODING_PROJECT = "coding";

// ─────────────────────────────────────────────────────────────
// System Statuses — shared execution phases across UI and backend.
// ─────────────────────────────────────────────────────────────

export const SYSTEM_STATUSES = {
  RUNNING: "running",
  IN_PROGRESS: "in_progress",
  PENDING: "pending",
  FAILED: "failed",
  STOPPED: "stopped",
  COMPLETE: "complete",
  COMPLETED: "completed",
  SUCCESS: "success",
  DONE: "done",
  IDLE: "idle",
  ACTIVE: "active",
  CANCELLED: "cancelled",
  ERROR: "error",
  WARNING: "warning",
} as const;

export type SystemStatus = (typeof SYSTEM_STATUSES)[keyof typeof SYSTEM_STATUSES];

// ─────────────────────────────────────────────────────────────
// Message Roles — canonical chat message roles.
// ─────────────────────────────────────────────────────────────

export const MESSAGE_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
  TOOL: "tool",
} as const;

export type MessageRole = (typeof MESSAGE_ROLES)[keyof typeof MESSAGE_ROLES];

// ─────────────────────────────────────────────────────────────
// Approval Statuses — human-in-the-loop tool approval protocol.
// ─────────────────────────────────────────────────────────────

export const APPROVAL_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type ApprovalStatusType =
  (typeof APPROVAL_STATUS)[keyof typeof APPROVAL_STATUS];
