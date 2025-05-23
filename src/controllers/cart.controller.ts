import asyncHandler from '@/helpers/asyncHandler';
import { cartService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const getUserCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return cartService.getUserCart(req, res, next);
});
export const addItemToCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return cartService.addItemToCart(req, res, next);
});
export const updateCartItemQuantity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return cartService.updateCartItemQuantity(req, res, next);
});
export const removeCartItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return cartService.removeCartItem(req, res, next);
});
