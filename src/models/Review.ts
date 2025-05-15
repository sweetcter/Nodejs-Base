import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        variants: {
            type: {
                variantId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ProductVariant',
                    required: true,
                },
                name: {
                    type: String,
                },
                format: {
                    type: String,
                },
            },
        },

        rating: {
            type: Number,
            required: true,
        },

        content: {
            type: String,
        },
    },
    {
        versionKey: false,
        timestamps: false,
    },
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
