import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@/config/env.config';
import { Token } from '@/constants/token';
import customResponse from '@/helpers/response';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { tokenService } from '.';
import { generateAuthTokens, generateToken } from './token.service';
import Account from '@/models/Account';
import User from '@/models/User';
import { BadRequestError } from '@/error/customError';
import { mailSender } from '@/helpers/mail.sender';

interface RegisterData {
    email: string;
    provider: string;
    password?: string;
    username: string;
    phoneNumber?: string;
}

export const authService = {
    refresh: async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.jwt;

        const foundedToken = await tokenService.verifyToken(token, config.jwt.jwtRefreshTokenKey, Token.REFRESH);

        const user = {
            userId: req.userId,
            role: req.role,
        };

        const { accessToken, refreshToken } = generateAuthTokens(user);

        foundedToken.token = refreshToken;

        await foundedToken.save();

        res.cookie('jwt', refreshToken, {
            maxAge: config.cookie.maxAge,
            httpOnly: true,
            secure: config.env === 'production',
            sameSite: 'lax',
        });

        return res.status(StatusCodes.OK).json(
            customResponse({
                data: accessToken,
                message: ReasonPhrases.OK,
                status: StatusCodes.OK,
            }),
        );
    },

    login: async (usernameOrEmail: string, password: string) => {
        // Tìm User bằng username hoặc email
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (!user) {
            throw new BadRequestError('Tài khoản hoặc mật khẩu không đúng');
        }

        // Tìm Account với userId và provider: email
        const account = await Account.findOne({
            userId: user._id,
            provider: 'email',
        }).select('+password');

        if (!account || !account.password) {
            throw new BadRequestError('Tài khoản hoặc mật khẩu không đúng');
        }

        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            throw new BadRequestError('Tài khoản hoặc mật khẩu không đúng');
        }

        if (!account.isVerified) {
            throw new BadRequestError('Tài khoản chưa được xác thực qua email');
        }

        return generateAuthTokens({ userId: user._id, role: user.role });
    },

    register: async (data: RegisterData) => {
        const { email, provider, password, username, phoneNumber } = data;

        if (provider !== 'email') {
            throw new BadRequestError('Hiện tại chỉ hỗ trợ đăng ký bằng email');
        }

        // Kiểm tra email và provider trùng
        const existingAccount = await Account.findOne({ email, provider });
        if (existingAccount) {
            throw new BadRequestError('Tài khoản với email và provider này đã tồn tại');
        }

        // Tìm userId từ Account hiện có hoặc tạo User mới
        let user;
        const accountWithEmail = await Account.findOne({ email });
        if (accountWithEmail) {
            // Email đã tồn tại trong Account, sử dụng userId hiện có
            user = await User.findById(accountWithEmail.userId);
            if (!user) {
                throw new BadRequestError('Không tìm thấy User liên kết với email này');
            }
            // Cập nhật thông tin User
            user.username = username;
            user.phoneNumber = phoneNumber || user.phoneNumber;
            await user.save();
        } else {
            // Email chưa tồn tại, tạo User mới
            user = await User.create({
                username,
                email,
                phoneNumber,
                password,
            });
        }

        // Tạo tài khoản Account
        const accountData = {
            userId: user._id,
            provider,
            email,
            phoneNumber,
            password: password ? await bcrypt.hash(password, 10) : undefined,
            isVerified: false,
        };

        const account = await Account.create(accountData);

        // Gửi email xác minh
        await authService.sendVerificationEmail(account);

        const { password: _, ...accountSafe } = account.toObject();
        return { ...accountSafe, username: user.username };
    },

    verifyEmail: async (token: string) => {
        try {
            const decoded = jwt.verify(
                token,
                (config.jwt as any).jwtVerificationTokenKey || config.jwt.jwtAccessTokenKey,
            ) as { id: string };
            const account = await Account.findById(decoded.id);
            if (!account) {
                throw new BadRequestError('Tài khoản không tồn tại');
            }
            if (account.isVerified) {
                throw new BadRequestError('Tài khoản đã được xác minh');
            }
            account.isVerified = true;
            await account.save();
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new BadRequestError('Token xác minh đã hết hạn. Vui lòng yêu cầu gửi lại email xác minh.');
            }
            throw new BadRequestError('Token không hợp lệ');
        }
    },

    resendVerificationEmail: async (email: string) => {
        const account = await Account.findOne({ email, provider: 'email' });
        if (!account) {
            throw new BadRequestError('Tài khoản không tồn tại');
        }
        if (account.isVerified) {
            throw new BadRequestError('Tài khoản đã được xác minh');
        }

        await authService.sendVerificationEmail(account);
    },

    sendVerificationEmail: async (account: any) => {
        const verificationToken = generateToken(
            account,
            (config.jwt as any).jwtVerificationTokenKey || config.jwt.jwtAccessTokenKey,
            '30m',
        );
        const verifyUrl = `${config.clientUrl}/verify-email?token=${verificationToken}`;

        try {
            await mailSender({
                email: account.email,
                subject: 'Xác thực tài khoản của bạn',
                html: `
          <p>Chào mừng bạn đến với dịch vụ của chúng tôi!</p>
          <p>Vui lòng bấm vào nút dưới đây để xác thực tài khoản:</p>
          <a href="${verifyUrl}" style="padding: 10px 20px; background: green; color: white; text-decoration: none;">Xác thực tài khoản</a>
          <p><strong>Lưu ý:</strong> Liên kết này chỉ có hiệu lực trong 30 phút. Nếu liên kết hết hạn, bạn có thể yêu cầu gửi lại email xác minh.</p>`,
            });
        } catch (error) {
            throw new BadRequestError('Không thể gửi email xác minh. Vui lòng thử lại sau.');
        }
    },
};

export default authService;
