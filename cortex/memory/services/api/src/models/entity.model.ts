import mongoose, { Schema, type Document } from 'mongoose';
import type { MemoryEntity } from '@tupynambalucas-cortex-memory/core';

export interface EntityDocument extends Omit<MemoryEntity, 'id'>, Document {}

const EntitySchema = new Schema<EntityDocument>(
  {
    name: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: [
        'workspace',
        'doc_file',
        'doc_chunk',
        'chat_message',
        'workspace_spec',
        'code_snippet',
        'concept',
      ],
      required: true,
      index: true,
    },
    content: { type: String, required: true },
    embedding: { type: [Number], required: true },
    metadata: {
      filePath: { type: String },
      workspace: { type: String, index: true },
      section: { type: String },
      contentHash: { type: String, index: true },
      updatedAt: { type: String, required: true },
    },
  },
  { timestamps: true },
);

export const EntityModel = mongoose.model<EntityDocument>('MemoryEntity', EntitySchema);
