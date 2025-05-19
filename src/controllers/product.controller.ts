import asyncHandler from '@/helpers/asyncHandler';
import { productService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.createProduct(req, res, next);
});

export const hiddenProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.hiddenProduct(req, res, next);
});
