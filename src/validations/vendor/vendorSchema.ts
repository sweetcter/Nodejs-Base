import Joi from 'joi';

export const createVendorSchema = Joi.object({
    name: Joi.string().min(3).max(50).trim().required().messages({
        'string.empty': 'Tên nhà cung cấp không được để trống',
        'any.required': 'Tên nhà cung cấp là bắt buộc',
        'string.base': 'Tên nhà cung cấp phải là chuỗi',
        'string.min': 'Tên nhà cung cấp phải lớn hơn hoặc bằng 3 kí tự',
        'string.max': 'Tên nhà cung cấp phải nhỏ hơn 50 kí tự',
    }),
    description: Joi.string().optional().allow('').messages({
        'string.base': 'Mô tả phải là chuỗi',
    }),
});

export const updateVendorSchema = Joi.object({
    name: Joi.string().min(3).max(50).trim().optional().messages({
        'string.empty': 'Tên nhà cung cấp không được để trống',
        'string.base': 'Tên nhà cung cấp phải là chuỗi',
        'string.min': 'Tên nhà cung cấp phải lớn hơn hoặc bằng 3 kí tự',
        'string.max': 'Tên nhà cung cấp phải nhỏ hơn 100 kí tự',
    }),
    description: Joi.string().optional().allow('').messages({
        'string.base': 'Mô tả phải là chuỗi',
    }),
});
