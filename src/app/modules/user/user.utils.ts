import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

export const generateStudentId = async (payLoad: TAcademicSemester) => {
  let currentId = (0).toString();

  const lastStudentId = await findLastStudentId();
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);

  const currentStudentSemesterYear = payLoad.year;
  const currentStudentSemesterCode = payLoad.code;

  if (
    lastStudentId &&
    lastStudentSemesterYear === currentStudentSemesterYear &&
    lastStudentSemesterCode === currentStudentSemesterCode
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payLoad.year}${payLoad.code}${incrementId}`;

  return incrementId;
};

const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastFaculty?.id ? lastFaculty?.id?.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = Number(currentId + 1)
    .toString()
    .padStart(4, '0');
  incrementId = `F-${incrementId}`;

  return incrementId;
};

const findLastAdminId = async () => {
  const lastAdmin = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastAdmin?.id ? lastAdmin?.id?.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `A-${incrementId}`;

  return incrementId;
};

const findLastUserId = async () => {
  const lastUser = await User.findOne({ role: 'user' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastUser?.id ? lastUser?.id?.substring(2) : undefined;
};

export const generateUserId = async () => {
  let currentId = (0).toString();
  const lastUserId = await findLastUserId();

  if (lastUserId) {
    currentId = lastUserId;
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `U-${incrementId}`;

  return incrementId;
};
