//import StudentValidateSchema from '../student/student.validate';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createUser = catchAsync(async (req, res) => {
  const { password, user: userData } = req.body;
  const result = await UserServices.createUserIntoDb(password, userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

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

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getGroupedInterests = catchAsync(async (req, res) => {
  const result = await UserServices.getGroupedInterests();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users grouped by interests retrieved successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  createAdmin,
  getMeFromDB,
  changeStatusFromDB,
  getAllUsers,
  getGroupedInterests,
  deleteUser,
};
