import mongoose from 'mongoose';
import { User } from '../user/user.model';

const getUserPostsFromDb = async (userId: string) => {
  const result = await User.aggregate([
    {
      $match: { id: userId },
    },
    {
      $lookup: {
        from: 'posts', // The collection name for Post model (usually pluralized)
        localField: '_id',
        foreignField: 'user',
        as: 'posts',
      },
    },
  ]);
  return result;
};

export const PostServices = {
  getUserPostsFromDb,
};
