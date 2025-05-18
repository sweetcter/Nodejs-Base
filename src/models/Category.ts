import slugMiddleware from '@/middlewares/generateSlugMidleware';
import { ICategory } from '@/types/category';
import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema<ICategory>(
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
        image: {
            type: String,
        },
        imageUrlRef: {
            type: String,
        },
        description: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        slug: { type: String, unique: true },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

categorySchema.plugin(slugMiddleware('name', 'slug'));

const Category = mongoose.model('Category', categorySchema);
export default Category;
