import express from 'express';
import { AdminControllers } from './admin.controller';
import validateRequestMiddleware from '../../middlewares/validateRequest';
import { AdminValidation } from './admin.validate';

const router = express.Router();

router.get('/', AdminControllers.getAllFAdmins);

router.get('/:adminId', AdminControllers.getSingleAdmin);

router.patch(
  '/:adminId',
  validateRequestMiddleware(AdminValidation.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:adminId', AdminControllers.deleteAdmin);

export const AdminRoute = router;
