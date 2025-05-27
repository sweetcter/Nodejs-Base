import { UnAuthorizedError } from '@/error/customError';
import { NextFunction, Request, Response } from 'express';

export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.role) {
            return next(new UnAuthorizedError('Chưa xác định quyền truy cập'));
        }
        if (!allowedRoles.includes(req.role)) {
            return next(new UnAuthorizedError('No permission to access!'));
        }
        next();
    };
};
