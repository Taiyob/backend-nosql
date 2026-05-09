//import StudentValidateSchema from '../student/student.validate';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await UserServices.createAdminIntoDb(password, admin);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const changeStatusFromDB = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status changes successfully',
    data: result,
  });
});

// const getMeFromDB = catchAsync(async (req, res) => {
//   const token = req.headers.authorization;
//   if (!token) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Token not found!!!');
//   }
//   const result = await UserServices.getMe(token);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'My account details retreived successfully',
//     data: result,
//   });
// });

const getMeFromDB = catchAsync(async (req, res) => {
  const { userId, userRole } = req.user;
  const result = await UserServices.getMe(userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My account details retrieved successfully',
    data: result,
  });
});

export const UserController = {
  createAdmin,
  getMeFromDB,
  changeStatusFromDB,
};
