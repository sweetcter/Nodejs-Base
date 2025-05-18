import { IVendor } from '@/types/vendor';
import mongoose, { Schema } from 'mongoose';

const vendorSchema = new Schema<IVendor>(
    {
        name: {
            type: String,
            required: true,
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

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
