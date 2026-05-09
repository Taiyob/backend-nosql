import express from 'express';
import { UserController } from './user.controller';
import validateRequestMiddleware from '../../middlewares/validateRequest';
import { AdminValidation } from '../admin/admin.validate';
import authMiddleware from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';

const router = express.Router();

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
  authMiddleware(USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.student),
  UserController.getMeFromDB,
);

export const UserRoutes = router;
