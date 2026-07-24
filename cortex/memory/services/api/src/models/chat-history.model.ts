import mongoose, { Schema, type Document } from 'mongoose';
import type { ChatHistorySession } from '@tupynambalucas-cortex-memory/core';

export interface IChatMessageDocument {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatHistoryDocument extends Omit<ChatHistorySession, 'id' | 'messages'>, Document {
  messages: IChatMessageDocument[];
}

const ChatMessageSchema = new Schema<IChatMessageDocument>({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: String, required: true },
});

const ChatHistorySchema = new Schema<ChatHistoryDocument>(
  {
    conversationId: { type: String, required: true, unique: true, index: true },
    agentId: { type: String, required: true, index: true },
    messages: [ChatMessageSchema],
    updatedAt: { type: String, required: true },
  },
  { timestamps: true },
);

export const ChatHistoryModel = mongoose.model<ChatHistoryDocument>(
  'ChatHistory',
  ChatHistorySchema,
);
