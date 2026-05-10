import { User } from '../user/user.model';
import { Post } from './post.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { TPost } from './post.interface';

const getUserPostsFromDb = async (userId: string) => {
  const result = await User.aggregate([
    {
      $match: { id: userId },
    },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'user',
        as: 'posts',
      },
    },
  ]);
  return result;
};

const getAllPostsFromDb = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find().populate('user'), query)
    .search(['title', 'content'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  return result;
};

const createPostIntoDb = async (payload: TPost) => {
  const result = await Post.create(payload);
  return result;
};

const updatePostInDb = async (id: string, payload: Partial<TPost>) => {
  const result = await Post.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deletePostFromDb = async (id: string) => {
  const result = await Post.findByIdAndDelete(id);
  return result;
};

export const PostServices = {
  getUserPostsFromDb,
  getAllPostsFromDb,
  createPostIntoDb,
  updatePostInDb,
  deletePostFromDb,
};
