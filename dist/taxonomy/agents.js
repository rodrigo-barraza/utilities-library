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
// Reasoning Strategies — single-agent reasoning loop modes.
//
// Strategy → Topology mapping (strategies are per-agent;
// topologies are multi-agent orchestration patterns):
//
// Single-agent strategies (enum values below):
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
export const REASONING_STRATEGIES = {
    CHAIN_OF_THOUGHT: "chain_of_thought",
    TREE_OF_THOUGHTS: "tree_of_thoughts",
    GRAPH_OF_THOUGHTS: "graph_of_thoughts",
};
export const DEFAULT_REASONING_STRATEGY = REASONING_STRATEGIES.CHAIN_OF_THOUGHT;
//# sourceMappingURL=agents.js.map