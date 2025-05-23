import { Discount as DiscountEnum } from '@/constants/enum';
import mongoose, { Schema } from 'mongoose';

const discountSchema = new Schema(
    {
        discountType: {
            type: String,
            enum: Object.values(DiscountEnum),
            default: DiscountEnum.PERCENT,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const Discount = mongoose.model('Discount', discountSchema);
export default Discount;
