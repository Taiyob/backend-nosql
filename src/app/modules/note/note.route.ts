import express from 'express';
import authMiddleware from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { NoteControllers } from './note.controller';

const router = express.Router();

router.post(
  '/',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  NoteControllers.createNote,
);

router.get(
  '/',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  NoteControllers.getAllNotes,
);

router.get(
  '/:id',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  NoteControllers.getSingleNote,
);

router.patch(
  '/:id',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  NoteControllers.updateNote,
);

router.delete(
  '/:id',
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  NoteControllers.deleteNote,
);

export const NoteRoutes = router;
