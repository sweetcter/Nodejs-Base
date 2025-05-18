import mongoose from 'mongoose';

export interface IVendor extends mongoose.Document {
    name: string;
    description?: string;
}
