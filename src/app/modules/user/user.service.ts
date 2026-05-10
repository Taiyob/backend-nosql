/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateAdminId, generateUserId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createUserIntoDb = async (password: string, payload: Partial<TUser>) => {
  const userData: Partial<TUser> = { ...payload };

  if (!password) {
    userData.password = config.default_password as string;
  } else {
    userData.password = password;
  }

  userData.role = 'user';
  userData.id = await generateUserId();

  const result = await User.create(userData);
  return result;
};

const createAdminIntoDb = async (password: string, payLoad: TAdmin) => {
  const userData: Partial<TUser> = {};

  if (!password) {
    userData.password = config.default_password as string;
  } else {
    userData.password = password;
  }

  userData.role = 'admin';
  userData.email = payLoad.email;

  // const session = await mongoose.startSession();
  try {
    // session.startTransaction();

    userData.id = await generateAdminId();
    const newUser = await User.create(userData); // Changed from [userData] with session
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    payLoad.id = newUser.id;
    payLoad.user = newUser._id;
    const newAdmin = await Admin.create(payLoad); // Changed from [payLoad] with session
    if (!newAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    // await session.commitTransaction();
    // await session.endSession();

    return newAdmin;
  } catch (error: any) {
    // await session.abortTransaction();
    // await session.endSession();

    throw new Error(error);
  }
};

const changeStatus = async (id: string, payLoad: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payLoad, { new: true });

  return result;
};

// const getMe = async (token: string) => {
//   const decoded = verifyToken(token, config.jwt_access_secret as string);
//   const { userId, userRole } = decoded;
//   let result = null;
//   if (userRole === 'student') {
//     result = await Student.findOne({ id: userId });
//   }
//   if (userRole === 'admin') {
//     result = await Admin.findOne({ id: userId });
//   }
//   if (userRole === 'faculty') {
//     result = await Faculty.findOne({ id: userId });
//   }

//   return result;
// };

const getMe = async (userId: string, userRole: string) => {
  let result: any = null;

  if (userRole === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user').lean();
    if (result && result.user) {
      // Merge user role and status into the admin result for frontend compatibility
      result.role = result.user.role;
      result.status = result.user.status;
    }
  } else {
    result = await User.findOne({ id: userId }).lean();
  }

  return result;
};

const getAllUsersFromDb = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(['email', 'id'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  return result;
};

const getGroupedInterests = async () => {
  const result = await User.aggregate([
    { $unwind: '$interests' },
    {
      $group: {
        _id: '$interests',
        users: { $push: { id: '$id', email: '$email' } },
        count: { $sum: 1 },
      },
    },
  ]);
  return result;
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

export const UserServices = {
  createUserIntoDb,
  createAdminIntoDb,
  getMe,
  changeStatus,
  getAllUsersFromDb,
  getGroupedInterests,
  deleteUser,
};
