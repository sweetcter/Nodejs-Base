import User from '@/models/User';
import { BadRequestError, NotFoundError } from '@/error/customError';
import { uploadSingleFile, removeFile } from '@/utils/cloudinaryUploads';
import APIQuery from '@/helpers/apiQuery';
import _ from 'lodash';

export default class UserService {
    static async createUser(userData: any, file?: Express.Multer.File) {
        const userExist = await User.findOne({ email: userData.email });
        if (userExist) {
            throw new BadRequestError('Email đã tồn tại');
        }

        const user = new User(userData);

        if (file) {
            const upload = await uploadSingleFile(file);
            if (upload) {
                Object.assign(user, { avatar: upload.downloadURL });
            } else {
                throw new BadRequestError('Upload avatar thất bại!');
            }
        }

        await user.save();
        return user;
    }

    static async getAllUsers(query: any, limitParam?: string | number) {
        const limit = limitParam ? Number(limitParam) : 10;

        const feature = new APIQuery(User.find(), query);
        feature.filter().search().sort().limitFields().paginate();

        const [data, totalDocs] = await Promise.all([feature.query, feature.count()]);
        const totalPage = Math.ceil(totalDocs / limit);

        return {
            users: data,
            limit,
            totalDocs,
            totalPage,
        };
    }

    static async getUserDetail(userId: string) {
        const user = await User.findById(userId).lean();
        if (!user) {
            throw new NotFoundError(`Không tìm thấy người dùng với id ${userId}`);
        }
        return user;
    }

    static async updateUser(userId: string, updateData: any, file?: Express.Multer.File) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError(`Không tìm thấy người dùng với id ${userId}`);
        }

        if (_.isMatch(user.toObject(), updateData) && !file) {
            return user;
        }

        Object.assign(user, updateData);

        if (file) {
            const upload = await uploadSingleFile(file);
            if (upload) {
                if (user.avatar) {
                    removeFile(user.avatar);
                }
                user.avatar = upload.downloadURL;
            }
        }

        await user.save();
        return user;
    }

    static async deleteUser(userId: string) {
        const user = await User.findByIdAndUpdate(userId, { isDeleted: true });
        if (!user) {
            throw new NotFoundError(`Không tìm thấy người dùng với id ${userId}`);
        }
        return;
    }
}
