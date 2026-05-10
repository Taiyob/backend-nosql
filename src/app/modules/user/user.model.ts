import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: { type: String, enum: ['admin', 'user'] },
    interests: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ id: 1 });
userSchema.index({ role: 1 });
userSchema.index({ interests: 1 });

// pre save middleware/hook  :will work on create() and save() method
userSchema.pre('save', async function (next) {
  //hashing password and save into DB
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.brypt_salt_rounds),
  );
  next();
});

// post save middleware/hook
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangeTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangeTime = new Date(passwordChangeTimestamp).getTime() / 1000;

  return passwordChangeTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
