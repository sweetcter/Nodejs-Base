import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: {
            type: [
                {
                    variantId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'ProductVariant',
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            default: [],
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
