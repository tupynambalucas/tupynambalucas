import { Schema, model, type Document, type Types } from 'mongoose';
import type { ICycle } from '@tupynambalucas-hub/core';

export interface ICycleDocument
  extends Omit<ICycle, '_id' | 'products' | 'openingDate' | 'closingDate'>, Document {
  openingDate: Date;
  closingDate: Date;
  products: Types.ObjectId[];
  status?: 'PENDING' | 'OPEN' | 'CLOSED';
}

export const cycleSchema = new Schema<ICycleDocument>(
  {
    description: {
      type: String,
      trim: true,
    },
    openingDate: {
      type: Date,
      required: true,
    },
    closingDate: {
      type: Date,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      // [CORREÇÃO] Removido 'index: true' daqui para evitar conflito com o índice abaixo
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

cycleSchema.virtual('status').get(function () {
  const now = new Date();
  if (now < this.openingDate) return 'PENDING';
  if (now > this.closingDate) return 'CLOSED';
  return 'OPEN';
});

// Índice único para garantir apenas um ciclo ativo por vez
cycleSchema.index(
  { isActive: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
  },
);

export const Cycle = model<ICycleDocument>('Cycle', cycleSchema);
