import mongoose, { Schema } from 'mongoose';

const variantSchema = new Schema(
    {
        imageUrl: {
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
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
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
