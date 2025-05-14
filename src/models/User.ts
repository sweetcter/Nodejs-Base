import { ROLE } from '@/constants/allowRoles';
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
        },
        address: {
            type: String,
        },
        role: {
            type: String,
            enum: Object.values(ROLE),
            default: ROLE.USER,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const User = mongoose.model('Users', userSchema);
export default User;
