import mongoose from 'mongoose';

export interface IFormat extends mongoose.Document {
    name: string;
}
