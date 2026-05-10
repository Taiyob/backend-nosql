import { Schema, model } from 'mongoose';
import { TNote } from './note.interface';

const noteSchema = new Schema<TNote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Indexes
noteSchema.index({ user: 1 });
noteSchema.index({ title: 1 }); // Useful if searching by title

export const Note = model<TNote>('Note', noteSchema);
