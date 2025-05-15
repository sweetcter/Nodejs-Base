import { Discount } from '@/constants/enum';
import mongoose, { Schema } from 'mongoose';

const variantSchema = new Schema(
    {
        discountType: {
            type: String,
            enum: [...Object.values(Discount)],
            default: Discount.PERCENT,
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

const ProductVariant = mongoose.model('ProductVariant', variantSchema);
export default ProductVariant;
