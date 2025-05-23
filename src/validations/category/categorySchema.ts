import Joi from 'joi';
import { Types } from 'mongoose';

export const createCategorySchema = Joi.object({
    name: Joi.string().min(3).max(50).trim().required().messages({
        'string.empty': 'Tên danh mục không được để trống',
        'any.required': 'Tên danh mục là bắt buộc',
        'string.base': 'Tên danh mục phải là chuỗi',
        'string.min': 'Tên danh mục phải lớn hơn hoặc bằng 3 kí tự',
        'string.max': 'Tên danh mục phải nhỏ hơn 50 kí tự',
    }),
    parentId: Joi.string()
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
    level: Joi.number().integer().min(1).max(4).default(1).messages({
        'number.min': 'Cấp độ phải lớn hơn hoặc bằng 1',
        'number.max': 'Cấp độ phải nhỏ hơn hoặc bằng 4',
        'number.integer': 'Cấp độ phải là số nguyên',
        'number.base': 'Cấp độ phải là số',
    }),
    description: Joi.string().optional().allow('').messages({
        'string.base': 'Mô tả phải là chuỗi',
    }),
});

export const updateCategorySchema = Joi.object({
    name: Joi.string().min(3).max(100).trim().optional().messages({
        'string.empty': 'Tên danh mục không được để trống',
        'string.base': 'Tên danh mục phải là chuỗi',
        'string.min': 'Tên danh mục phải lớn hơn hoặc bằng 3 kí tự',
        'string.max': 'Tên danh mục phải nhỏ hơn 100 kí tự',
    }),
    parentId: Joi.string()
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
    level: Joi.number().integer().min(1).max(4).optional().messages({
        'number.min': 'Cấp độ phải lớn hơn hoặc bằng 1',
        'number.integer': 'Cấp độ phải là số nguyên',
        'number.base': 'Cấp độ phải là số',
        'number.max': 'Cấp độ phải nhỏ hơn hoặc bằng 4',
    }),
    description: Joi.string().optional().allow('').messages({
        'string.base': 'Mô tả phải là chuỗi',
    }),
});
