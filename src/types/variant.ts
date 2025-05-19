import mongoose, { Schema } from 'mongoose';

export interface IProductVariant extends mongoose.Document {
    image?: string;
    imageUrlRef?: string;
    price: number;
    stock: number;
    discountId?: Schema.Types.ObjectId;
    productId: Schema.Types.ObjectId;
    formatId: Schema.Types.ObjectId;
    imageRef: string;
}

export default IProductVariant;
