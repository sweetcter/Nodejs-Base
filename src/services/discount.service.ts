import customResponse from '@/helpers/response';
import Discount from '@/models/Discount';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getAllDiscounts = async (req: Request, res: Response, next: NextFunction) => {
    const discounts = await Discount.find();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: discounts,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};
