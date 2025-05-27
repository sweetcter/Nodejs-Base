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
            enum: ['email', 'google'],
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        phoneNumber: {
            type: String,
            match: /^[0-9]{10}$/,
        },
        password: {
            type: String,
            select: false,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

accountSchema.index({ email: 1, provider: 1 }, { unique: true });

const Account = mongoose.model('Account', accountSchema);
export default Account;
