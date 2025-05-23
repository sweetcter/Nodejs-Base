import Joi from 'joi';
import { Types } from 'mongoose';

export const createProductVariantSchema = Joi.object({
    name: Joi.string().min(3).max(100).trim().required().messages({
        'string.empty': 'Tên sản phẩm không được để trống',
        'any.required': 'Tên sản phẩm là bắt buộc',
        'string.base': 'Tên sản phẩm phải là chuỗi',
        'string.min': 'Tên sản phẩm phải lớn hơn hoặc bằng 3 ký tự',
        'string.max': 'Tên sản phẩm phải nhỏ hơn 100 ký tự',
    }),
    price: Joi.number().integer().required().messages({
        'number.integer': 'Cấp độ phải là số nguyên',
        'any.required': 'Giá biến thể là bắt buộc',
        'number.base': 'Cấp độ phải là số',
    }),
    stock: Joi.number().integer().required().messages({
        'number.integer': 'Cấp độ phải là số nguyên',
        'any.required': 'Giá biến thể là bắt buộc',
        'number.base': 'Cấp độ phải là số',
    }),
    discountId: Joi.string()
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
});
