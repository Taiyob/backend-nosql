import { Schema, model } from 'mongoose';
import { TPost } from './post.interface';

const postSchema = new Schema<TPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

// Indexing
postSchema.index({ user: 1 });

export const Post = model<TPost>('Post', postSchema);
