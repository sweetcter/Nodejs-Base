import asyncHandler from '@/helpers/asyncHandler';
import { vendorService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createVendor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return vendorService.createVendor(req, res, next);
});
export const updateVendor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return vendorService.updateVendor(req, res, next);
});

export const getAllVendors = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return vendorService.getAllVendors(req, res, next);
});

export const getDetailVendor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return vendorService.getDetailVendor(req, res, next);
});
