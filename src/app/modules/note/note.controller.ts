import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NoteServices } from './note.service';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';

const createNote = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await NoteServices.createNoteIntoDb({
    ...req.body,
    user: user._id,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Note created successfully',
    data: result,
  });
});

const getAllNotes = catchAsync(async (req, res) => {
  const { userId, userRole } = req.user;
  const user = await User.findOne({ id: userId });
  
  const result = await NoteServices.getAllNotesFromDb(
    req.query,
    user?._id.toString(),
    userRole === 'admin'
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notes retrieved successfully',
    data: result,
  });
});

const getSingleNote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId, userRole } = req.user;
  
  const result = await NoteServices.getSingleNoteFromDb(id);
  
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Note not found');
  }

  // RBAC: Check if owner or admin
  const user = await User.findOne({ id: userId });
  if (userRole !== 'admin' && result.user._id.toString() !== user?._id.toString()) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized to view this note');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Note retrieved successfully',
    data: result,
  });
});

const updateNote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId, userRole } = req.user;
  
  const note = await NoteServices.getSingleNoteFromDb(id);
  if (!note) {
    throw new AppError(httpStatus.NOT_FOUND, 'Note not found');
  }

  const user = await User.findOne({ id: userId });
  if (userRole !== 'admin' && note.user._id.toString() !== user?._id.toString()) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized to update this note');
  }

  const result = await NoteServices.updateNoteInDb(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Note updated successfully',
    data: result,
  });
});

const deleteNote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId, userRole } = req.user;
  
  const note = await NoteServices.getSingleNoteFromDb(id);
  if (!note) {
    throw new AppError(httpStatus.NOT_FOUND, 'Note not found');
  }

  const user = await User.findOne({ id: userId });
  if (userRole !== 'admin' && note.user._id.toString() !== user?._id.toString()) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized to delete this note');
  }

  const result = await NoteServices.deleteNoteFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Note deleted successfully',
    data: result,
  });
});

export const NoteControllers = {
  createNote,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
