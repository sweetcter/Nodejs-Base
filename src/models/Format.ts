import { IFormat } from '@/types/format';
import mongoose, { Schema } from 'mongoose';

const formatSchema = new Schema<IFormat>(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const Format = mongoose.model('Format', formatSchema);
export default Format;
