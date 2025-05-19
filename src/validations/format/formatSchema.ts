import Joi from 'joi';

export const createFormatSchema = Joi.object({
    name: Joi.string().min(3).max(50).trim().required().messages({
        'string.empty': 'Tên định dạng không được để trống',
        'any.required': 'Tên định dạng là bắt buộc',
        'string.base': 'Tên định dạng phải là chuỗi',
        'string.min': 'Tên định dạng phải lớn hơn hoặc bằng 3 kí tự',
        'string.max': 'Tên định dạng phải nhỏ hơn 50 kí tự',
    }),
});

export const updateFormatSchema = Joi.object({
    name: Joi.string().min(3).max(50).trim().optional().messages({
        'string.empty': 'Tên định dạng không được để trống',
        'string.base': 'Tên định dạng phải là chuỗi',
        'string.min': 'Tên định dạng phải lớn hơn hoặc bằng 3 kí tự',
        'string.max': 'Tên định dạng phải nhỏ hơn 100 kí tự',
    }),
});
