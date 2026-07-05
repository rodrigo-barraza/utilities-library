export type NodeCategory = "session" | "tool" | "request" | "user" | "project" | "agent" | "subagent" | "turn";
export interface GraphNode {
    id: string;
    label: string;
    category: NodeCategory;
    radius: number;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    sequenceNumber?: number;
    metadata?: Record<string, unknown>;
    depth?: number;
}
export interface GraphEdge {
    source: string;
    target: string;
    strength?: number;
    isCurved?: boolean;
}
export interface SubAgentTreeNode {
    nodeId: string;
    agentConversationId: string;
    children: SubAgentTreeNode[];
}
export interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
    subAgentTree: SubAgentTreeNode[];
}
//# sourceMappingURL=graph.d.ts.map