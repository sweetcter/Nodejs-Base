import { BadRequestError } from '@/error/customError';
import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return cb(new BadRequestError('Chỉ chấp nhận những file có đuôi là JPG, JPEG, PNG hoặc WEBP!'));
        }
        cb(null, true);
    },
    limits: { fileSize: 50 * 1024 * 1024 },
});
