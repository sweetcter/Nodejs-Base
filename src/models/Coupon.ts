import { CouponApplyTo, CouponDiscountType, CouponUseFor } from '@/constants/enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
    categoryId?: mongoose.Types.ObjectId | null;
    code: string;
    description?: string;
    applyTo: CouponApplyTo;
    useFor: CouponUseFor;
    discountType: CouponDiscountType;
    discountValue: number;
    minOrderValue: number;
    maxDiscountAmount: number;
    usageLimit: number;
    usagePerUser?: number | null;
    startDate: Date;
    endDate: Date;
    expiredAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const couponSchema = new Schema<ICoupon>(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        code: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        applyTo: {
            type: String,
            enum: Object.values(CouponApplyTo),
            required: true,
        },
        useFor: {
            type: String,
            enum: Object.values(CouponUseFor),
            required: true,
        },
        discountType: {
            type: String,
            enum: Object.values(CouponDiscountType),
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        minOrderValue: {
            type: Number,
            required: true,
        },
        maxDiscountAmount: {
            type: Number,
            required: true,
        },
        usageLimit: {
            type: Number,
            required: true,
        },
        usagePerUser: {
            type: Number,
            default: null,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        expiredAt: {
            type: Date,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

// MODEL
const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
export default Coupon;
