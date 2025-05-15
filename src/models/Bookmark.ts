import mongoose, { Schema } from 'mongoose';

const bookmarkSchema = new Schema(
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
        note: {
            type: String,
        },
    },
    {
        versionKey: false,
        timestamps: false,
    },
);

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
