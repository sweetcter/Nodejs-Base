import { TOKEN } from '@/constants/token';
import mongoose, { Schema } from 'mongoose';

const tokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: [...Object.values(TOKEN)],
            default: TOKEN.REFRESH,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const Token = mongoose.model('Token', tokenSchema);
export default Token;
