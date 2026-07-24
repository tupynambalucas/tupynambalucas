export interface MemoryRelation {
  id?: string;
  fromId: string;
  toId: string;
  relationType: string;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface GraphDataDTO {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    workspace?: string;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label: string;
  }>;
}
