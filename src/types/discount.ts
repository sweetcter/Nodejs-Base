import mongoose from 'mongoose';

export interface IDiscount extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    discountType: string;
    discountValue: number;
    startDate: Date;
    endDate: Date;
}
