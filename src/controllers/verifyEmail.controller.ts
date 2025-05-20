import asyncHandler from '@/helpers/asyncHandler';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Account from '@/models/Account';
import config from '@/config/env.config';
import { BadRequestError } from '@/error/customError';

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const token = req.query.token as string;

    if (!token) {
        throw new BadRequestError('Token xác thực không hợp lệ');
    }

    const decoded = jwt.verify(token, config.jwt.jwtAccessTokenKey) as any;
    const userId = decoded.userId;

    const account = await Account.findById(userId);
    if (!account) throw new BadRequestError('Tài khoản không tồn tại');

    if (account.isVerified) {
        return res.status(200).json({ message: 'Tài khoản đã được xác thực từ trước.' });
    }

    account.isVerified = true;
    await account.save();

    return res.status(200).json({ message: 'Xác thực tài khoản thành công!' });
});
