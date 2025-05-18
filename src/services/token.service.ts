import config from '@/config/env.config';
import { NotAcceptableError } from '@/error/customError';
import Token from '@/models/Token';
import jwt, { SignOptions } from 'jsonwebtoken';

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
    const decoded = jwt.verify(token, secretKey);

    if (!decoded) {
        throw new NotAcceptableError('Không chấp nhận: token xác minh không hợp lệ.');
    }
    const foundedToken = await Token.findOne({ token: token, type: type });

    if (!foundedToken) {
        throw new NotAcceptableError('Không chấp nhận: token xác minh không hợp lệ');
    }
    return foundedToken;
};

export const generateAuthTokens = (user: any) => {
    const accessToken = generateToken(user, config.jwt.jwtAccessTokenKey, config.jwt.jwtAccessExpiration);
    const refreshToken = generateToken(user, config.jwt.jwtRefreshTokenKey, config.jwt.jwtRefreshExpiration);
    return { accessToken, refreshToken };
};
