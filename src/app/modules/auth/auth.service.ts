import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const loginUserFromDB = async (payLoad: TLoginUser) => {
  const user = await User.isUserExistByCustomId(payLoad?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!!!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!!!');
    }
  }
  const isPasswordMatched = await User.isPasswordMatched(
    payLoad?.password,
    user?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!!!');
  }

  const jwtPayLoad = {
    userId: user?.id,
    userRole: user?.role,
  };
  const accessToken = createToken(
    jwtPayLoad,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayLoad,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePasswordFromDB = async (
  user: JwtPayload,
  payLoad: { oldPassword: string; newPassword: string },
) => {
  const userInfo = await User.isUserExistByCustomId(user?.userId);

  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  const isDeleted = userInfo?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!!!');
  }
  const userStatus = userInfo?.status;
  if (userStatus === 'blocked') {
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!!!');
    }
  }
  const isPasswordMatched = await User.isPasswordMatched(
    payLoad?.oldPassword,
    userInfo?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!!!');
  }

  const newHashedPassword = await bcrypt.hash(
    payLoad?.newPassword,
    Number(config.brypt_salt_rounds),
  );

  const result = await User.findOneAndUpdate(
    {
      id: user?.userId,
      role: user?.userRole,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return result;
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

  const user = await User.isUserExistByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!!!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!!!');
    }
  }

  if (
    user?.passwordChangedAt &&
    User?.isJWTIssuedBeforePasswordChange(
      user?.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const jwtPayLoad = {
    userId: user?.id,
    userRole: user?.role,
  };
  const accessToken = createToken(
    jwtPayLoad,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

const forgetPassword = async (userId: string) => {
  const user = await User.isUserExistByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!!!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!!!');
    }
  }

  const jwtPayLoad = {
    userId: user?.id,
    userRole: user?.role,
  };
  const resetToken = createToken(
    jwtPayLoad,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetLink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;

  sendEmail(user?.email, resetLink);

  //return resetLink;
};

const resetPassword = async (
  payLoad: { id: string; newPassword: string },
  token: string,
) => {
  const user = await User.isUserExistByCustomId(payLoad?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!!!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!!!');
    }
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (payLoad.id !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!!!');
  }

  const newHashedPassword = await bcrypt.hash(
    payLoad?.newPassword,
    Number(config.brypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: decoded?.userId,
      role: decoded?.userRole,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUserFromDB,
  changePasswordFromDB,
  refreshToken,
  forgetPassword,
  resetPassword,
};

// RESET_PASS_UI_LINK=http://localhost:5173
