import customResponse from '@/helpers/response';
import Category from '@/models/Category';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const category = new Category(req.body);
    await category.save();

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: null,
            success: true,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
        }),
    );
};

export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find();

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: categories,
            success: true,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
        }),
    );
};
