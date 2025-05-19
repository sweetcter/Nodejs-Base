import Joi from 'joi';
import { Types } from 'mongoose';

export const createAccountSchema = Joi.object({
  userId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.error('string.objectId');
      }
      return value;
    })
    .messages({
      'any.required': 'UserId là bắt buộc',
      'string.objectId': 'UserId phải là ObjectId hợp lệ',
    }),

  provider: Joi.string()
    .valid('email', 'google')
    .required()
    .messages({
      'any.only': 'Provider phải là một trong các giá trị: email, google',
      'any.required': 'Provider là bắt buộc',
    }),

email: Joi.string()
  .email()
  .trim()
  .required()
  .messages({
    'string.email': 'Email phải đúng định dạng',
    'any.required': 'Email là bắt buộc',
    'string.empty': 'Email không được để trống',
  }),

  password: Joi.string()
    .min(6)
    .max(100)
    .allow(null, '')
    .when('provider', {
      is: Joi.valid('email'),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      'string.min': 'Mật khẩu phải lớn hơn hoặc bằng 6 ký tự',
      'string.max': 'Mật khẩu phải nhỏ hơn hoặc bằng 100 ký tự',
      'any.required': 'Mật khẩu là bắt buộc khi provider là email',
      'any.unknown': 'Mật khẩu không được phép khi provider không phải email',
    }),
});
