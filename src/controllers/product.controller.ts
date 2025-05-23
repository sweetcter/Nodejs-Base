import asyncHandler from '@/helpers/asyncHandler';
import { productService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.createProduct(req, res, next);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.updateProduct(req, res, next);
});

export const createProductVariant = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.createProductVariant(req, res, next);
});

export const updateProductVariant = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.updateProductVariant(req, res, next);
});

export const getAllProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.getAllProducts(req, res, next);
});
export const getNewProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.getNewProducts(req, res, next);
});
export const getBestSeller = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.getBestSeller(req, res, next);
});
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.getFeaturedProducts(req, res, next);
});
export const getDetailProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.getDetailProduct(req, res, next);
});
export const hiddenProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.hiddenProduct(req, res, next);
});

export const getAllVariantsByProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return productService.getVariantsByProduct(req, res, next);
});
