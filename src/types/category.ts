import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
    name: string;
    parentId?: mongoose.Schema.Types.ObjectId;
    level?: number;
    image: string;
    imageUrlRef: string;
    description?: string;
    isDeleted: boolean;
    slug: string;
}
