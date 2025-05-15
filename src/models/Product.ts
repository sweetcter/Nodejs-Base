import { ProductStatus } from '@/constants/enum';
import mongoose, { Schema } from 'mongoose';

const detailInformationSchema = new Schema(
    {
        publisher: { type: Date },
        author: { type: String, required: true },
        pages: { type: Number },
        publication_date: { type: Date },
        physicalAttributes: {
            width: { type: Number },
            height: { type: Number },
            length: { type: Number },
            weight: { type: Number },
        },
    },
    { _id: false },
);

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        rating: {
            type: Number,
        },
        reviewCount: {
            type: Number,
        },
        sold: {
            type: Number,
        },
        status: {
            type: String,
            enum: [...Object.values(ProductStatus)],
            default: ProductStatus.NEW,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        thumbnailRef: {
            type: String,
            required: true,
        },
        library: [
            {
                imageUrl: {
                    type: String,
                    required: true,
                },
                imageRef: {
                    type: String,
                    required: true,
                },
            },
        ],
        isAvailable: {
            type: Boolean,
            default: true,
        },
        detailInformation: {
            type: detailInformationSchema,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            required: true,
        },
        variants: {
            type: [
                {
                    variantId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'ProductVariant',
                    },
                },
            ],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Product = mongoose.model('Product', productSchema);
export default Product;
