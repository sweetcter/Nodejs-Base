import asyncHandler from '@/helpers/asyncHandler';
import { categoryService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return categoryService.createCategory(req, res, next);
});

export const getAllCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return categoryService.getAllCategories(req, res, next);
});

export const getDetailCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return categoryService.getDetailCategory(req, res, next);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return categoryService.updateCategory(req, res, next);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return categoryService.deleteCategory(req, res, next);
});
