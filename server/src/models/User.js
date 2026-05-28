import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['guest', 'host', 'admin'],
      default: 'guest',
      index: true,
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

userSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    role: this.role,
    bio: this.bio,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model('User', userSchema);
