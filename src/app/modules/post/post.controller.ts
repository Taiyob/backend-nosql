import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';
import { User } from '../user/user.model';
import { Post } from './post.model';
import AppError from '../../errors/AppError';

const createPost = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ id: userId });
  
  const result = await PostServices.createPostIntoDb({
    ...req.body,
    user: user?._id,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});

const getUserPosts = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await PostServices.getUserPostsFromDb(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User posts retrieved successfully using $lookup',
    data: result,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPostsFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All posts retrieved successfully',
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId, userRole } = req.user;

  const post = await Post.findById(id);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const user = await User.findOne({ id: userId });
  if (
    /* userRole !== 'admin' && */ post.user._id.toString() !==
    user?._id.toString()
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to update this post',
    );
  }

  const result = await PostServices.updatePostInDb(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated successfully',
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId, userRole } = req.user;

  const post = await Post.findById(id);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const user = await User.findOne({ id: userId });
  if (
    /* userRole !== 'admin' && */ post.user._id.toString() !==
    user?._id.toString()
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to delete this post',
    );
  }

  await PostServices.deletePostFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post deleted successfully',
    data: null,
  });
});

export const PostControllers = {
  createPost,
  getUserPosts,
  getAllPosts,
  updatePost,
  deletePost,
};
