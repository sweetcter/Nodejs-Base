import asyncHandler from '@/helpers/asyncHandler';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import Account from '@/models/Account';
import { createAccountSchema } from '@/validations/account/accountSchema';
import { BadRequestError } from '@/error/customError';
import { generateAuthTokens, generateToken } from '@/services/token.service';
import { mailSender } from '@/helpers/mail.sender';
import config from '@/config/env.config';
import authService from '@/services/auth.service';

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
    if (!account.isVerified) {
        throw new BadRequestError('Tài khoản chưa được xác thực qua email');
    }

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

    // Hash password
    const hashedPassword = await bcrypt.hash(value.password, 10);

    const accountData = { ...value, password: hashedPassword };

    const account = await Account.create(accountData);

    // Tạo token xác thực email
    const verificationToken = generateToken(account, config.jwt.jwtAccessTokenKey, '1d');
    const verifyUrl = `${config.clientUrl}/verify-email?token=${verificationToken}`;

    // Gửi mail
    await mailSender({
        email: account.email as string,
        subject: 'Xác thực tài khoản của bạn',
        html: `
            <p>Chào mừng bạn đến với dịch vụ của chúng tôi!</p>
            <p>Vui lòng bấm vào nút dưới đây để xác thực tài khoản:</p>
            <a href="${verifyUrl}" style="padding: 10px 20px; background: green; color: white; text-decoration: none;">Xác thực tài khoản</a>        `,
    });

    const { password, ...accountSafe } = account.toObject();

    return res.status(201).json({
        statusCode: 201,
        message: 'Tạo tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
        data: accountSafe,
    });
});

export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return authService.refresh(req, res, next);
});

export const authController = {
    login,
    register,
};
export function verifyEmail(arg0: string, verifyEmail: any) {
    throw new Error('Function not implemented.');
}

