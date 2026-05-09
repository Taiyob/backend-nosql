/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateAdminId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

const createAdminIntoDb = async (password: string, payLoad: TAdmin) => {
  const userData: Partial<TUser> = {};

  if (!password) {
    userData.password = config.default_password as string;
  } else {
    userData.password = password;
  }

  userData.role = 'admin';
  userData.email = payLoad.email;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    userData.id = await generateAdminId();
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    payLoad.id = newUser[0].id;
    payLoad.user = newUser[0]._id;
    const newAdmin = await Admin.create([payLoad], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

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
  let result = null;

  if (userRole === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  return result;
};

export const UserServices = {
  createAdminIntoDb,
  getMe,
  changeStatus,
};
