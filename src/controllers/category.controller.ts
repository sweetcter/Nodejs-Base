import asyncHandler from '@/helpers/asyncHandler';
import { categoryService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return categoryService.createCategory(req, res, next);
});

export const getAllCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return categoryService.getAllCategory(req, res, next);
});
