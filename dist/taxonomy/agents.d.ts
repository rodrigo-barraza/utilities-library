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
    readonly TOURNAMENT: "tournament";
    readonly CRITIC_LOOP: "critic_loop";
    readonly DIVIDE_AND_CONQUER: "divide_and_conquer";
    readonly MCTS: "mcts";
};
export type TopologyType = (typeof TOPOLOGIES)[keyof typeof TOPOLOGIES];
export declare const DEFAULT_TOPOLOGY: "hierarchical";
export declare const MAXIMUM_RECURSIVE_SPAWNING_DEPTH = 3;
export declare const DEFAULT_RECURSIVE_SPAWNING_DEPTH = 1;
export declare const THOUGHT_STRUCTURES: {
    readonly CHAIN_OF_THOUGHT: "chain_of_thought";
    readonly TREE_OF_THOUGHTS: "tree_of_thoughts";
    readonly GRAPH_OF_THOUGHTS: "graph_of_thoughts";
};
export type ThoughtStructureType = (typeof THOUGHT_STRUCTURES)[keyof typeof THOUGHT_STRUCTURES];
export declare const DEFAULT_THOUGHT_STRUCTURE: "chain_of_thought";
//# sourceMappingURL=agents.d.ts.map