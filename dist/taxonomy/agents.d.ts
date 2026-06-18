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
/** Reusable synthetic "Agentless" agent object for UI agent pickers. */
export declare const AGENTLESS_AGENT: {
    readonly id: "NONE";
    readonly name: "Agentless";
};
export declare const TOPOLOGIES: {
    readonly HIERARCHICAL: "hierarchical";
    readonly HIERARCHICAL_AGGREGATION: "hierarchical_aggregation";
    readonly SEQUENTIAL: "sequential";
    readonly PEER_TO_PEER: "peer_to_peer";
};
export type TopologyType = (typeof TOPOLOGIES)[keyof typeof TOPOLOGIES];
export declare const DEFAULT_TOPOLOGY: "hierarchical";
export declare const REASONING_STRATEGIES: {
    readonly CHAIN_OF_THOUGHT: "chain_of_thought";
    readonly TREE_OF_THOUGHTS: "tree_of_thoughts";
};
export type ReasoningStrategyType = (typeof REASONING_STRATEGIES)[keyof typeof REASONING_STRATEGIES];
export declare const DEFAULT_REASONING_STRATEGY: "chain_of_thought";
//# sourceMappingURL=agents.d.ts.map