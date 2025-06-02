import config from '@/config/env.config';
import { NotAcceptableError, UnAuthenticatedError } from '@/error/customError';
import Token from '@/models/Token';
import jwt, { SignOptions } from 'jsonwebtoken';
import mongoose from 'mongoose';

export const generateToken = (user: any, key: string, expires: SignOptions['expiresIn']) => {
    const payload = { userId: user._id, role: user.role };
    const secreteKey = key;
    return jwt.sign(payload, secreteKey, { expiresIn: expires });
};

export const saveToken = async (token: string, userId: string, type: string) => {
    return await Token.create({ token, userId, type });
};

export const deleteToken = async (userId: string, type: string) => {
    return await Token.deleteMany({ userId, type });
};

export const verifyToken = async (token: string, secretKey: string, type: string) => {
    try {
        jwt.verify(token, secretKey);
    } catch {
        throw new UnAuthenticatedError('Token xác minh không hợp lệ.');
    }
    const foundedToken = await Token.findOne({ token: token, type: type }).populate<{
        userId: { _id: mongoose.Types.ObjectId; role: string };
    }>({
        path: 'userId',
        select: 'role _id',
    });

    if (!foundedToken) {
        throw new UnAuthenticatedError('Token xác minh không hợp lệ');
    }
    return foundedToken;
};

export const generateAuthTokens = (user: any) => {
    const accessToken = generateToken(user, config.jwt.jwtAccessTokenKey, config.jwt.jwtAccessExpiration);
    const refreshToken = generateToken(user, config.jwt.jwtRefreshTokenKey, config.jwt.jwtRefreshExpiration);
    return { accessToken, refreshToken };
};
