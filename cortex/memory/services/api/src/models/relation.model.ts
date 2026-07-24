import mongoose, { Schema, type Document } from 'mongoose';
import type { MemoryRelation } from '@tupynambalucas-cortex-memory/core';

export interface RelationDocument extends Omit<MemoryRelation, 'id'>, Document {}

const RelationSchema = new Schema<RelationDocument>(
  {
    fromId: { type: String, required: true, index: true },
    toId: { type: String, required: true, index: true },
    relationType: { type: String, required: true, index: true },
    weight: { type: Number, default: 1.0 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const RelationModel = mongoose.model<RelationDocument>('MemoryRelation', RelationSchema);
