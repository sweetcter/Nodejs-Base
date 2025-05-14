import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        level: {
            type: Number,
            default: 1,
        },
        imageUrl: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const User = mongoose.model('Categories', categorySchema);
export default User;
