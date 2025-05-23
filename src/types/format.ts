import mongoose, { Types } from 'mongoose';

export interface IFormat extends mongoose.Document {
    _id: Types.ObjectId;
    name: string;
}
