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
export declare const MAXIMUM_RECURSIVE_SPAWNING_DEPTH = 10;
export declare const DEFAULT_RECURSIVE_SPAWNING_DEPTH = 1;
export declare const THOUGHT_STRUCTURES: {
    readonly CHAIN_OF_THOUGHT: "chain_of_thought";
    readonly TREE_OF_THOUGHTS: "tree_of_thoughts";
    readonly GRAPH_OF_THOUGHTS: "graph_of_thoughts";
};
export type ThoughtStructureType = (typeof THOUGHT_STRUCTURES)[keyof typeof THOUGHT_STRUCTURES];
export declare const DEFAULT_THOUGHT_STRUCTURE: "chain_of_thought";
/** Default maximum tool-call iterations per agentic loop run. */
export declare const MAX_TOOL_ITERATIONS = 25;
/** Default project identifier for agent conversations and tool labels. */
export declare const DEFAULT_CODING_PROJECT = "coding";
export declare const SYSTEM_STATUSES: {
    readonly RUNNING: "running";
    readonly IN_PROGRESS: "in_progress";
    readonly PENDING: "pending";
    readonly FAILED: "failed";
    readonly STOPPED: "stopped";
    readonly COMPLETE: "complete";
    readonly COMPLETED: "completed";
    readonly SUCCESS: "success";
    readonly DONE: "done";
    readonly IDLE: "idle";
    readonly ACTIVE: "active";
    readonly CANCELLED: "cancelled";
    readonly ERROR: "error";
    readonly WARNING: "warning";
};
export type SystemStatus = (typeof SYSTEM_STATUSES)[keyof typeof SYSTEM_STATUSES];
export declare const MESSAGE_ROLES: {
    readonly USER: "user";
    readonly ASSISTANT: "assistant";
    readonly SYSTEM: "system";
    readonly TOOL: "tool";
};
export type MessageRole = (typeof MESSAGE_ROLES)[keyof typeof MESSAGE_ROLES];
export declare const APPROVAL_STATUS: {
    readonly PENDING: "pending";
    readonly APPROVED: "approved";
    readonly REJECTED: "rejected";
};
export type ApprovalStatusType = (typeof APPROVAL_STATUS)[keyof typeof APPROVAL_STATUS];
//# sourceMappingURL=agents.d.ts.map