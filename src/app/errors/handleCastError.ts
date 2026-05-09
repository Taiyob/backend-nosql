import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSource = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  return {
    statusCode,
    message: 'Cast error(Invalid ID)',
    errorSources,
  };
};

export default handleCastError;
