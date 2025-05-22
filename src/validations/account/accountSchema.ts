import Joi from 'joi';

export const createAccountSchema = Joi.object({
    username: Joi.string().trim().min(3).max(50).required().messages({
        'string.min': 'Tên người dùng phải lớn hơn hoặc bằng 3 ký tự',
        'string.max': 'Tên người dùng phải nhỏ hơn hoặc bằng 50 ký tự',
        'any.required': 'Tên người dùng là bắt buộc',
        'string.empty': 'Tên người dùng không được để trống',
    }),

    email: Joi.string().email().trim().required().messages({
        'string.email': 'Email phải đúng định dạng',
        'any.required': 'Email là bắt buộc',
        'string.empty': 'Email không được để trống',
    }),

    phoneNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Số điện thoại phải là số và có độ dài từ 10 đến 15 ký tự',
        }),

    provider: Joi.string().valid('email', 'google').required().messages({
        'any.only': 'Provider phải là một trong các giá trị: email, google',
        'any.required': 'Provider là bắt buộc',
    }),

    password: Joi.string()
        .min(6)
        .max(100)
        .when('provider', {
            is: Joi.valid('email'),
            then: Joi.required(),
            otherwise: Joi.optional(),
        })
        .messages({
            'string.min': 'Mật khẩu phải lớn hơn hoặc bằng 6 ký tự',
            'string.max': 'Mật khẩu phải nhỏ hơn hoặc bằng 100 ký tự',
            'any.required': 'Mật khẩu là bắt buộc khi provider là email',
            'string.empty': 'Mật khẩu không được để trống khi provider là email',
        }),
});

export const loginSchema = Joi.object({
    usernameOrEmail: Joi.string().trim().required().messages({
        'any.required': 'Tên người dùng hoặc email là bắt buộc',
        'string.empty': 'Tên người dùng hoặc email không được để trống',
    }),

    password: Joi.string().min(6).max(100).required().messages({
        'string.min': 'Mật khẩu phải lớn hơn hoặc bằng 6 ký tự',
        'string.max': 'Mật khẩu phải nhỏ hơn hoặc bằng 100 ký tự',
        'any.required': 'Mật khẩu là bắt buộc',
        'string.empty': 'Mật khẩu không được để trống',
    }),
});
