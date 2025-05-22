import asyncHandler from '@/helpers/asyncHandler';
import { Request, Response, NextFunction } from 'express';
import { createAccountSchema, loginSchema } from '@/validations/account/accountSchema';
import { BadRequestError } from '@/error/customError';
import { authService } from '@/services/auth.service';
import config from '@/config/env.config';

const login = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        throw new BadRequestError(error.details[0].message);
    }

    const { usernameOrEmail, password } = value;
    const { accessToken,refreshToken } = await authService.login(usernameOrEmail, password);

      res.cookie('jwt', refreshToken, {
        maxAge: config.cookie.maxAge,
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'lax',
    });

    return res.status(200).json({
        statusCode: 200,
        message: 'Đăng nhập thành công',
        token: accessToken,
    });
});

const register = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = createAccountSchema.validate(req.body);
    if (error) {
        throw new BadRequestError(error.details[0].message);
    }

    const { email, provider, password, username, phoneNumber } = value;
    const accountSafe = await authService.register({
        email,
        provider,
        password,
        username,
        phoneNumber,
    });

    return res.status(201).json({
        statusCode: 201,
        message: 'Tạo tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
        data: accountSafe,
    });
});

const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return authService.refresh(req, res, next);
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
        throw new BadRequestError('Token xác minh không hợp lệ');
    }

    await authService.verifyEmail(token);

    return res.status(200).json({
        statusCode: 200,
        message: 'Xác minh tài khoản thành công',
    });
});

const resendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
        throw new BadRequestError('Vui lòng cung cấp email hợp lệ');
    }

    await authService.resendVerificationEmail(email);

    return res.status(200).json({
        statusCode: 200,
        message: 'Email xác minh đã được gửi lại. Vui lòng kiểm tra email của bạn.',
    });
});

const authController = {
    login,
    register,
    refresh,
    verifyEmail,
    resendVerificationEmail,
};

export default authController;
