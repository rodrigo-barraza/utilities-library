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
};
/** Reusable synthetic "Agentless" agent object for UI agent pickers. */
export const AGENTLESS_AGENT = {
    id: AGENT_IDS.NONE,
    name: "Agentless",
};
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
};
export const DEFAULT_TOPOLOGY = TOPOLOGIES.HIERARCHICAL;
// ─────────────────────────────────────────────────────────────
// Recursive Sub-Agent Spawning — cross-cutting capability that
// allows sub-agents to spawn their own sub-agents via create_team.
//
// This is NOT a topology — it's a depth-gated mechanism that
// augments any existing topology.
//
// Depth semantics (total hierarchy levels below the root):
//   0 — Sub-agent spawning disabled entirely (root cannot use create_team)
//   1 — Flat fan-out: root spawns Workers (no recursive delegation)
//   2 — Root → Coordinators → Workers (one recursion level)
//   3 — Root → Coordinators → Coordinators → Workers (two recursion levels)
//
// Paper alignment:
//   THREAD (arXiv:2405.17402)  — recursive thread spawning
//   RAH (2026)                 — recursive agent harness architecture
//   RecursiveMAS (arXiv:2604.25917) — latent-space recursion
// ─────────────────────────────────────────────────────────────
export const MAXIMUM_RECURSIVE_SPAWNING_DEPTH = 3;
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
};
export const DEFAULT_THOUGHT_STRUCTURE = THOUGHT_STRUCTURES.CHAIN_OF_THOUGHT;
// ─────────────────────────────────────────────────────────────
// Agentic Loop Defaults — cross-cutting constants shared
// between prism-service harnesses and prism-client settings.
// ─────────────────────────────────────────────────────────────
/** Default maximum tool-call iterations per agentic loop run. */
export const MAX_TOOL_ITERATIONS = 25;
/** Default project identifier for agent conversations and tool labels. */
export const DEFAULT_CODING_PROJECT = "coding";
//# sourceMappingURL=agents.js.map