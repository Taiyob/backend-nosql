import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AdminRoute } from '../modules/admin/admin.route';
import { AuthRouth } from '../modules/auth/auth.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
