import { Schema, model, type Document } from 'mongoose';
import type { IProduct } from '@tupynambalucas-hub/core';

export type IProductDocument = Omit<IProduct, '_id'> & Document;

export const productSchema = new Schema<IProductDocument>(
  {
    // CORREÇÃO: Removemos 'unique: true' daqui. Nomes podem se repetir se outras propriedades mudarem.
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    measure: {
      value: { type: Schema.Types.Mixed, required: true },
      type: { type: String, required: true },
      minimumOrder: {
        type: { type: String },
        value: { type: Schema.Types.Mixed },
      },
    },
    content: {
      value: { type: Number },
      unit: { type: String, enum: ['g', 'kg', 'ml', 'L'] },
    },
    available: { type: Boolean, default: false },
  },
  { timestamps: true },
);

productSchema.index(
  {
    name: 1,
    category: 1,
    'measure.type': 1,
    'content.value': 1,
    'content.unit': 1,
  },
  { unique: true },
);

export const Product = model<IProductDocument>('Product', productSchema);
