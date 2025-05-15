import mongoose, { Schema } from 'mongoose';

const usedCouponSchema = new Schema(
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
        count: {
            type: Number,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

usedCouponSchema.index({ userId: 1, couponId: 1 }, { unique: true });

const UsedCoupon = mongoose.model('UsedCoupon', usedCouponSchema);
export default UsedCoupon;
