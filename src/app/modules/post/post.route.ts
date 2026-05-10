import express from 'express';
import { PostControllers } from './post.controller';
import authMiddleware from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/user-posts/:userId',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.getUserPosts,
);

export const PostRoutes = router;
