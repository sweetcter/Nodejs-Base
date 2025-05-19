import asyncHandler from '@/helpers/asyncHandler';
import { formatService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createFormat = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return formatService.createFormat(req, res, next);
});

export const getAllFormats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return formatService.getAllFormats(req, res, next);
});

export const getDetailFormat = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return formatService.getDetailFormat(req, res, next);
});

export const updateFormat = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return formatService.updateFormat(req, res, next);
});
