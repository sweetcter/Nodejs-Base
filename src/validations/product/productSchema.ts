import Joi from 'joi';
import { Types } from 'mongoose';

export const createProductSchema = Joi.object({
    name: Joi.string().min(3).max(100).trim().required().messages({
        'string.empty': 'Tên sản phẩm không được để trống',
        'any.required': 'Tên sản phẩm là bắt buộc',
        'string.base': 'Tên sản phẩm phải là chuỗi',
        'string.min': 'Tên sản phẩm phải lớn hơn hoặc bằng 3 ký tự',
        'string.max': 'Tên sản phẩm phải nhỏ hơn 100 ký tự',
    }),
    categoryId: Joi.string()
        .optional()
        .custom((value, helpers) => {
            if (value && !Types.ObjectId.isValid(value)) {
                return helpers.error('string.objectId');
            }
            return value;
        })
        .messages({
            'string.objectId': 'ParentId phải là ObjectId hợp lệ',
        }),
    vendorId: Joi.string()
        .optional()
        .custom((value, helpers) => {
            if (value && !Types.ObjectId.isValid(value)) {
                return helpers.error('string.objectId');
            }
            return value;
        })
        .messages({
            'string.objectId': 'ParentId phải là ObjectId hợp lệ',
        }),
    description: Joi.string().max(1000).trim().optional().allow('').messages({
        'string.base': 'Mô tả phải là chuỗi',
        'string.max': 'Mô tả phải nhỏ hơn 1000 ký tự',
    }),
});
