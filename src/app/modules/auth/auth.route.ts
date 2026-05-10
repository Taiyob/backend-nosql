import express from 'express';
import validateRequestMiddleware from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validate';
import { AuthControllers } from './auth.controller';
import authMiddleware from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequestMiddleware(AuthValidation.loginValidationAchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  authMiddleware(USER_ROLE.user, USER_ROLE.admin),
  validateRequestMiddleware(AuthValidation.changePasswordValidationAchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequestMiddleware(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/forget-password',
  validateRequestMiddleware(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequestMiddleware(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

export const AuthRouth = router;
