import { ProductStatus } from '@/constants/enum';
import mongoose, { Schema } from 'mongoose';
interface ProductImage {
    imageUrl: string;
    imageRef: string;
}

interface ProductVariant {
    variantId: Schema.Types.ObjectId;
}
interface VariantFormat {
    formatId: Schema.Types.ObjectId;
}

interface PhysicalAttributes {
    width: number;
    heigh: number;
    length: number;
    weight: number;
}

interface DetailInformation {
    publisher: Date;
    author: string;
    pages: number;
    publicationDate: Date;
    physicalAttributes: PhysicalAttributes;
}

export interface IProduct extends mongoose.Document {
    name: string;
    description?: string;
    rating: number;
    reviewCount: number;
    sold: number;
    status: ProductStatus;
    thumbnail?: string;
    thumbnailRef?: string;
    library?: ProductImage[];
    isAvailable: boolean;
    detailInformation: DetailInformation;
    categoryId: Schema.Types.ObjectId;
    vendorId: Schema.Types.ObjectId;
    variants: ProductVariant[];
    variantFormats: VariantFormat[];
}

export default IProduct;
