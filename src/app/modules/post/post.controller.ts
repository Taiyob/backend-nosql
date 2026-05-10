import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

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

export const PostControllers = {
  getUserPosts,
};
