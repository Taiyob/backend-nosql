import { Types } from 'mongoose';

export interface TPost {
  title: string;
  content: string;
  user: Types.ObjectId;
}
