import QueryBuilder from '../../builder/QueryBuilder';
import { TNote } from './note.interface';
import { Note } from './note.model';

const createNoteIntoDb = async (payLoad: TNote) => {
  const result = await Note.create(payLoad);
  return result;
};

const getAllNotesFromDb = async (query: Record<string, unknown>, userId?: string, isAdmin?: boolean) => {
  let filter: Record<string, any> = { isDeleted: false };
  
  if (!isAdmin && userId) {
    filter.user = userId;
  }

  const noteQuery = new QueryBuilder(Note.find(filter).populate('user'), query)
    .search(['title', 'content'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await noteQuery.modelQuery;
  return result;
};

const getSingleNoteFromDb = async (id: string) => {
  const result = await Note.findById(id).populate('user');
  return result;
};

const updateNoteInDb = async (id: string, payLoad: Partial<TNote>) => {
  const result = await Note.findByIdAndUpdate(id, payLoad, { new: true });
  return result;
};

const deleteNoteFromDb = async (id: string) => {
  const result = await Note.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

export const NoteServices = {
  createNoteIntoDb,
  getAllNotesFromDb,
  getSingleNoteFromDb,
  updateNoteInDb,
  deleteNoteFromDb,
};
