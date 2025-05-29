import Joi from 'joi';
import { Types } from 'mongoose';

export const addToCartSchema = Joi.object({
    variantId: Joi.string()
        .custom((value, helpers) => {
            if (value && !Types.ObjectId.isValid(value)) {
                return helpers.error('string.objectId');
            }
            return value;
        })
        .messages({
            'string.objectId': 'variantId phải là ObjectId hợp lệ',
        }),
    productId: Joi.string()
        .optional()
        .custom((value, helpers) => {
            if (value && !Types.ObjectId.isValid(value)) {
                return helpers.error('string.objectId');
            }
            return value;
        })
        .messages({
            'string.objectId': 'productId phải là ObjectId hợp lệ',
        }),
    quantity: Joi.number().integer().min(1).max(1000).default(1).messages({
        'number.min': 'Số lượng phải lớn hơn hoặc bằng 1',
        'number.max': 'Số lượng phải nhỏ hơn hoặc bằng 1000',
        'number.integer': 'Số lượng phải là số nguyên',
        'number.base': 'Số lượng phải là số',
    }),
});

export const updateQuantitySchema = Joi.object({
    variantId: Joi.string()
        .custom((value, helpers) => {
            if (value && !Types.ObjectId.isValid(value)) {
                return helpers.error('string.objectId');
            }
            return value;
        })
        .messages({
            'string.objectId': 'variantId phải là ObjectId hợp lệ',
        }),
    quantity: Joi.number().integer().min(1).max(1000).default(1).messages({
        'number.min': 'Số lượng phải lớn hơn hoặc bằng 1',
        'number.max': 'Số lượng phải nhỏ hơn hoặc bằng 1000',
        'number.integer': 'Số lượng phải là số nguyên',
        'number.base': 'Số lượng phải là số',
    }),
});
