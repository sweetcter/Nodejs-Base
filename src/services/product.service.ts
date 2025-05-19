import { BadRequestError, NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Product from '@/models/Product';
import ProductVariant from '@/models/ProductVariant';
import { uploadMutipleFile, uploadSingleFile } from '@/utils/cloudinaryUploads';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldName: string]: Express.Multer.File | Express.Multer.File[] };
    const nameToLowerCase = req.body.name.toLowerCase();
    const body = { ...req.body, name: nameToLowerCase };
    const variants = JSON.parse(req.body.variants);
    const thumbnail = files.thumbnail as Express.Multer.File[];

    const foundedProduct = await Product.findOne({ name: nameToLowerCase });

    if (foundedProduct) {
        throw new BadRequestError('Sản phẩm đã tồn tại');
    }

    if (thumbnail && thumbnail.length > 0) {
        const upload = await uploadSingleFile(thumbnail[0] as Express.Multer.File);

        if (upload) {
            Object.assign(body, { thumbnail: upload.downloadURL, thumbnailRef: upload.urlRef });
        }
    }

    if (files.library) {
        const library = await uploadMutipleFile(files.library as Express.Multer.File[]);

        if (library) {
            Object.assign(body, {
                library: library.map((image) => ({ imageUrl: image.downloadURL, imageRef: image.urlRef })),
            });
        }
    }

    if (files.variantImages) {
        const variantsImages = await uploadMutipleFile(files.variantImages as Express.Multer.File[]);

        if (variantsImages) {
            for (const image of variantsImages) {
                for (const variant of variants) {
                    if (variant.imageRef === image.originName) {
                        variant.image = image.downloadURL;
                        variant.imageUrlRef = image.urlRef;
                    }
                }
            }
        }
    }

    const insertVariant = await ProductVariant.insertMany(variants);

    const uniqueFormatId = [...new Set(insertVariant.map((variant) => variant.formatId))];

    const variantIds = insertVariant.map((variant) => variant._id);

    Object.assign(body, { variantFormats: uniqueFormatId, variants: variantIds });

    const product = new Product(body);

    await product.save();

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: null,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
        }),
    );
};

export const hiddenProduct = async (req: Request, res: Response, next: NextFunction) => {
    const foundedProduct = await Product.findOneAndUpdate(
        { _id: req.params.id, isAvailable: true },
        { isAvailable: false },
    );

    if (!foundedProduct) {
        throw new NotFoundError('Sản phẩm không  tồn tại');
    }

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: null,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
        }),
    );
};
