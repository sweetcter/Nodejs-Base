import mongoose, { Schema } from 'mongoose';

const vendorSchema = new Schema(
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

const Vendor = mongoose.model('Vendors', vendorSchema);
export default Vendor;
