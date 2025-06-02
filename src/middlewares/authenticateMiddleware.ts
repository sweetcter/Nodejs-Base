import config from '@/config/env.config';
import { UnAuthenticatedError } from '@/error/customError';
import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

type JwtPayload = {
    userId: string;
    role: string;
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.jwt) {
        return next(new UnAuthenticatedError('Token không tồn tại!'));
    }

    const authHeader = req.headers.authorization || (req.headers.Authorization as string);

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return next(new UnAuthenticatedError('Token không tồn tại!'));
    }

    const token = authHeader.split(' ')?.[1];

    jwt.verify(token, config.jwt.jwtAccessTokenKey, function (err: VerifyErrors | null, decoded: any) {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new UnAuthenticatedError('Token đã hết hạn.'));
            }
            if (err.name === 'JsonWebTokenError') {
                return next(new UnAuthenticatedError('Token không hợp lệ'));
            }
            return next(new UnAuthenticatedError('Xác minh token thất bại.'));
        }

        const { userId, role } = decoded as JwtPayload;

        req.userId = userId;
        req.role = role;
    });

    next();
};
