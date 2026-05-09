import { z } from 'zod';
import { BloodGroup } from './admin.constant';

const createNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(20)
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'First name must be start a capital letter',
    }),
  middleName: z.string().min(0).max(20).optional(),
  lastName: z.string().min(1).max(20),
});

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    admin: z.object({
      designation: z.string(),
      name: createNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImage: z.string().optional(),
    }),
  }),
});

const updateNameValidationSchema = z.object({
  firstName: z.string().min(3).max(30).optional(),
  middleName: z.string().min(3).max(30).optional(),
  lastName: z.string().min(3).max(30).optional(),
});

const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      designation: z.string().optional(),
      name: updateNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      profileImage: z.string().optional().optional(),
    }),
  }),
});

export const AdminValidation = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
