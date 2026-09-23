export const RelationTypes = {
  BELONGS_TO: 'BELONGS_TO',
  REFERENCES: 'REFERENCES',
  DEPENDS_ON: 'DEPENDS_ON',
  NAVIGATES_TO: 'NAVIGATES_TO',
} as const;

export type RelationType = (typeof RelationTypes)[keyof typeof RelationTypes];

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
