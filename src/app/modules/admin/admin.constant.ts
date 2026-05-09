import { TBloodGroup, TGender } from './admin.interface';

export const Gender: TGender[] = ['male', 'female', 'other'];

export const BloodGroup: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'A+',
  'O+',
  'O-',
];

export const AdminSearchableFields = [
  'designation',
  'email',
  'id',
  'contactNo',
  'emergencyContactNo',
  'name.firstName',
  'name.middleName',
  'name.lastName',
  'isDeleted',
];
