import IProductVariant from '@/types/variant';
import mongoose, { Schema } from 'mongoose';

const variantSchema = new Schema<IProductVariant>(
    {
        image: {
            type: String,
        },
        imageUrlRef: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        discountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Discount',
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        formatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Format',
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const ProductVariant = mongoose.model('ProductVariant', variantSchema);
export default ProductVariant;
