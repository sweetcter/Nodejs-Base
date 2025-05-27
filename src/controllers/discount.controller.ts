import asyncHandler from '@/helpers/asyncHandler';
import { discountService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const getAllDiscounts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return discountService.getAllDiscounts(req, res, next);
});
