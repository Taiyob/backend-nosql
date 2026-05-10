import express from 'express';
import { PostControllers } from './post.controller';
import authMiddleware from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.createPost,
);

router.get(
  '/',
  PostControllers.getAllPosts,
);

router.get(
  '/user-posts/:userId',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.getUserPosts,
);

router.patch(
  '/:id',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.updatePost,
);

router.delete(
  '/:id',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.deletePost,
);

export const PostRoutes = router;
