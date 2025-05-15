import config from '@/config/env.config';
import { UnAuthenticatedError } from '@/error/customError';
import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

type JwtPayload = {
    userId: string;
    role: string;
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || (req.headers.Authorization as string);

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return next(new UnAuthenticatedError('Token: Invalidated access!'));
    }

    const token = authHeader.split(' ')?.[0];

    jwt.verify(token, config.jwt.JWT_ACCESS_TOKEN_KEY, function (err: VerifyErrors | null, decoded: any) {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new UnAuthenticatedError('Token is expired.'));
            }
            if (err.name === 'JsonWebTokenError') {
                return next(new UnAuthenticatedError('Invalid token'));
            }
            return next(new UnAuthenticatedError('Token verification failed.'));
        }

        const { userId, role } = decoded as JwtPayload;

        req.userId = userId;
        req.role = role;
    });

    next();
};
