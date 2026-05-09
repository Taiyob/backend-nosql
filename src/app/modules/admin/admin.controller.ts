import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const getAllFAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Admins retrived successfully',
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single admin retrived successfully',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const { admin } = req.body;
  const result = await AdminServices.updateAdminFromDB(adminId, admin);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update Admin successfully',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const result = await AdminServices.deleteAdminFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin deleted successfully',
    data: result,
  });
});

export const AdminControllers = {
  getAllFAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
