import config from '@/config/env.config';
import { ROLE } from '@/constants/allowRoles';
import mongoose, { Schema } from 'mongoose';
import Cart from './Cart';

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
        phoneNumber: {
            type: String,
        },
        role: {
            type: String,
            enum: Object.values(ROLE),
            default: ROLE.USER,
        },
        address: {
            type: String,
        },
        avatar: {
            type: String,
        },
        userCoupon: {
            type: [
                {
                    userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                    },
                    couponId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Coupon',
                        required: true,
                    },
                    stock: {
                        type: Number,
                        required: true,
                    },
                },
            ],
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

userSchema.pre('save', async function (next) {
    if (this.isNew) {
        const host = config.host || 'http://localhost:8000';
        this.avatar = `${host}/images/anhdd.png`;
        await Cart.create({ userId: this._id });
    }
    next();
});

const User = mongoose.model('User', userSchema);
export default User;
