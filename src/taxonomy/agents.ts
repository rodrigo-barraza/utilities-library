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
