import asyncHandler from '@/helpers/asyncHandler';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import Account from '@/models/Account';
import { createAccountSchema } from '@/validations/account/accountSchema';
import { BadRequestError } from '@/error/customError';
import { authService } from '@/services';
import { generateAuthTokens } from '@/services/token.service';
import config from '@/config/env.config';

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const account = await Account.findOne({ email });
    if (!account || !account.password) {
        throw new BadRequestError('Tài khoản hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
        throw new BadRequestError('Tài khoản hoặc mật khẩu không đúng');
    }

    const { accessToken, refreshToken } = generateAuthTokens(account);

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

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = createAccountSchema.validate(req.body);
    if (error) {
        throw new BadRequestError(error.details[0].message);
    }

    // Kiểm tra email đã tồn tại chưa
    const existingAccount = await Account.findOne({ email: value.email });
    if (existingAccount) {
        throw new BadRequestError('Email đã được đăng ký');
    }

    // Hash password trước khi tạo tài khoản
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // Tạo đối tượng account mới với password đã hash
    const accountData = { ...value, password: hashedPassword };

    const account = await Account.create(accountData);

    const { password, ...accountSafe } = account.toObject();

    return res.status(201).json({
        statusCode: 201,
        message: 'Tạo tài khoản thành công',
        data: accountSafe,
    });
});

export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return authService.refresh(req, res, next);
});

export const authController = {
    login,
    register,
    refresh,
};
