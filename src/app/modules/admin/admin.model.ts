import { model, Schema } from 'mongoose';
import { TAdmin, TName } from './admin.interface';
import { BloodGroup, Gender } from './admin.constant';

const nameSchema = new Schema<TName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
});

const adminSchema = new Schema<TAdmin>(
  {
    id: { type: String, required: [true, 'Id is required'], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      unique: true,
      ref: 'User',
    },
    designation: { type: String, required: [true, 'Designation is required'] },
    name: { type: nameSchema, required: [true, 'Name is required'] },
    gender: {
      type: String,
      enum: { values: Gender, message: '{VALUE} is not a valid gender' },
      required: true,
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroup,
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImage: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  //{ timestamps: true },
  { toJSON: { virtuals: true } },
);

export const Admin = model<TAdmin>('Admin', adminSchema);
