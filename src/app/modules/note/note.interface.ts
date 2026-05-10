import { Types } from 'mongoose';

export interface TNote {
  title: string;
  content: string;
  user: Types.ObjectId;
  isDeleted: boolean;
}
