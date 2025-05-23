import { BadRequestError, NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Cart from '@/models/Cart';
import ProductVariant from '@/models/ProductVariant';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getUserCart = async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ userId: req.userId });
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: cart,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
    const { variantId } = req.body;
    let quantity = req.body.quantity > 0 ? req.body.quantity : 1;
    const cart = await Cart.findOne({ userId: req.userId });
    const variants = await ProductVariant.findOne({ _id: variantId });
    const isItemExits = cart?.items.find((item) => item.variantId.toString() === variantId);

    if (!variants) {
        throw new BadRequestError('Sản phẩm này không tồn tại');
    }

    if (quantity > variants.stock) {
        quantity = variants.stock;
    }

    if (isItemExits) {
        await Cart.updateOne(
            { userId: req.userId, 'items.variantId': variantId },
            {
                $set: {
                    'items.$.quantity': quantity,
                },
            },
        );
    } else {
        await Cart.updateOne(
            { userId: req.userId },
            {
                $push: {
                    items: {
                        variantId,
                        quantity,
                    },
                },
            },
        );
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
    const { variantId } = req.body;
    let quantity = req.body.quantity > 0 ? req.body.quantity : 1;

    const cart = await Cart.findOne({ userId: req.userId });
    const variants = await ProductVariant.findOne({ _id: variantId });
    const cartItem = cart?.items.find((item) => item.variantId.toString() === variantId);

    if (!cartItem || !variants) {
        throw new BadRequestError('Sản phẩm không tồn tại trong giỏ hàng');
    }

    if (quantity > variants.stock) {
        quantity = variants.stock;
    }

    await Cart.updateOne(
        { userId: req.userId },
        {
            $set: {
                'items.$[elem].quantity': quantity,
            },
        },
        {
            arrayFilters: [{ 'elem.variantId': variantId }],
        },
    );

    return res.status(StatusCodes.NO_CONTENT).json(
        customResponse({
            data: null,
            message: ReasonPhrases.NO_CONTENT,
            status: StatusCodes.NO_CONTENT,
        }),
    );
};

export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
    const foundedItem = await Cart.findByIdAndUpdate(
        { userId: req.userId },
        {
            $pull: { items: req.body.variantId },
        },
    );

    if (!foundedItem) {
        throw new NotFoundError('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    return res.status(StatusCodes.NO_CONTENT).json(
        customResponse({
            data: null,
            message: ReasonPhrases.NO_CONTENT,
            status: StatusCodes.NO_CONTENT,
        }),
    );
};
