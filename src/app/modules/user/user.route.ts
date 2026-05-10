import express from 'express';
import { UserController } from './user.controller';
import validateRequestMiddleware from '../../middlewares/validateRequest';
import { AdminValidation } from '../admin/admin.validate';
import authMiddleware from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequestMiddleware(UserValidation.userValidationSchema),
  UserController.createUser,
);

router.post(
  '/create-admin',
  //authMiddleware(USER_ROLE.admin),
  validateRequestMiddleware(AdminValidation.createAdminValidationSchema),
  UserController.createAdmin,
);

router.post(
  '/change-status/:id',
  authMiddleware(USER_ROLE.admin),
  validateRequestMiddleware(UserValidation.changeStatusValidationSchema),
  UserController.changeStatusFromDB,
);

router.get(
  '/me',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  UserController.getMeFromDB,
);

router.get(
  '/grouped-interests',
  authMiddleware(USER_ROLE.admin),
  UserController.getGroupedInterests,
);

router.get(
  '/',
  authMiddleware(USER_ROLE.admin),
  UserController.getAllUsers,
);

router.delete(
  '/:id',
  authMiddleware(USER_ROLE.admin),
  UserController.deleteUser,
);

export const UserRoutes = router;
