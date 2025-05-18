import cloudinary from '@/config/cloudinary.config';
import streamifier from 'streamifier';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export const uploadSingleFile = (
    file: Express.Multer.File,
    folder?: string,
): Promise<{ downloadURL: string; urlRef: string; originNames: string[] }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: folder || 'bookstore', resource_type: 'auto' },

            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (result)
                    resolve({
                        downloadURL: result.secure_url,
                        urlRef: result.public_id,
                        originNames: [file.originalname],
                    });
                else reject(error);
            },
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

export const removeFile = async (publicId: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
};
