export type EntityType =
  | 'workspace'
  | 'doc_file'
  | 'doc_chunk'
  | 'chat_message'
  | 'workspace_spec'
  | 'code_snippet'
  | 'concept';

export interface EntityMetadata {
  filePath?: string;
  workspace?: string;
  section?: string;
  contentHash?: string;
  updatedAt: string;
}

export interface MemoryEntity {
  id?: string;
  name: string;
  type: EntityType;
  content: string;
  embedding: number[];
  metadata: EntityMetadata;
}

export interface SearchQueryDTO {
  query: string;
  type?: EntityType;
  workspace?: string;
  limit?: number;
}

export interface SearchResultDTO {
  entity: MemoryEntity;
  score: number;
}
