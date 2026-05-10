import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AdminRoute } from '../modules/admin/admin.route';
import { AuthRouth } from '../modules/auth/auth.route';
import { NoteRoutes } from '../modules/note/note.route';
import { PostRoutes } from '../modules/post/post.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoute,
  },
  {
    path: '/auth',
    route: AuthRouth,
  },
  {
    path: '/notes',
    route: NoteRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
