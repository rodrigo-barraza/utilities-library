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
// These mirror the multi-agent topologies at the individual
// agent level: CoT ↔ Sequential, ToT ↔ Hierarchical Parallel,
// GoT ↔ Hierarchical Aggregation (branch → score → synthesize).
// ─────────────────────────────────────────────────────────────
export const REASONING_STRATEGIES = {
    CHAIN_OF_THOUGHT: "chain_of_thought",
    TREE_OF_THOUGHTS: "tree_of_thoughts",
    GRAPH_OF_THOUGHTS: "graph_of_thoughts",
};
export const DEFAULT_REASONING_STRATEGY = REASONING_STRATEGIES.CHAIN_OF_THOUGHT;
//# sourceMappingURL=agents.js.map