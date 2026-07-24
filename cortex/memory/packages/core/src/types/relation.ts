export interface MemoryRelation {
  id?: string;
  fromId: string;
  toId: string;
  relationType: string;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  workspace?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface GraphDataDTO {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
