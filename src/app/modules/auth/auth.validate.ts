import { z } from 'zod';

const loginValidationAchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const changePasswordValidationAchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required' }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User ID must be required' }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User ID must be required' }),
    newPassword: z.string({ required_error: 'New PASSWORD must be required' }),
  }),
});

export const AuthValidation = {
  loginValidationAchema,
  changePasswordValidationAchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
