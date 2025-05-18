import { v2 as cloudinary } from 'cloudinary';
import config from './env.config';

cloudinary.config({
    cloud_name: config.cloudinary.cloudinaryCloudName,
    api_key: config.cloudinary.cloudinaryApiKey,
    api_secret: config.cloudinary.cloudinaryApiSecret,
});

export default cloudinary;
