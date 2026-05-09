import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const authMiddleware = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }

    const { userId, userRole, iat } = decoded;

    const user = await User.isUserExistByCustomId(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
    }
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'This user is already deleted!!!',
      );
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

    //const role = decoded.role;
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default authMiddleware;
