import mongoose, { Schema } from 'mongoose';

const accountSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: String,
      enum: ['email', 'phone', 'google'], //phan provider theo nhu cau
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },

    isVerified: {
    type: Boolean,
    default: false,
    },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Account = mongoose.model('Account', accountSchema);
export default Account;
