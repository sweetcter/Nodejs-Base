import asyncHandler from '@/helpers/asyncHandler';
import { NextFunction, Request, Response } from 'express';
import { authService } from '@/services';

export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return authService.refresh(req, res, next);
});
